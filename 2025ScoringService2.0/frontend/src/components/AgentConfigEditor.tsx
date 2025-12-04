import { useState, useEffect } from 'react'
import { Settings, Server, MessageSquare } from 'lucide-react'

interface AgentConfigEditorProps {
  config: any
  onUpdate: (data: any) => void
  onReset: () => void
}

export default function AgentConfigEditor({ config, onUpdate, onReset }: AgentConfigEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [model, setModel] = useState(config.model || '')
  const [systemPrompt, setSystemPrompt] = useState(config.system_prompt || '')
  const [analysisPrompt, setAnalysisPrompt] = useState('')
  const [temperature, setTemperature] = useState(config.temperature || 0.5)
  const [maxTokens, setMaxTokens] = useState(config.max_tokens || 2500)
  const [isActive, setIsActive] = useState(config.is_active !== undefined ? config.is_active : true)
  const [mcpPort, setMcpPort] = useState(8000)
  const [mcpTimeout, setMcpTimeout] = useState(30)
  const [mcpRetryCount, setMcpRetryCount] = useState(3)

  // Initialize prompts from config
  useEffect(() => {
    if (config.prompts && typeof config.prompts === 'object') {
      setAnalysisPrompt(config.prompts.analysis_prompt || '')
    }
  }, [config.prompts])

  // Initialize MCP config
  useEffect(() => {
    if (config.mcp_server_config && typeof config.mcp_server_config === 'object') {
      setMcpPort(config.mcp_server_config.port || 8000)
      setMcpTimeout(config.mcp_server_config.timeout || 30)
      setMcpRetryCount(config.mcp_server_config.retry_count || 3)
    }
  }, [config.mcp_server_config])

  const handleSave = () => {
    onUpdate({
      model: model,
      system_prompt: systemPrompt,
      prompts: {
        analysis_prompt: analysisPrompt
      },
      temperature: parseFloat(temperature.toString()),
      max_tokens: parseInt(maxTokens.toString()),
      is_active: isActive,
      mcp_server_config: {
        port: parseInt(mcpPort.toString()),
        timeout: parseInt(mcpTimeout.toString()),
        retry_count: parseInt(mcpRetryCount.toString())
      }
    })
  }

  return (
    <div className="glass rounded-lg p-6 border border-border/20 hover:shadow-card-hover transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-h3 font-semibold text-foreground mb-2">{config.agent_name}</h3>
          <p className="text-body-sm text-muted-foreground">Модель: {config.model}</p>
          <p className="text-body-sm text-muted-foreground">
            Статус: <span className={isActive ? 'text-success' : 'text-destructive'}>
              {isActive ? 'Активен' : 'Неактивен'}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-transparent border border-border text-foreground font-medium rounded-base hover:bg-card hover:border-primary/60 transition-all"
          >
            {isExpanded ? 'Свернуть' : 'Развернуть'}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-transparent border border-border text-foreground font-medium rounded-base hover:bg-card hover:border-primary/60 transition-all"
          >
            Сбросить
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-border/20">
          {/* Model */}
          <div>
            <label className="block text-body-sm font-medium mb-2 text-foreground flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Модель
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="GigaChat-Pro"
            />
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-body-sm font-medium mb-2 text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Системный промпт
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-base text-foreground placeholder:text-muted-foreground min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y font-mono text-sm"
              placeholder="Системный промпт для агента..."
            />
          </div>

          {/* Analysis Prompt */}
          <div>
            <label className="block text-body-sm font-medium mb-2 text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Промпт анализа (analysis_prompt)
            </label>
            <textarea
              value={analysisPrompt}
              onChange={(e) => setAnalysisPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-base text-foreground placeholder:text-muted-foreground min-h-[300px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y font-mono text-sm"
              placeholder="Промпт для анализа..."
            />
          </div>

          {/* Temperature and Max Tokens */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-medium mb-2 text-foreground">Temperature</label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                min="0"
                max="2"
                step="0.1"
                className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium mb-2 text-foreground">Max Tokens</label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                min="1"
                className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* MCP Server Config */}
          <div className="pt-4 border-t border-border/20">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-primary" />
              <h4 className="text-body-lg font-semibold text-foreground">Настройки MCP сервера</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-body-sm font-medium mb-2 text-foreground">Порт</label>
                <input
                  type="number"
                  value={mcpPort}
                  onChange={(e) => setMcpPort(parseInt(e.target.value))}
                  min="1"
                  max="65535"
                  className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium mb-2 text-foreground">Timeout (сек)</label>
                <input
                  type="number"
                  value={mcpTimeout}
                  onChange={(e) => setMcpTimeout(parseInt(e.target.value))}
                  min="1"
                  className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium mb-2 text-foreground">Количество повторов</label>
                <input
                  type="number"
                  value={mcpRetryCount}
                  onChange={(e) => setMcpRetryCount(parseInt(e.target.value))}
                  min="0"
                  max="10"
                  className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
              />
              <span className="text-body text-foreground">Активен</span>
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-[#1A6873] text-primary-foreground font-semibold rounded-base hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Сохранить изменения
          </button>
        </div>
      )}
    </div>
  )
}
