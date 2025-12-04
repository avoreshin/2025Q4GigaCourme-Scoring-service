interface CategoryChartProps {
  category: {
    key: string
    label: string
    icon: React.ReactNode
  }
  score: number
}

export default function CategoryChart({ category, score }: CategoryChartProps) {
  const percentage = Math.max(0, Math.min(score, 100))
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-primary'
    if (score >= 40) return 'text-risk-medium'
    return 'text-destructive'
  }

  return (
    <div className="glass rounded-lg p-6 flex flex-col items-center text-center hover:shadow-card-hover transition-all">
      <div className="mb-4 text-4xl">{category.icon}</div>
      <div className="relative w-32 h-32 mb-4">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="rgb(38, 40, 40)"
            strokeWidth="6"
            fill="none"
            opacity="0.3"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="url(#gradient-chart)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient-chart" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(32, 139, 155)" />
              <stop offset="100%" stopColor="rgb(45, 166, 178)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(0)}
          </div>
        </div>
      </div>
      <h3 className="text-body-sm font-medium text-foreground mb-1">{category.label}</h3>
      <p className="text-body-xs text-muted-foreground">{category.key}</p>
    </div>
  )
}

