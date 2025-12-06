import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { scoringsApi, exportApi, startupsApi } from '../services/api'
import ScoreBreakdown from '../components/ScoreBreakdown'
import RiskList from '../components/RiskList'
import Recommendations from '../components/Recommendations'
import RadarChartComponent from '../components/RadarChart'
import TeamInfo from '../components/TeamInfo'
import { 
  ArrowLeft, Download, FileSpreadsheet, Target, 
  AlertTriangle, BarChart3
} from 'lucide-react'
import { format } from 'date-fns'

export default function ScoringDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const scoringId = parseInt(id || '0')

  const { data: scoring, isLoading } = useQuery({
    queryKey: ['scoring', scoringId],
    queryFn: () => scoringsApi.getById(scoringId).then(res => res.data),
  })

  const { data: startup } = useQuery({
    queryKey: ['startup', scoring?.startup_id],
    queryFn: () => startupsApi.getById(scoring!.startup_id).then(res => res.data),
    enabled: !!scoring?.startup_id,
  })

  const handleExportPDF = async () => {
    try {
      const blob = await exportApi.pdf(scoringId).then(res => res.data)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `scoring_${scoringId}.pdf`
      a.click()
    } catch (error) {
      console.error('Export PDF error:', error)
    }
  }

  const handleExportExcel = async () => {
    try {
      const blob = await exportApi.excel(scoringId).then(res => res.data)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `scoring_${scoringId}.xlsx`
      a.click()
    } catch (error) {
      console.error('Export Excel error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    )
  }
  
  if (!scoring) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Оценка не найдена</p>
      </div>
    )
  }

  const score = scoring.total_score || 0
  const percentage = Math.max(0, Math.min(score, 100))
  const circumference = 2 * Math.PI * 90
  const offset = circumference - (percentage / 100) * circumference
  
  const getStatusLabel = (score: number) => {
    if (score >= 80) return { label: '✅ Сильный', desc: 'Готов к инвестированию' }
    if (score >= 60) return { label: '⚠️ Умеренный', desc: 'Требует улучшения' }
    if (score >= 40) return { label: '⚠️ Слабый', desc: 'Требует значительного улучшения' }
    return { label: '❌ Очень слабый', desc: 'Недостаточно информации - добавьте больше деталей в питч' }
  }
  
  const status = getStatusLabel(score)
  const hasMinimalData = scoring.breakdown && Object.keys(scoring.breakdown).length > 0

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-base hover:bg-card transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl md:text-h1 font-semibold text-foreground">Отчет об оценке</h1>
          {startup && (
            <p className="text-body-sm md:text-body text-muted-foreground mt-1">{startup.name}</p>
          )}
        </div>
      </div>

      {/* Grid Layout for Report Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Hero Block - Main Score */}
        <div className="md:col-span-2 glass rounded-lg p-4 md:p-8 hover:shadow-card-hover transition-all">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 md:mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-body-sm md:text-body text-muted-foreground">TechVenture AI</span>
            </div>
            
            {/* Circular Gauge */}
            <div className="relative w-40 h-40 md:w-60 md:h-60 mb-4 md:mb-6">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 240 240">
                <circle
                  cx="120"
                  cy="120"
                  r="90"
                  stroke="rgb(38, 40, 40)"
                  strokeWidth="8"
                  fill="none"
                  opacity="0.4"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="90"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-1200 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(32, 139, 155)" />
                    <stop offset="100%" stopColor="rgb(45, 166, 178)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-foreground mb-1">{score.toFixed(0)}</div>
                  <div className="text-body-sm text-muted-foreground">Оценка</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-1 md:space-y-2">
              <div className="text-body md:text-body-lg font-semibold text-foreground px-2">
                Статус: {status.label} | {status.desc}
              </div>
              <div className="text-body-sm text-muted-foreground">
                Проанализировано: {scoring.created_at ? format(new Date(scoring.created_at), 'dd.MM.yyyy HH:mm') : 'Н/Д'}
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart Block */}
        {hasMinimalData && (
          <div className="md:col-span-2">
            <RadarChartComponent breakdown={scoring.breakdown || {}} />
          </div>
        )}

        {/* Team Info Block */}
        {(scoring.team_info || startup) && (
          <div className="md:col-span-1">
            <TeamInfo teamInfo={scoring.team_info} startupName={startup?.name} />
          </div>
        )}

        {/* Category Breakdown Block */}
        {hasMinimalData ? (
          <div className="md:col-span-1">
            <ScoreBreakdown breakdown={scoring.breakdown || {}} />
          </div>
        ) : (
          <div className="md:col-span-1 glass rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <h2 className="text-lg md:text-h3 font-semibold text-foreground">Анализ категорий</h2>
            </div>
            <div className="text-center py-6 md:py-8">
              <p className="text-body-sm md:text-body text-muted-foreground">Данные разбивки недоступны</p>
            </div>
          </div>
        )}

        {/* Warning for low scores */}
        {score < 40 && (
          <div className="md:col-span-2 glass rounded-lg p-4 md:p-6 border border-destructive/40 bg-destructive/10">
            <div className="flex items-start gap-2 md:gap-3">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-body md:text-body-lg font-semibold text-foreground mb-2">
                  Предупреждение о низкой оценке
                </h3>
                <p className="text-body-sm md:text-body text-muted-foreground">
                  Оценка очень низкая ({score.toFixed(1)}) из-за недостаточной информации в питч-документе. 
                  Пожалуйста, добавьте больше деталей о вашем продукте, команде, финансах, бизнес-модели и рыночных возможностях для более точной оценки.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Risks Block */}
        <div className="md:col-span-1">
          <RiskList risks={scoring.risks || []} />
        </div>

        {/* Recommendations Block */}
        <div className="md:col-span-1">
          <Recommendations recommendations={scoring.recommendations || []} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="md:sticky md:bottom-0 bg-background/80 backdrop-blur-sm border-t border-border/20 p-3 md:p-4 -mx-4 md:-mx-4 -mb-8 md:-mb-8 mt-6 md:mt-8 flex flex-col md:flex-row gap-2 md:gap-3">
        <button
          onClick={handleExportPDF}
          className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-transparent border border-primary/40 text-primary font-medium rounded-base hover:bg-primary/10 hover:border-primary/60 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <Download className="w-4 h-4" />
          Экспорт PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-transparent border border-primary/40 text-primary font-medium rounded-base hover:bg-primary/10 hover:border-primary/60 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Экспорт Excel
        </button>
      </div>
    </div>
  )
}
