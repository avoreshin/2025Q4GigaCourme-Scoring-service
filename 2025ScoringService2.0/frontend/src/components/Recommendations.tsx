import { Lightbulb } from 'lucide-react'

interface RecommendationsProps {
  recommendations: string[]
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  const recs = recommendations || []
  
  if (recs.length === 0) {
    return (
      <div className="glass rounded-lg p-6 hover:shadow-card-hover transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-h3 font-semibold text-foreground">Рекомендации</h2>
            <p className="text-body-sm text-muted-foreground">Предложения по улучшению</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-body text-muted-foreground">Рекомендации недоступны</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="glass rounded-lg p-6 hover:shadow-card-hover transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-h3 font-semibold text-foreground">Рекомендации</h2>
          <p className="text-body-sm text-muted-foreground">Предложения по улучшению</p>
        </div>
      </div>
      <div className="space-y-4">
        {recs.map((rec, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-body font-semibold text-primary">{index + 1}</span>
              </div>
            </div>
            <div className="flex-1 border-l-2 border-primary/30 pl-4">
              <p className="text-body text-foreground leading-relaxed">{rec}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
