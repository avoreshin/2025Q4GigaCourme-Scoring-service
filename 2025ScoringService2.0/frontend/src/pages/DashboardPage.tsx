import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { scoringsApi } from '../services/api'
import { format } from 'date-fns'
import { TrendingUp, Calendar, Building2 } from 'lucide-react'

export default function DashboardPage() {
  const { data: scorings, isLoading } = useQuery({
    queryKey: ['scorings'],
    queryFn: () => scoringsApi.getAll().then(res => res.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const totalStartups = scorings?.length || 0
  const avgScore = scorings?.length
    ? (scorings.reduce((sum: number, s: any) => sum + s.total_score, 0) / scorings.length).toFixed(1)
    : 0
  const thisMonth = scorings?.filter((s: any) => {
    const date = new Date(s.created_at)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length || 0

  const topIndustry = scorings?.reduce((acc: any, s: any) => {
    const industry = s.startup?.industry || 'Other'
    acc[industry] = (acc[industry] || 0) + 1
    return acc
  }, {}) || {}
  const topIndustryName = Object.entries(topIndustry).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A'

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-h1 font-semibold text-foreground">Dashboard</h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="glass rounded-lg p-4 md:p-6">
          <div className="text-2xl md:text-3xl font-semibold text-foreground mb-1">{totalStartups}</div>
          <div className="text-xs md:text-body-sm text-muted-foreground mb-2 md:mb-3">Total Startups</div>
          <div className="flex items-center gap-1 text-xs md:text-body-sm text-success">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span>↑ 5 (14%) This Month</span>
          </div>
        </div>

        <div className="glass rounded-lg p-4 md:p-6">
          <div className="text-2xl md:text-3xl font-semibold text-foreground mb-1">{avgScore}</div>
          <div className="text-xs md:text-body-sm text-muted-foreground mb-2 md:mb-3">Avg Score</div>
          <div className="flex items-center gap-1 text-xs md:text-body-sm text-success">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span>↑ 2.3 This Month</span>
          </div>
        </div>

        <div className="glass rounded-lg p-4 md:p-6">
          <div className="text-2xl md:text-3xl font-semibold text-foreground mb-1">{thisMonth}</div>
          <div className="text-xs md:text-body-sm text-muted-foreground mb-2 md:mb-3">This Month</div>
          <div className="flex items-center gap-1 text-xs md:text-body-sm text-muted-foreground">
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            <span>New scorings</span>
          </div>
        </div>

        <div className="glass rounded-lg p-4 md:p-6">
          <div className="text-2xl md:text-3xl font-semibold text-foreground mb-1">{topIndustryName}</div>
          <div className="text-xs md:text-body-sm text-muted-foreground mb-2 md:mb-3">Top Industry</div>
          <div className="flex items-center gap-1 text-xs md:text-body-sm text-muted-foreground">
            <Building2 className="w-3 h-3 md:w-4 md:h-4" />
            <span>Most common</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="glass rounded-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border/20">
          <h2 className="text-lg md:text-h3 font-semibold text-foreground">Recent Scorings</h2>
        </div>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-card/50 border-b border-border/20">
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Score
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Stage
                </th>
              </tr>
            </thead>
            <tbody>
              {scorings?.map((scoring: any) => (
                <tr
                  key={scoring.id}
                  className="border-b border-border/10 hover:bg-primary/5 transition-colors"
                >
                  <td className="px-3 md:px-4 py-3 md:py-4 text-sm md:text-body text-muted-foreground">
                    {format(new Date(scoring.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4">
                    <Link
                      to={`/scoring/${scoring.id}`}
                      className="text-sm md:text-body font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {scoring.startup?.name || `Scoring #${scoring.id}`}
                    </Link>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4">
                    <span className="text-sm md:text-body font-semibold text-primary font-mono">
                      {scoring.total_score.toFixed(0)}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-sm md:text-body text-muted-foreground">
                    {scoring.startup?.stage || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
