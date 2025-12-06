import { Package, Globe, Briefcase, DollarSign, Users, Rocket, BarChart3, Shield } from 'lucide-react'

interface ScoreBreakdownProps {
  breakdown: Record<string, number>
}

const categoryConfig = [
  { key: 'product_technology', label: 'Продукт/Технология', icon: Package, color: 'text-primary' },
  { key: 'market_opportunity', label: 'Рыночная возможность', icon: Globe, color: 'text-primary' },
  { key: 'business_model', label: 'Бизнес-модель', icon: Briefcase, color: 'text-primary' },
  { key: 'financials', label: 'Финансы', icon: DollarSign, color: 'text-primary' },
  { key: 'team', label: 'Команда', icon: Users, color: 'text-primary' },
  { key: 'traction', label: 'Тракшн', icon: Rocket, color: 'text-primary' },
  { key: 'competition', label: 'Конкуренция', icon: BarChart3, color: 'text-primary' },
  { key: 'risk_assessment', label: 'Оценка рисков', icon: Shield, color: 'text-primary' },
]

export default function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  if (!breakdown || Object.keys(breakdown).length === 0) {
    return (
      <div className="glass rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          <h2 className="text-lg md:text-h3 font-semibold text-foreground">Анализ категорий</h2>
        </div>
        <div className="text-center py-6 md:py-8">
          <p className="text-body-sm md:text-body text-muted-foreground">Данные разбивки недоступны</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-lg p-4 md:p-6 hover:shadow-card-hover transition-all">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg md:text-h3 font-semibold text-foreground">Анализ категорий</h2>
          <p className="text-xs md:text-body-sm text-muted-foreground">Детальная разбивка по критериям</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {categoryConfig.map((category) => {
          const score = breakdown[category.key] ?? 0
          const percentage = Math.max(0, Math.min(score, 100))
          const Icon = category.icon
          
          return (
            <div 
              key={category.key} 
              className="p-3 md:p-4 rounded-lg bg-card/50 border border-border/20 hover:border-primary/40 transition-all"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${category.color}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-body-sm font-medium text-foreground">
                      {category.label}
                    </span>
                    <span className="text-sm md:text-body font-mono font-semibold text-primary">
                      {score.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-2 bg-border/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
