import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Briefcase, Plus, Pencil, Trash2 } from 'lucide-react';
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
import { useDepartments, useDeleteDepartment } from '@/hooks/useDepartments';
import { DepartmentForm } from './DepartmentForm';
import { DeleteDepartmentDialog } from './DeleteDepartmentDialog';
import { Department } from '@/lib/api/departmentApi';
import { AlertCircle } from 'lucide-react';

export function DepartmentListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);

  const { data, isLoading, isError, error } = useDepartments({
    search: search || undefined,
    page,
    per_page: 10,
  });

  const deleteMutation = useDeleteDepartment();

  const handleEdit = (dept: Department) => {
    setEditingDepartment(dept);
    setFormOpen(true);
  };

  const handleDelete = (dept: Department) => {
    setDeletingDepartment(dept);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingDepartment) {
      deleteMutation.mutate(deletingDepartment.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingDepartment(null);
        },
      });
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingDepartment(null);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setDeletingDepartment(null);
  };

  return (
    <MainLayout title="Departments" subtitle="Manage your organizational departments">
      <div className="space-y-6">
        {/* Header with search and add button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search departments..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button onClick={() => setFormOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>

        {/* Error state */}
        {isError && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load departments'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="border rounded-lg">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center p-4 border-b last:border-b-0">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/3 ml-4" />
                <Skeleton className="h-6 w-16 ml-auto" />
                <Skeleton className="h-8 w-24 ml-4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Empty state */}
            {!data?.data.length && !search ? (
              <div className="text-center py-12 border rounded-lg bg-white">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No departments yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first department</p>
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="border rounded-lg bg-white overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.data.map((dept) => (
                        <TableRow key={dept.id}>
                          <TableCell className="font-medium">{dept.name}</TableCell>
                          <TableCell className="text-gray-500">
                            {dept.description || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={dept.status ? 'success' : 'secondary'}>
                              {dept.status ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(dept)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(dept)}
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

                {/* Pagination */}
                {data && data.last_page > 1 && (
                  <div className="flex items-center justify-between">
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
      <DepartmentForm
        open={formOpen}
        onClose={handleCloseForm}
        editingDepartment={editingDepartment}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDepartmentDialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        department={deletingDepartment}
        isDeleting={deleteMutation.isPending}
      />
    </MainLayout>
  );
}
