import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { startupsApi } from '../services/api'
import { FileText, ExternalLink } from 'lucide-react'

export default function StartupsPage() {
  const { data: startups, isLoading } = useQuery({
    queryKey: ['startups'],
    queryFn: () => startupsApi.getAll().then(res => res.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-h1 font-semibold text-foreground">Стартапы</h1>
      <div className="grid gap-3 md:gap-4">
        {startups?.map((startup: any) => (
          <div
            key={startup.id}
            className="glass rounded-lg p-4 md:p-6 hover:shadow-card-hover transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 mb-3 md:mb-4">
              <Link
                to={`/startup/${startup.id}`}
                className="flex-1 hover:opacity-80 transition-opacity"
              >
                <h2 className="text-lg md:text-h3 font-semibold text-foreground mb-2">{startup.name}</h2>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs md:text-body-sm text-muted-foreground">
                  {startup.industry && <span>Индустрия: {startup.industry}</span>}
                  {startup.stage && <span>Стадия: {startup.stage}</span>}
                  {startup.geography && <span>География: {startup.geography}</span>}
                </div>
              </Link>
              {startup.latest_scoring_id && (
                <Link
                  to={`/scoring/${startup.latest_scoring_id}`}
                  className="flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-base text-primary font-medium transition-all text-sm md:text-body-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                  <span>
                    <span className="hidden md:inline">Последний скоринг</span>
                    <span className="md:hidden">Скоринг</span>
                    {startup.latest_score !== null && (
                      <span className="ml-2 font-semibold">{startup.latest_score.toFixed(0)}</span>
                    )}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

