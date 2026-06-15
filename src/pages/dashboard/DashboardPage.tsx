import {
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  CreditCard,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const stats = [
    {
      name: 'Total Employees',
      value: '--',
      change: '+0 from last month',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Departments',
      value: '--',
      change: 'No data yet',
      changeType: 'neutral',
      icon: Briefcase,
      color: 'bg-purple-500',
    },
    {
      name: 'Designations',
      value: '--',
      change: 'No data yet',
      changeType: 'neutral',
      icon: GraduationCap,
      color: 'bg-green-500',
    },
    {
      name: 'Subscription',
      value: 'Trial',
      change: '14 days remaining',
      changeType: 'neutral',
      icon: CreditCard,
      color: 'bg-orange-500',
    },
  ];

  const quickActions = [
    {
      name: 'Add Department',
      icon: Briefcase,
      description: 'Create a new department',
      color: 'bg-purple-50 text-purple-600',
      onClick: () => navigate('/departments'),
    },
  ];

  return (
    <MainLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={action.onClick}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left"
              >
                <div className={`inline-flex p-2 rounded-lg mb-3 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.name}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Getting Started */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 mb-4">
              Welcome to your HRMS dashboard! Start by creating your departments:
            </p>
            <ul className="space-y-2">
              {[
                'Create departments for your organization',
                'Manage department settings and status',
                'More features coming soon...',
              ].map((item, index) => (
                <li key={index} className="flex items-start text-sm text-blue-700">
                  <svg
                    className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-500">Company Name</span>
                <span className="text-sm font-medium text-gray-900">{user?.company_name || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-500">Subscription</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Trial Plan
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-500">Employee Limit</span>
                <span className="text-sm font-medium text-gray-900">0 / 10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Trial Expires</span>
                <span className="text-sm font-medium text-gray-900">14 days</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/subscription')}
            >
              Manage Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;
