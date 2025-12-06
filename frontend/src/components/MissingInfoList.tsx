interface MissingInfo {
  section: string
  description: string
  recommendation: string
}

interface MissingInfoListProps {
  missingInfo: MissingInfo[]
}

export default function MissingInfoList({ missingInfo }: MissingInfoListProps) {
  if (!missingInfo || missingInfo.length === 0) {
    return (
      <div className="text-center py-6 md:py-8">
        <p className="text-body-sm md:text-body text-muted-foreground">Недостающая информация не обнаружена.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 md:space-y-3">
      {missingInfo.map((info, index) => (
        <div key={index} className="p-3 md:p-4 border border-risk-medium/40 rounded-base bg-risk-medium/10">
          <h3 className="text-sm md:text-body font-semibold mb-1 md:mb-2 text-foreground">{info.description}</h3>
          <p className="text-xs md:text-body-sm text-muted-foreground">{info.recommendation}</p>
        </div>
      ))}
    </div>
  )
}

