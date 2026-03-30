import { useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { useTeamRoster, useTeamCapState } from '../hooks/useTeamData'
import { SPORT_CONFIG } from '../lib/constants'
import { supabase } from '../lib/supabase'
import SportTabs from '../components/SportTabs'

const DESTINATIONS = [
  { id: 'dl', label: 'DL', sub: 'Disabled List', desc: 'Uncapped', uncapped: true },
  { id: 'ir', label: 'IR', sub: 'Injured Reserve', desc: 'Uncapped', uncapped: true },
  { id: 'sspd', label: 'SSPD', sub: 'Suspended Reserve', desc: 'Uncapped', uncapped: true },
  { id: 'minors', label: 'MINORS', sub: 'Minor League', desc: 'Capped' },
]

function PlayerCard({ contract, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left bg-surface2 border rounded-sm p-2.5 px-3 cursor-pointer transition-all duration-75
        flex items-center justify-between
        ${selected
          ? 'border-accent bg-[rgba(245,166,35,0.08)]'
          : 'border-border2 hover:border-accent hover:bg-surface3'
        }
      `}
    >
      <span className="text-[13px] font-medium text-txt">{contract.players?.name}</span>
      <div className="flex flex-col items-end gap-0.5">
        <span className="font-mono text-[10px] text-txt3">{contract.players?.position}</span>
        <span className="font-mono text-[11px] text-accent font-semibold">${contract.salary}</span>
      </div>
    </button>
  )
}

function DestCard({ dest, slotInfo, selected, onClick }) {
  const slotsText = dest.uncapped
    ? 'UNCAPPED'
    : `${slotInfo.used}/${slotInfo.max}`
  const slotsColor = dest.uncapped
    ? 'text-green'
    : slotInfo.used >= slotInfo.max ? 'text-red' : slotInfo.used >= slotInfo.max - 1 ? 'text-accent' : 'text-green'

  return (
    <button
      onClick={onClick}
      className={`
        bg-surface2 border rounded-sm p-3.5 px-3 cursor-pointer transition-all duration-75 text-center
        ${selected
          ? 'border-accent bg-[rgba(245,166,35,0.08)]'
          : 'border-border2 hover:border-border2 hover:bg-surface3'
        }
      `}
    >
      <div className="font-mono text-[13px] font-semibold text-txt mb-1">{dest.label}</div>
      <div className="text-[11px] text-txt3 leading-tight">{dest.sub}</div>
      <div className={`font-mono text-[10px] mt-1.5 ${slotsColor}`}>{slotsText}</div>
    </button>
  )
}

function ValidationRow({ label, status, detail }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3.5 border-b border-border last:border-b-0 text-[13px]">
      <span className="text-txt2">{label}</span>
      {status === 'pass' && (
        <span className="font-mono text-[11px] text-green flex items-center gap-1">&#10003; {detail || 'Pass'}</span>
      )}
      {status === 'fail' && (
        <span className="font-mono text-[11px] text-red flex items-center gap-1">&#10007; {detail || 'Fail'}</span>
      )}
      {status === 'pending' && (
        <span className="font-mono text-[11px] text-txt3">&mdash;</span>
      )}
    </div>
  )
}

export default function DlIrPage() {
  const [sport, setSport] = useState('nfl')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [selectedDest, setSelectedDest] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(null)

  const { team } = useAuth()
  const { data: allContracts } = useTeamRoster(team?.id)
  const { data: capStates } = useTeamCapState(team?.id)
  const queryClient = useQueryClient()

  const config = SPORT_CONFIG[sport]
  const capState = capStates?.find(cs => cs.sport === sport)

  // Active players eligible to be moved
  const activePlayers = useMemo(() =>
    (allContracts || []).filter(c => c.sport === sport && c.status === 'active'),
    [allContracts, sport]
  )

  // Slot counts per destination
  const slotCounts = useMemo(() => {
    const contracts = allContracts?.filter(c => c.sport === sport) || []
    return {
      dl: { used: contracts.filter(c => c.status === 'dl').length, max: Infinity },
      ir: { used: contracts.filter(c => c.status === 'ir').length, max: Infinity },
      sspd: { used: contracts.filter(c => c.status === 'sspd').length, max: Infinity },
      minors: {
        used: contracts.filter(c => c.status === 'minors').length,
        max: config.minorsSlots,
      },
    }
  }, [allContracts, sport, config])

  // Validation
  const validation = useMemo(() => {
    if (!selectedPlayer || !selectedDest) {
      return { slotAvail: 'pending', eligible: 'pending', rosterImpact: 'pending', capImpact: 'pending', canSubmit: false }
    }
    const dest = DESTINATIONS.find(d => d.id === selectedDest)
    const slots = slotCounts[selectedDest]

    const slotAvail = dest.uncapped ? 'pass' : (slots.used < slots.max ? 'pass' : 'fail')
    const eligible = 'pass' // DL/IR/SSPD don't have eligibility requirements
    const rosterImpact = 'pass'
    const capImpact = 'pass' // salary stays on cap regardless of designation

    return {
      slotAvail,
      slotAvailDetail: dest.uncapped ? 'Uncapped' : `${slots.used}/${slots.max} used`,
      eligible,
      rosterImpact,
      rosterImpactDetail: 'Opens 1 active slot',
      capImpact,
      capImpactDetail: 'Salary stays on cap',
      canSubmit: slotAvail !== 'fail',
    }
  }, [selectedPlayer, selectedDest, slotCounts])

  const moveMutation = useMutation({
    mutationFn: async () => {
      const contract = selectedPlayer
      const destId = selectedDest

      // Update contract status
      const { error: updateErr } = await supabase
        .from('contracts')
        .update({ status: destId, updated_at: new Date().toISOString() })
        .eq('id', contract.id)

      if (updateErr) throw updateErr

      // Insert transaction
      const { error: txErr } = await supabase
        .from('transactions')
        .insert({
          type: `move_to_${destId}`,
          team_id: team.id,
          player_id: contract.player_id,
          sport,
          notes: `${contract.players?.name} moved to ${destId.toUpperCase()}`,
          submitted_by: null,
        })

      if (txErr) throw txErr
    },
    onSuccess: () => {
      setSubmitSuccess({
        player: selectedPlayer.players?.name,
        dest: selectedDest.toUpperCase(),
      })
      setSelectedPlayer(null)
      setSelectedDest(null)
      queryClient.invalidateQueries({ queryKey: ['roster'] })
      queryClient.invalidateQueries({ queryKey: ['cap_state'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  function handleSportChange(s) {
    setSport(s)
    setSelectedPlayer(null)
    setSelectedDest(null)
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-border">
        <div>
          <h1 className="font-condensed text-[22px] font-bold tracking-tight text-txt leading-none mb-1">
            DL / IR / Reserve
          </h1>
          <span className="text-[12px] text-txt2 font-mono">Roster designation moves</span>
        </div>
      </div>

      <SportTabs activeSport={sport} onSelect={handleSportChange} />

      <div className="grid grid-cols-2 gap-4">
        {/* Left: Player Select */}
        <div className="bg-surface border border-border rounded p-5">
          <div className="font-mono text-[10px] tracking-wider text-txt3 uppercase mb-4 pb-2.5 border-b border-border">
            Select Player
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-[400px] overflow-y-auto">
            {activePlayers.map(c => (
              <PlayerCard
                key={c.id}
                contract={c}
                selected={selectedPlayer?.id === c.id}
                onClick={() => setSelectedPlayer(c)}
              />
            ))}
            {activePlayers.length === 0 && (
              <div className="col-span-2 text-txt3 text-center py-6 font-mono text-[11px]">
                No active players
              </div>
            )}
          </div>
        </div>

        {/* Right: Destination + Validation */}
        <div>
          {/* Destination Cards */}
          <div className="bg-surface border border-border rounded p-5 mb-4">
            <div className="font-mono text-[10px] tracking-wider text-txt3 uppercase mb-4 pb-2.5 border-b border-border">
              Destination
            </div>
            <div className="grid grid-cols-4 gap-2">
              {DESTINATIONS.map(dest => (
                <DestCard
                  key={dest.id}
                  dest={dest}
                  slotInfo={slotCounts[dest.id]}
                  selected={selectedDest === dest.id}
                  onClick={() => setSelectedDest(dest.id)}
                />
              ))}
            </div>
          </div>

          {/* Info Box */}
          {selectedDest && (
            <div className="bg-surface2 border border-[rgba(245,166,35,0.3)] rounded-sm p-3 mb-4 text-[12px] text-txt2">
              {selectedDest === 'dl' && 'DL is uncapped per league rules. Player salary remains on your cap.'}
              {selectedDest === 'ir' && 'IR is uncapped per league rules. Player salary remains on your cap.'}
              {selectedDest === 'sspd' && 'Suspended reserve — uncapped. Requires official league/real-world suspension.'}
              {selectedDest === 'minors' && `Minors slots: ${slotCounts.minors.used}/${slotCounts.minors.max} used. Player salary remains on cap.`}
            </div>
          )}

          {/* Validation Panel */}
          <div className="bg-surface2 border border-border2 rounded-sm overflow-hidden mb-4">
            <div className="font-mono text-[10px] tracking-wider uppercase px-3.5 py-2.5 border-b border-border flex items-center gap-2 text-txt3">
              Validation
            </div>
            <ValidationRow label="Slot available" status={validation.slotAvail} detail={validation.slotAvailDetail} />
            <ValidationRow label="Eligibility" status={validation.eligible} />
            <ValidationRow label="Roster impact" status={validation.rosterImpact} detail={validation.rosterImpactDetail} />
            <ValidationRow label="Cap impact" status={validation.capImpact} detail={validation.capImpactDetail} />
          </div>

          {/* Submit */}
          <div className="flex gap-2.5 justify-end pt-4 border-t border-border">
            <button
              onClick={() => { setSelectedPlayer(null); setSelectedDest(null) }}
              className="font-mono text-[12px] font-semibold tracking-wider uppercase py-2.5 px-5 rounded-sm cursor-pointer border border-border2 bg-transparent text-txt2 hover:bg-surface2 hover:text-txt transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => moveMutation.mutate()}
              disabled={!validation.canSubmit || !selectedPlayer || !selectedDest || moveMutation.isPending}
              className="font-mono text-[12px] font-semibold tracking-wider uppercase py-2.5 px-6 rounded-sm cursor-pointer border-none bg-accent text-black hover:bg-accent2 transition-colors disabled:bg-surface3 disabled:text-txt3 disabled:cursor-not-allowed"
            >
              {moveMutation.isPending ? 'Submitting...' : 'Submit Move'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      {submitSuccess && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-[200] flex items-center justify-center"
          onClick={() => setSubmitSuccess(null)}
        >
          <div className="bg-surface border border-green rounded-md p-8 px-10 text-center max-w-[400px] animate-[popIn_0.2s_ease]">
            <div className="text-[36px] mb-3">&#10003;</div>
            <div className="font-condensed text-[20px] font-bold text-green mb-2">Move Submitted</div>
            <div className="text-[13px] text-txt2 mb-5">
              {submitSuccess.player} moved to {submitSuccess.dest}
            </div>
            <button
              onClick={() => setSubmitSuccess(null)}
              className="font-mono text-[12px] font-semibold tracking-wider uppercase py-2.5 px-6 rounded-sm cursor-pointer border-none bg-accent text-black hover:bg-accent2 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
