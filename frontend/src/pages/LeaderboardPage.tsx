import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { leaderboardApi } from '../services/api'
import { ChevronDown, Star, Diamond, Circle } from 'lucide-react'

export default function LeaderboardPage() {
  const [industry, setIndustry] = useState('')
  const [stage, setStage] = useState('')
  const [geography, setGeography] = useState('')
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)
  const [showStageDropdown, setShowStageDropdown] = useState(false)
  const [showGeographyDropdown, setShowGeographyDropdown] = useState(false)

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', industry, stage, geography],
    queryFn: () => leaderboardApi.get({ industry, stage, geography }).then(res => res.data),
  })

  const industries = ['All', 'Tech', 'FinTech', 'HealthTech', 'SaaS', 'E-commerce', 'Other']
  const stages = ['All', 'Idea', 'Pre-Seed', 'Seed', 'Series A', 'Series B+']
  const geographies = ['All', 'US', 'EU', 'Asia', 'Other']

  const getStatusIcon = (score: number) => {
    if (score >= 75) return <Star className="w-3 h-3 text-risk-medium" />
    if (score >= 50) return <Diamond className="w-3 h-3 text-risk-low" />
    return <Circle className="w-3 h-3 text-muted-foreground" />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-h1 font-semibold text-foreground">Leaderboard</h1>
      
      {/* Filter Section */}
      <div className="glass rounded-lg p-4 md:p-6 md:sticky md:top-16 z-40">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {/* Industry Filter */}
          <div className="relative">
            <label className="block text-xs md:text-body-sm font-medium mb-2 text-foreground">Industry</label>
            <div className="relative">
              <button
                onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                className="w-full px-3 md:px-4 py-2 bg-card border border-border rounded-base text-foreground text-sm md:text-body flex items-center justify-between hover:border-primary/60 transition-all"
              >
                <span>{industry || 'All'}</span>
                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showIndustryDropdown && (
                <div className="absolute z-10 w-full mt-1 glass rounded-base border border-border shadow-card overflow-hidden">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => {
                        setIndustry(ind === 'All' ? '' : ind)
                        setShowIndustryDropdown(false)
                      }}
                      className={`w-full px-3 md:px-4 py-2 text-left text-sm md:text-body hover:bg-primary/10 transition-colors ${
                        (industry || 'All') === ind ? 'bg-primary/15 text-primary' : 'text-foreground'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stage Filter */}
          <div className="relative">
            <label className="block text-xs md:text-body-sm font-medium mb-2 text-foreground">Stage</label>
            <div className="relative">
              <button
                onClick={() => setShowStageDropdown(!showStageDropdown)}
                className="w-full px-3 md:px-4 py-2 bg-card border border-border rounded-base text-foreground text-sm md:text-body flex items-center justify-between hover:border-primary/60 transition-all"
              >
                <span>{stage || 'All'}</span>
                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${showStageDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showStageDropdown && (
                <div className="absolute z-10 w-full mt-1 glass rounded-base border border-border shadow-card overflow-hidden">
                  {stages.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setStage(st === 'All' ? '' : st)
                        setShowStageDropdown(false)
                      }}
                      className={`w-full px-3 md:px-4 py-2 text-left text-sm md:text-body hover:bg-primary/10 transition-colors ${
                        (stage || 'All') === st ? 'bg-primary/15 text-primary' : 'text-foreground'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Geography Filter */}
          <div className="relative">
            <label className="block text-xs md:text-body-sm font-medium mb-2 text-foreground">Location</label>
            <div className="relative">
              <button
                onClick={() => setShowGeographyDropdown(!showGeographyDropdown)}
                className="w-full px-3 md:px-4 py-2 bg-card border border-border rounded-base text-foreground text-sm md:text-body flex items-center justify-between hover:border-primary/60 transition-all"
              >
                <span>{geography || 'All'}</span>
                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${showGeographyDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showGeographyDropdown && (
                <div className="absolute z-10 w-full mt-1 glass rounded-base border border-border shadow-card overflow-hidden">
                  {geographies.map((geo) => (
                    <button
                      key={geo}
                      onClick={() => {
                        setGeography(geo === 'All' ? '' : geo)
                        setShowGeographyDropdown(false)
                      }}
                      className={`w-full px-3 md:px-4 py-2 text-left text-sm md:text-body hover:bg-primary/10 transition-colors ${
                        (geography || 'All') === geo ? 'bg-primary/15 text-primary' : 'text-foreground'
                      }`}
                    >
                      {geo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {(industry || stage || geography) && (
          <button
            onClick={() => {
              setIndustry('')
              setStage('')
              setGeography('')
            }}
            className="mt-3 md:mt-4 text-xs md:text-body-sm text-primary hover:text-primary-hover transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="glass rounded-lg overflow-hidden">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-card/50 border-b border-border/20">
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  #
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Company
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Score
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Industry
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard?.map((item: any) => (
                <tr
                  key={item.scoring_id}
                  className="border-b border-border/10 hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <td className="px-3 md:px-4 py-3 md:py-4">
                    <Link
                      to={`/scoring/${item.scoring_id}`}
                      className="text-sm md:text-body font-semibold text-primary"
                    >
                      {item.rank}
                    </Link>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4">
                    <Link
                      to={`/scoring/${item.scoring_id}`}
                      className="text-sm md:text-body font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.startup.name}
                    </Link>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm md:text-body font-semibold text-primary font-mono">
                        {item.score.toFixed(0)}
                      </span>
                      {getStatusIcon(item.score)}
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-sm md:text-body text-muted-foreground">
                    {item.startup.stage || '-'}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-sm md:text-body text-muted-foreground">
                    {item.startup.industry || '-'}
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
