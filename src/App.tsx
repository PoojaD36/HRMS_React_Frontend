import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { DepartmentListPage } from './pages/departments/DepartmentListPage';
import { DesignationListPage } from './pages/designations/DesignationListPage';
import { EmployeeListPage } from './pages/employees/EmployeeListPage';
import { EmployeeDetailPage } from './pages/employees/EmployeeDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <DepartmentListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/designations"
            element={
              <ProtectedRoute>
                <DesignationListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeeListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <ProtectedRoute>
                <EmployeeDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
