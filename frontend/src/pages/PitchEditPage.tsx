import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { pitchDocumentsApi } from '../services/api'
import MissingInfoList from '../components/MissingInfoList'

export default function PitchEditPage() {
  const { id } = useParams<{ id: string }>()
  const documentId = parseInt(id || '0')
  const [text, setText] = useState('')

  const { data: document, isLoading } = useQuery({
    queryKey: ['pitch-document', documentId],
    queryFn: () => pitchDocumentsApi.getById(documentId).then(res => res.data),
  })

  useEffect(() => {
    if (document) {
      setText(document.edited_text || document.extracted_text || '')
    }
  }, [document])

  const { data: missingInfo } = useQuery({
    queryKey: ['missing-info', documentId],
    queryFn: () => pitchDocumentsApi.analyzeMissing(documentId).then(res => res.data),
    enabled: !!document,
  })

  const updateMutation = useMutation({
    mutationFn: (editedText: string) =>
      pitchDocumentsApi.updateText(documentId, { edited_text: editedText, is_edited: true }),
    onSuccess: () => {
      alert('Текст успешно сохранен!')
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    )
  }
  
  if (!document) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Документ не найден</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-h1 font-semibold text-foreground">Редактирование текста питча</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="glass rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-h3 font-semibold mb-3 md:mb-4 text-foreground">Редактировать текст</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 bg-card border border-border rounded-base text-foreground font-mono text-xs md:text-body-sm min-h-[300px] md:min-h-[500px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
          />
          <button
            onClick={() => updateMutation.mutate(text)}
            disabled={updateMutation.isPending}
            className="mt-3 md:mt-4 w-full md:w-auto px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-gradient-to-r from-primary to-[#1A6873] text-primary-foreground font-semibold rounded-base hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>

        <div className="glass rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-h3 font-semibold mb-3 md:mb-4 text-foreground">Недостающая информация</h2>
          <MissingInfoList missingInfo={missingInfo?.missing_info || []} />
        </div>
      </div>
    </div>
  )
}

