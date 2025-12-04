import { Users, Award, UserCheck, TrendingUp } from 'lucide-react'

interface TeamInfoProps {
  teamInfo?: {
    team_size?: string
    experience_level?: number
    key_members?: string[]
    team_strengths?: string[]
    details?: string
  }
  startupName?: string
}

export default function TeamInfo({ teamInfo, startupName }: TeamInfoProps) {
  // Показываем блок, если есть хотя бы какая-то информация
  if (!teamInfo && !startupName) {
    return null
  }

  return (
    <div className="glass rounded-lg p-6 hover:shadow-card-hover transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-h3 font-semibold text-foreground">
            {startupName ? `Команда ${startupName}` : 'Информация о команде'}
          </h2>
          <p className="text-body-sm text-muted-foreground">Анализ команды и компетенций</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {teamInfo?.team_size && (
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-primary" />
            <div>
              <p className="text-body-sm text-muted-foreground">Размер команды</p>
              <p className="text-body font-semibold text-foreground">{teamInfo.team_size}</p>
            </div>
          </div>
        )}
        
        {teamInfo?.experience_level !== undefined && (
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-primary" />
            <div>
              <p className="text-body-sm text-muted-foreground">Уровень опыта</p>
              <p className="text-body font-semibold text-foreground">
                {teamInfo.experience_level.toFixed(0)}/100
              </p>
            </div>
          </div>
        )}
      </div>

      {teamInfo?.team_strengths && teamInfo.team_strengths.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-success" />
            <h3 className="text-body-lg font-semibold text-foreground">Сильные стороны</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {teamInfo.team_strengths.map((strength, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-success/10 text-success text-body-sm font-medium border border-success/20"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>
      )}

      {teamInfo?.key_members && teamInfo.key_members.length > 0 && (
        <div className="mb-6">
          <h3 className="text-body-lg font-semibold text-foreground mb-3">Ключевые члены команды</h3>
          <ul className="space-y-2">
            {teamInfo.key_members.map((member, index) => (
              <li key={index} className="text-body text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                {member}
              </li>
            ))}
          </ul>
        </div>
      )}

      {teamInfo?.details && (
        <div className="pt-4 border-t border-border/20">
          <p className="text-body text-foreground leading-relaxed">{teamInfo.details}</p>
        </div>
      )}
      
      {!teamInfo && startupName && (
        <div className="text-center py-8">
          <p className="text-body text-muted-foreground">Информация о команде не предоставлена</p>
        </div>
      )}
    </div>
  )
}

