'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, CheckCircle, XCircle } from 'lucide-react'

// TODO: Replace with actual API types from backend
interface ApplicantStats {
  totalApplicants: number
  totalAccepted: number
  totalRejected: number
}

export function ApplicantStatsDashboard() {
  const [stats, setStats] = useState<ApplicantStats>({
    totalApplicants: 0,
    totalAccepted: 0,
    totalRejected: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // TODO: Replace with actual API call
    // Example: GET /api/applicants/stats
    // Expected response format:
    // {
    //   "totalApplicants": 150,
    //   "totalAccepted": 45,
    //   "totalRejected": 30
    // }

    const fetchStats = async () => {
      try {
        // Simulated API call for frontend development
        // Replace with: const response = await fetch('/api/applicants/stats')
        // const data = await response.json()

        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay

        // Mock data for development
        const mockData: ApplicantStats = {
          totalApplicants: 1247,
          totalAccepted: 432,
          totalRejected: 185,
        }

        setStats(mockData)
        setLastUpdated(new Date().toLocaleTimeString())
      } catch (error) {
        console.error('Error fetching applicant stats:', error)
        // TODO: Implement proper error handling and user feedback
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()

    // TODO: Implement real-time updates with polling or WebSocket
    // Option 1: Polling every 30 seconds
    // const interval = setInterval(fetchStats, 30000)
    // return () => clearInterval(interval)

    // Option 2: WebSocket connection for real-time updates
    // const ws = new WebSocket('ws://your-backend/stats')
    // ws.onmessage = (event) => setStats(JSON.parse(event.data))
    // return () => ws.close()
  }, [mounted])

  const statCards = [
    {
      title: 'Total Applicants',
      value: stats.totalApplicants,
      icon: Users,
      ariaLabel: `Total applicants: ${stats.totalApplicants}`,
      iconBg: 'bg-[#477BFF]/10',
      iconColor: 'text-[#477BFF]',
      valueColor: 'text-[#000523]',
    },
    {
      title: 'Total Accepted',
      value: stats.totalAccepted,
      icon: CheckCircle,
      ariaLabel: `Total accepted applicants: ${stats.totalAccepted}`,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      valueColor: 'text-[#000523]',
    },
    {
      title: 'Total Rejected',
      value: stats.totalRejected,
      icon: XCircle,
      ariaLabel: `Total rejected applicants: ${stats.totalRejected}`,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-600',
      valueColor: 'text-[#000523]',
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-7xl">
        <header className="mb-10 md:mb-14">
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 tracking-tight">
            Applicant Statistics 
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl font-normal">
            Overview of key applicant metrics and trends
          </p>
        </header>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8"
          role="region"
          aria-label="Applicant statistics dashboard"
        >
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card 
                key={stat.title}
                className="border border-border hover:shadow-lg transition-all duration-300 hover:border-primary/30 bg-card"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div 
                        className={`rounded-xl p-3 ${stat.iconBg}`}
                        aria-hidden="true"
                      >
                        <Icon 
                          className={`w-6 h-6 ${stat.iconColor}`}
                          strokeWidth={2}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p 
                        className={`font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight ${stat.valueColor} leading-none`}
                        aria-label={stat.ariaLabel}
                      >
                        {isLoading ? (
                          <span className="inline-block animate-pulse bg-muted rounded-lg h-14 w-32" aria-label="Loading statistics" />
                        ) : (
                          stat.value.toLocaleString()
                        )}
                      </p>
                      <p className="text-sm md:text-base font-semibold text-muted-foreground">
                        {stat.title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <footer className="mt-10 md:mt-14 text-center">
          <p className="text-sm text-muted-foreground font-normal">
            Statistics update automatically. Last updated: {lastUpdated || 'Loading...'}
            <span className="sr-only">
              Current counts: {stats.totalApplicants} total applicants,
              {stats.totalAccepted} accepted, {stats.totalRejected} rejected.
            </span>
          </p>
        </footer>
      </div>
    </main>
  )
}
