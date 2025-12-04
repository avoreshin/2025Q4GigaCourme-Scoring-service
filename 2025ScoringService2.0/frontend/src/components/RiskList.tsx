import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

interface Risk {
  description?: string
  probability?: number
  impact?: string
  mitigation?: string
  level?: 'critical' | 'high' | 'medium' | 'low'
}

interface RiskListProps {
  risks: Risk[]
}

const getRiskConfig = (risk: Risk) => {
  const level = risk.level || (risk.probability && risk.probability > 0.7 ? 'critical' : risk.probability && risk.probability > 0.5 ? 'high' : risk.probability && risk.probability > 0.3 ? 'medium' : 'low')
  
  const configs = {
    critical: {
      icon: AlertTriangle,
      color: 'risk-critical',
      bg: 'bg-risk-critical/10',
      border: 'border-risk-critical',
      label: 'КРИТИЧЕСКИЙ',
      emoji: '🔴',
    },
    high: {
      icon: AlertCircle,
      color: 'risk-high',
      bg: 'bg-risk-high/10',
      border: 'border-risk-high',
      label: 'ВЫСОКИЙ',
      emoji: '🟠',
    },
    medium: {
      icon: Info,
      color: 'risk-medium',
      bg: 'bg-risk-medium/10',
      border: 'border-risk-medium',
      label: 'СРЕДНИЙ',
      emoji: '🟡',
    },
    low: {
      icon: Info,
      color: 'risk-low',
      bg: 'bg-risk-low/10',
      border: 'border-risk-low',
      label: 'НИЗКИЙ',
      emoji: '🟢',
    },
  }
  
  return configs[level] || configs.medium
}

export default function RiskList({ risks }: RiskListProps) {
  const topRisks = (risks || []).slice(0, 5)
  
  if (topRisks.length === 0) {
    return (
      <div className="glass rounded-lg p-6 hover:shadow-card-hover transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-h3 font-semibold text-foreground">Топ-5 рисков</h2>
            <p className="text-body-sm text-muted-foreground">Анализ потенциальных угроз</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-body text-muted-foreground">Риски не выявлены</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="glass rounded-lg p-6 hover:shadow-card-hover transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <h2 className="text-h3 font-semibold text-foreground">Топ-5 рисков</h2>
          <p className="text-body-sm text-muted-foreground">Анализ потенциальных угроз</p>
        </div>
      </div>
      <div className="space-y-3">
        {topRisks.map((risk, index) => {
          const config = getRiskConfig(risk)
          const level = risk.level || (risk.probability && risk.probability > 0.7 ? 'critical' : risk.probability && risk.probability > 0.5 ? 'high' : risk.probability && risk.probability > 0.3 ? 'medium' : 'low')
          
          const colorClass = level === 'critical' ? 'text-risk-critical' : 
                            level === 'high' ? 'text-risk-high' : 
                            level === 'medium' ? 'text-risk-medium' : 'text-risk-low'
          const bgClass = level === 'critical' ? 'bg-risk-critical/10' : 
                         level === 'high' ? 'bg-risk-high/10' : 
                         level === 'medium' ? 'bg-risk-medium/10' : 'bg-risk-low/10'
          const borderClass = level === 'critical' ? 'border-risk-critical' : 
                             level === 'high' ? 'border-risk-high' : 
                             level === 'medium' ? 'border-risk-medium' : 'border-risk-low'
          
          return (
            <div
              key={index}
              className={`${bgClass} border-l-[3px] ${borderClass} rounded-base p-4 hover:opacity-90 transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className={`${colorClass} flex-shrink-0 mt-0.5`}>
                  <span className="text-lg">{config.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-body-sm font-semibold ${colorClass}`}>
                      {index + 1}. {config.label}:
                    </span>
                    <span className="text-body font-medium text-foreground">
                      {risk.description || `Risk ${index + 1}`}
                    </span>
                  </div>
                  {risk.probability !== undefined && (
                    <p className="text-body-sm text-muted-foreground mb-1">
                      Вероятность: {(risk.probability * 100).toFixed(0)}%
                    </p>
                  )}
                  {risk.impact && (
                    <p className="text-body-sm text-muted-foreground mb-1">
                      Влияние: {risk.impact}
                    </p>
                  )}
                  {risk.mitigation && (
                    <p className="text-body-sm text-foreground mt-2">
                      <span className="font-medium">Смягчение:</span> {risk.mitigation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
