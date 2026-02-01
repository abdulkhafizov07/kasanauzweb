import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import api from '@/lib/api'
import regions from '@/data/regions.json'
import { useAuth } from '@/context/auth'
import { useEffect } from 'react'
import { hasOne } from '@/lib/has-perm'
import LoadingComponent from '@/components/web/loader'
import UsersAdminStatistics from '@/components/UsersAdminStatistics'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
)

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/overview',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()
      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}
        if (
          !(
            hasOne(permissions, 'admin:read_statistics') ||
            auth.user?.role === 'admin'
          )
        ) {
          navigate({ to: '/auth/login' })
        }
      }
    }, [auth.isLoading, auth.isUserLoading, auth.user, navigate])

    if (auth.isLoading || auth.isUserLoading) {
      return <LoadingComponent />
    }

    return <RouteComponent />
  },
})

export function RouteComponent() {
  return (
    <>
      <section id="statistics">
        <div className="titlebar mb-4">
          <h2 className="text-2xl font-semibold">Statistika</h2>
        </div>

        <div className="content">
          <UsersAdminStatistics />
        </div>
      </section>
    </>
  )
}
