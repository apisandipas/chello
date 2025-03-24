import { createFileRoute } from '@tanstack/react-router'
import { TrendingUp, Users, Building2, DollarSign, TicketIcon } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: DashboardComponent,
})

function StatCard({ title, value, description, icon: Icon, trend }: {
  title: string
  value: string | number
  description: string
  icon: any
  trend?: { value: string; positive: boolean }
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-cyan-50 rounded-full">
          <Icon className="w-6 h-6 text-cyan-600" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          {trend && (
            <span className={`font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'} mr-1`}>
              {trend.value}
            </span>
          )}
          {description}
        </p>
      </div>
    </div>
  )
}

function DashboardComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to your admin dashboard. Here's what's happening across your platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Statistics */}
        <StatCard
          title="Monthly Active Users"
          value="2,847"
          description="users this month"
          icon={Users}
          trend={{ value: "+12.5%", positive: true }}
        />

        {/* Teams Statistics */}
        <StatCard
          title="Active Teams"
          value="156"
          description="avg. team size: 8 members"
          icon={Building2}
          trend={{ value: "+4.3%", positive: true }}
        />

        {/* Accounting Statistics */}
        <StatCard
          title="Monthly Revenue"
          value="$48,250"
          description="vs last month"
          icon={DollarSign}
          trend={{ value: "+8.7%", positive: true }}
        />

        {/* Support Statistics */}
        <StatCard
          title="Open Tickets"
          value="23"
          description="89% resolution rate"
          icon={TicketIcon}
          trend={{ value: "-5%", positive: true }}
        />
      </div>

      {/* Activity Overview */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-sm text-gray-600">
              Coming soon: Activity feed showing recent important events across all sections
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
