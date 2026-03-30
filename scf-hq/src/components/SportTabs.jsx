import { SPORT_CONFIG } from '../lib/constants'

export default function SportTabs({ activeSport, onSelect }) {
  return (
    <div className="flex gap-1 mb-6">
      {['nfl', 'nba', 'mlb'].map(sport => {
        const config = SPORT_CONFIG[sport]
        const isActive = activeSport === sport
        return (
          <button
            key={sport}
            onClick={() => onSelect(sport)}
            className={`
              font-mono text-[11px] font-semibold tracking-wider px-4 py-1.5
              rounded-sm cursor-pointer border uppercase transition-all duration-75
              ${isActive
                ? ''
                : 'bg-surface2 text-txt2 border-border2 hover:text-txt'
              }
            `}
            style={isActive ? {
              background: `color-mix(in srgb, var(--color-${sport}) 12%, transparent)`,
              color: `var(--color-${sport})`,
              borderColor: `color-mix(in srgb, var(--color-${sport}) 40%, transparent)`,
            } : undefined}
          >
            {config.label}
          </button>
        )
      })}
    </div>
  )
}
