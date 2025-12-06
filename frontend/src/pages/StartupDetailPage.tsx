import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { startupsApi, scoringsApi } from '../services/api'

export default function StartupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const startupId = parseInt(id || '0')

  const { data: startup, isLoading } = useQuery({
    queryKey: ['startup', startupId],
    queryFn: () => startupsApi.getById(startupId).then(res => res.data),
  })

  const scoreMutation = useMutation({
    mutationFn: () => scoringsApi.create(startupId),
    onSuccess: (data) => {
      navigate(`/scoring/${data.data.id}`)
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    )
  }
  
  if (!startup) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Стартап не найден</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-h1 font-semibold text-foreground">{startup.name}</h1>
      <div className="glass rounded-lg p-4 md:p-6 mb-4 md:mb-6">
        <div className="space-y-2">
          <p className="text-sm md:text-body text-foreground">
            <span className="font-semibold">Индустрия:</span> {startup.industry || 'Не указано'}
          </p>
          <p className="text-sm md:text-body text-foreground">
            <span className="font-semibold">Стадия:</span> {startup.stage || 'Не указано'}
          </p>
          <p className="text-sm md:text-body text-foreground">
            <span className="font-semibold">География:</span> {startup.geography || 'Не указано'}
          </p>
        </div>
      </div>
      <button
        onClick={() => scoreMutation.mutate()}
        disabled={scoreMutation.isPending}
        className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-gradient-to-r from-primary to-[#1A6873] text-primary-foreground font-semibold rounded-base hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {scoreMutation.isPending ? 'Оценка выполняется...' : 'Запустить оценку'}
      </button>
    </div>
  )
}

