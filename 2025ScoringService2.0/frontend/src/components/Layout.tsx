import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import { Upload, Building2, Trophy, LayoutDashboard, Bot } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Загрузка', icon: Upload },
    { path: '/startups', label: 'Стартапы', icon: Building2 },
    { path: '/leaderboard', label: 'Рейтинг', icon: Trophy },
    { path: '/dashboard', label: 'Панель', icon: LayoutDashboard },
    { path: '/agents', label: 'Настройки агентов', icon: Bot },
  ]

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background border-b border-border/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
                Startup Scorer
              </Link>
              <div className="flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-base text-sm font-medium transition-all ${
                        isActive
                          ? 'text-primary border-b-2 border-primary bg-primary/5'
                          : 'text-muted-foreground hover:text-foreground hover:bg-card'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">U</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  )
}

