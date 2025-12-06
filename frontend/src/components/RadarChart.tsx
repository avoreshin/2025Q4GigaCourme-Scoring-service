import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { Package, Globe, Briefcase, DollarSign, Users, Rocket, BarChart3, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

interface RadarChartProps {
  breakdown: Record<string, number>
}

const categoryConfig = [
  { key: 'product_technology', label: 'Продукт/Технология', icon: Package },
  { key: 'market_opportunity', label: 'Рыночная возможность', icon: Globe },
  { key: 'business_model', label: 'Бизнес-модель', icon: Briefcase },
  { key: 'financials', label: 'Финансы', icon: DollarSign },
  { key: 'team', label: 'Команда', icon: Users },
  { key: 'traction', label: 'Тракшн', icon: Rocket },
  { key: 'competition', label: 'Конкуренция', icon: BarChart3 },
  { key: 'risk_assessment', label: 'Оценка рисков', icon: Shield },
]

export default function RadarChartComponent({ breakdown }: RadarChartProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!breakdown || Object.keys(breakdown).length === 0) {
    return (
      <div className="glass rounded-lg p-4 md:p-6">
        <h2 className="text-lg md:text-h3 font-semibold mb-4 md:mb-6 text-foreground">Радарная диаграмма оценок</h2>
        <div className="text-center py-6 md:py-8">
          <p className="text-body-sm md:text-body text-muted-foreground">Данные недоступны</p>
        </div>
      </div>
    )
  }

  const data = categoryConfig.map((category) => ({
    category: category.label,
    score: Math.max(0, Math.min(breakdown[category.key] || 0, 100)),
    fullMark: 100,
  }))

  return (
    <div className="glass rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg md:text-h3 font-semibold text-foreground">Радарная диаграмма оценок</h2>
          <p className="text-xs md:text-body-sm text-muted-foreground">Визуализация оценок по 8 критериям</p>
        </div>
      </div>
      
      <div className="w-full h-[250px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid 
              stroke="rgba(119, 124, 124, 0.3)"
              strokeWidth={1}
            />
            <PolarAngleAxis
              dataKey="category"
              tick={{ 
                fill: 'rgb(167, 169, 169)', 
                fontSize: isMobile ? 10 : 12,
                fontWeight: 500
              }}
              tickLine={{ stroke: 'rgba(119, 124, 124, 0.3)' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ 
                fill: 'rgb(167, 169, 169)', 
                fontSize: isMobile ? 8 : 10
              }}
              tickCount={isMobile ? 4 : 6}
            />
            <Radar
              name="Оценка"
              dataKey="score"
              stroke="rgb(32, 139, 155)"
              fill="rgb(32, 139, 155)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-4 md:mt-6">
        {categoryConfig.map((category) => {
          const score = breakdown[category.key] || 0
          const Icon = category.icon
          return (
            <div
              key={category.key}
              className="flex items-center gap-1 md:gap-2 p-1.5 md:p-2 rounded-base bg-card/50"
            >
              <Icon className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-body-xs text-muted-foreground truncate">{category.label}</p>
                <p className="text-xs md:text-body-sm font-semibold text-primary">{score.toFixed(0)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


