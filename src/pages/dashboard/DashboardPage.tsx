import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', icon: Building2, current: true, href: '/dashboard' },
    { name: 'Employees', icon: Users, current: false, href: '/employees' },
    { name: 'Departments', icon: Briefcase, current: false, href: '/departments' },
    { name: 'Designations', icon: GraduationCap, current: false, href: '/designations' },
    { name: 'Subscription', icon: CreditCard, current: false, href: '/subscription' },
    { name: 'Settings', icon: Settings, current: false, href: '/settings' },
  ];

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
    { name: 'Add Employee', icon: Users, description: 'Create a new employee record', color: 'bg-blue-50 text-blue-600' },
    { name: 'Add Department', icon: Briefcase, description: 'Create a new department', color: 'bg-purple-50 text-purple-600' },
    { name: 'Add Designation', icon: GraduationCap, description: 'Create a new job title', color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HRMS</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`h-5 w-5 ${item.current ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'user@company.com'}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name || 'User'}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center space-x-2 pl-4 border-l">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          {/* Mobile Welcome */}
          <div className="sm:hidden mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.name || 'User'}!</p>
          </div>

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
              <div className="grid gap-4 sm:grid-cols-3">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    disabled
                    className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Welcome to your HRMS dashboard! Here's what you can do:
                </p>
                <ul className="space-y-2">
                  {[
                    'Add your first employees to the system',
                    'Create departments and designations',
                    'Set up reporting hierarchies',
                    'Manage subscriptions and billing',
                    'Configure system settings',
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
                    <span className="text-sm font-medium text-gray-900">5 / 10</span>
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
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
