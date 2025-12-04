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
      <div className="text-center py-8">
        <p className="text-body text-muted-foreground">Недостающая информация не обнаружена.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {missingInfo.map((info, index) => (
        <div key={index} className="p-4 border border-risk-medium/40 rounded-base bg-risk-medium/10">
          <h3 className="text-body font-semibold mb-2 text-foreground">{info.description}</h3>
          <p className="text-body-sm text-muted-foreground">{info.recommendation}</p>
        </div>
      ))}
    </div>
  )
}

