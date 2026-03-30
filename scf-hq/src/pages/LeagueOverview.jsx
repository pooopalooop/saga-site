import { useAllTeamsCapState } from '../hooks/useTeamData'
import { SPORT_CONFIG } from '../lib/constants'

function SportCapCard({ sport, capStates }) {
  const config = SPORT_CONFIG[sport]
  const sportStates = capStates?.filter(cs => cs.sport === sport) || []

  return (
    <div className="bg-surface border border-border rounded overflow-hidden">
      <div
        className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3.5 py-2.5 border-b border-border flex justify-between items-center"
        style={{ color: `var(--color-${sport})` }}
      >
        <span>{config.label}</span>
        <span className="text-txt3 font-normal text-[10px]">${config.cap} CAP</span>
      </div>
      {sportStates.length === 0 ? (
        <div className="px-3.5 py-3 text-txt3 text-[11px] font-mono">No data</div>
      ) : (
        sportStates.map(cs => {
          const remaining = cs.total_cap - cs.spent
          const pct = (cs.spent / cs.total_cap) * 100
          const barColor = pct > 90 ? 'var(--color-red)' : pct > 75 ? 'var(--color-accent)' : `var(--color-${sport})`
          const textColor = remaining < 10 ? 'var(--color-red)' : remaining < 30 ? 'var(--color-accent)' : 'var(--color-txt2)'

          return (
            <div
              key={cs.id}
              className="px-3.5 py-2 border-b border-border grid items-center gap-2.5 text-[12px]"
              style={{ gridTemplateColumns: '80px 1fr 45px' }}
            >
              <span className="text-txt2 text-[12px]">{cs.teams?.name || '—'}</span>
              <div className="bg-surface3 rounded-[1px] h-[5px] overflow-hidden">
                <div
                  className="h-full rounded-[1px] transition-all duration-300"
                  style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}
                />
              </div>
              <span className="font-mono text-[11px] text-right" style={{ color: textColor }}>
                ${remaining}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}

export default function LeagueOverview() {
  const { data: capStates, isLoading } = useAllTeamsCapState()

  return (
    <div>
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-border">
        <div>
          <h1 className="font-condensed text-[22px] font-bold tracking-tight text-txt leading-none mb-1">
            League Overview
          </h1>
          <span className="text-[12px] text-txt2 font-mono">
            All 10 Teams &mdash; Cap Status
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-txt3 text-center py-12 font-mono text-[11px]">Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {['nfl', 'nba', 'mlb'].map(sport => (
            <SportCapCard key={sport} sport={sport} capStates={capStates} />
          ))}
        </div>
      )}
    </div>
  )
}
