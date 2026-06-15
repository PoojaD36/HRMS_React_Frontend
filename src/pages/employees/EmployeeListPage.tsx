import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Users, Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEmployees, useDeleteEmployee } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { useDesignations } from '@/hooks/useDesignations';
import { Employee } from '@/lib/api/employeeApi';
import { EmployeeForm } from './EmployeeForm';
import { DeleteEmployeeDialog } from './DeleteEmployeeDialog';
import { AlertCircle } from 'lucide-react';

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  intern: 'Intern',
};

export function EmployeeListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState<number | null>(null);
  const [designationFilter, setDesignationFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);

  const { data, isLoading, isError, error } = useEmployees({
    search: search || undefined,
    department_id: departmentFilter || undefined,
    designation_id: designationFilter || undefined,
    status: statusFilter !== null ? statusFilter : undefined,
    page,
    per_page: 10,
  });

  // Get departments and designations for filters and form
  const { data: departmentsData } = useDepartments({ per_page: 100 });
  const { data: designationsData } = useDesignations({ per_page: 100 });

  const deleteMutation = useDeleteEmployee();

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setDeletingEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleView = (employee: Employee) => {
    navigate(`/employees/${employee.id}`);
  };

  const handleConfirmDelete = () => {
    if (deletingEmployee) {
      deleteMutation.mutate(deletingEmployee.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingEmployee(null);
        },
      });
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingEmployee(null);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setDeletingEmployee(null);
  };

  const clearFilters = () => {
    setDepartmentFilter(null);
    setDesignationFilter(null);
    setStatusFilter(null);
  };

  const hasFilters = departmentFilter || designationFilter || statusFilter !== null;

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...(departmentsData?.data.map((d) => ({ value: d.id, label: d.name })) || []),
  ];

  const designationOptions = [
    { value: '', label: 'All Designations' },
    ...(designationsData?.data.map((d) => ({ value: d.id, label: d.name })) || []),
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  const departments = departmentsData?.data || [];
  const designations = designationsData?.data || [];

  return (
    <MainLayout title="Employees" subtitle="Manage your workforce">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search by name, email, code, phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button onClick={() => setFormOpen(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              placeholder="Filter by department"
              options={departmentOptions}
              value={departmentFilter}
              onChange={(v) => setDepartmentFilter(v === '' ? null : Number(v))}
              className="flex-1"
            />
            <Select
              placeholder="Filter by designation"
              options={designationOptions}
              value={designationFilter}
              onChange={(v) => setDesignationFilter(v === '' ? null : Number(v))}
              className="flex-1"
            />
            <Select
              placeholder="Filter by status"
              options={statusOptions}
              value={statusFilter === null ? null : (statusFilter ? 'true' : 'false')}
              onChange={(v) => setStatusFilter(v === '' ? null : v === 'true')}
              className="flex-1 sm:w-40"
            />
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Error state */}
        {isError && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load employees'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="border rounded-lg overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center p-4 border-b last:border-b-0 gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-20 ml-auto" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Empty state */}
            {!data?.data.length && !search && !hasFilters ? (
              <div className="text-center py-12 border rounded-lg bg-white">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No employees yet</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first employee</p>
                {departments.length === 0 || designations.length === 0 ? (
                  <p className="text-sm text-amber-600 mb-4">
                    Note: You need to create departments and designations first
                  </p>
                ) : (
                  <Button onClick={() => setFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="border rounded-lg bg-white overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead className="hidden sm:table-cell">Email</TableHead>
                          <TableHead className="hidden md:table-cell">Department</TableHead>
                          <TableHead className="hidden lg:table-cell">Designation</TableHead>
                          <TableHead className="hidden md:table-cell">Employment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.data.map((employee) => (
                          <TableRow
                            key={employee.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleView(employee)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                  {employee.profile_image ? (
                                    <img
                                      src={employee.profile_image}
                                      alt={employee.full_name}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    employee.first_name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{employee.full_name}</div>
                                  <div className="text-sm text-gray-500 sm:hidden">
                                    {employee.email}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {employee.employee_code}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-gray-500">
                              {employee.email}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {employee.department ? (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                  {employee.department.name}
                                </Badge>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-gray-500">
                              {employee.designation?.name || '-'}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-gray-500">
                              <Badge variant="outline" className="text-xs">
                                {EMPLOYMENT_TYPE_LABELS[employee.employment_type]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={employee.status ? 'success' : 'secondary'}>
                                {employee.status ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(employee);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(employee);
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination */}
                {data && data.last_page > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                      Showing {(data.current_page - 1) * data.per_page + 1} to{' '}
                      {Math.min(data.current_page * data.per_page, data.total)} of {data.total} results
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                        disabled={page === data.last_page}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Form Dialog */}
      <EmployeeForm
        open={formOpen}
        onClose={handleCloseForm}
        editingEmployee={editingEmployee}
        departments={departments}
        designations={designations}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteEmployeeDialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        employee={deletingEmployee}
        isDeleting={deleteMutation.isPending}
      />
    </MainLayout>
  );
}
