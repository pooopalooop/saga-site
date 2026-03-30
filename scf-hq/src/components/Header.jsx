import { useAuth } from '../lib/auth'
import { SPORT_CONFIG } from '../lib/constants'
import { useTeamCapState } from '../hooks/useTeamData'

export default function Header() {
  const { team, signOut, user } = useAuth()
  const { data: capStates } = useTeamCapState(team?.id)

  const capBySport = {}
  if (capStates) {
    for (const cs of capStates) {
      capBySport[cs.sport] = cs.total_cap - cs.spent
    }
  }

  return (
    <header className="bg-surface border-b border-border px-6 flex items-center justify-between h-[52px] sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="font-mono font-semibold text-[13px] tracking-wider text-accent uppercase">
          SCF<span className="text-txt3 mx-1.5">/</span>HQ
        </div>
        {team && (
          <div className="font-mono text-[11px] text-txt2 bg-surface3 border border-border2 px-2.5 py-0.5 rounded-sm">
            {team.name}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {['nfl', 'nba', 'mlb'].map(sport => (
          <div
            key={sport}
            className={`font-mono text-[11px] px-2.5 py-0.5 rounded-sm border cap-pill-${sport}`}
            style={{
              color: `var(--color-${sport})`,
              borderColor: `color-mix(in srgb, var(--color-${sport}) 30%, transparent)`,
              background: `color-mix(in srgb, var(--color-${sport}) 6%, transparent)`,
            }}
          >
            {SPORT_CONFIG[sport].label} ${capBySport[sport] ?? '—'}
          </div>
        ))}

        {user && (
          <button
            onClick={signOut}
            className="font-mono text-[11px] text-txt3 hover:text-txt2 ml-2 cursor-pointer"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  )
}
