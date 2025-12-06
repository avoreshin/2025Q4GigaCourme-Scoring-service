import { useQuery, useMutation } from '@tanstack/react-query'
import { agentsApi } from '../services/api'
import AgentConfigEditor from '../components/AgentConfigEditor'

export default function AgentsPage() {
  const { data: configs, isLoading, refetch } = useQuery({
    queryKey: ['agent-configs'],
    queryFn: () => agentsApi.getAllConfigs().then(res => res.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ agentName, data }: { agentName: string; data: any }) =>
      agentsApi.updateConfig(agentName, data),
    onSuccess: () => {
      refetch()
    },
  })

  const resetMutation = useMutation({
    mutationFn: (agentName: string) => agentsApi.resetConfig(agentName),
    onSuccess: () => {
      refetch()
    },
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
      <h1 className="text-xl md:text-h1 font-semibold text-foreground">Настройка агентов</h1>
      <div className="space-y-4 md:space-y-6">
        {configs?.map((config: any) => (
          <AgentConfigEditor
            key={config.id}
            config={config}
            onUpdate={(data) => updateMutation.mutate({ agentName: config.agent_name, data })}
            onReset={() => resetMutation.mutate(config.agent_name)}
          />
        ))}
      </div>
    </div>
  )
}

