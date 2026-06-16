import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Calendar,
  DollarSign,
  Users,
} from 'lucide-react';
import { useEmployee } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { useDesignations } from '@/hooks/useDesignations';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import { EmployeeForm } from './EmployeeForm';
import { DeleteEmployeeDialog } from './DeleteEmployeeDialog';
import { AlertCircle } from 'lucide-react';

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  intern: 'Intern',
};

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: employee, isLoading, isError, error } = useEmployee(Number(id));
  const { data: departments = [] } = useDepartments({ per_page: 100 });
  const { data: designations = [] } = useDesignations({ per_page: 100 });

  const handleEdit = () => {
    setFormOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <MainLayout title="Employee Details">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32" />
        </div>
      </MainLayout>
    );
  }

  if (isError || !employee) {
    return (
      <MainLayout title="Employee Details">
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load employee details'}
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/employees')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Employee Details" subtitle={employee.full_name}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/employees')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-2xl border-4">
                {employee.profile_image ? (
                  <img
                    src={employee.profile_image}
                    alt={employee.full_name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  employee.first_name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{employee.full_name}</h2>
                <p className="text-gray-500">{employee.employee_code}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant={employee.status ? 'success' : 'secondary'}>
                    {employee.status ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline">
                    {EMPLOYMENT_TYPE_LABELS[employee.employment_type]}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{employee.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">
                    {employee.department ? (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {employee.department.name}
                      </Badge>
                    ) : (
                      'Not assigned'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="font-medium">
                    {employee.designation?.name || 'Not assigned'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Reporting Manager</p>
                  <p className="font-medium">
                    {employee.manager?.name || 'No manager'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Joining Date</p>
                  <p className="font-medium">
                    {employee.joining_date
                      ? new Date(employee.joining_date).toLocaleDateString()
                      : 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">
                    {employee.salary
                      ? `$${Number(employee.salary).toLocaleString()}`
                      : 'Not disclosed'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <EmployeeForm
        open={formOpen}
        onClose={handleCloseForm}
        editingEmployee={employee}
        departments={departments}
        designations={designations}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteEmployeeDialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        onConfirm={handleCloseDelete}
        employee={employee}
        isDeleting={false}
      />
    </MainLayout>
  );
}
