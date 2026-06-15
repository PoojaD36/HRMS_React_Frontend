import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GraduationCap, Plus, Pencil, Trash2 } from 'lucide-react';
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
import { useDesignations, useDeleteDesignation } from '@/hooks/useDesignations';
import { useDepartments } from '@/hooks/useDepartments';
import { Designation } from '@/lib/api/designationApi';
import { DesignationForm } from './DesignationForm';
import { DeleteDesignationDialog } from './DeleteDesignationDialog';
import { AlertCircle } from 'lucide-react';

export function DesignationListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);
  const [deletingDesignation, setDeletingDesignation] = useState<Designation | null>(null);

  const { data, isLoading, isError, error } = useDesignations({
    search: search || undefined,
    page,
    per_page: 10,
  });

  // Fetch departments for the dropdown in the form
  const { data: departmentsData } = useDepartments({
    per_page: 100, // Get all departments
  });

  const deleteMutation = useDeleteDesignation();

  const handleEdit = (designation: Designation) => {
    setEditingDesignation(designation);
    setFormOpen(true);
  };

  const handleDelete = (designation: Designation) => {
    setDeletingDesignation(designation);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingDesignation) {
      deleteMutation.mutate(deletingDesignation.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingDesignation(null);
        },
      });
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingDesignation(null);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setDeletingDesignation(null);
  };

  const departments = departmentsData?.data || [];

  return (
    <MainLayout title="Designations" subtitle="Manage job titles and positions">
      <div className="space-y-6">
        {/* Header with search and add button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search designations..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button onClick={() => setFormOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Designation
          </Button>
        </div>

        {/* Error state */}
        {isError && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load designations'}
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
                <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No designations yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first designation</p>
                {departments.length === 0 ? (
                  <p className="text-sm text-amber-600 mb-4">
                    Note: You need to create a department first
                  </p>
                ) : (
                  <Button onClick={() => setFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Designation
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="border rounded-lg bg-white overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead className="w-[200px]">Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.data.map((designation) => (
                        <TableRow key={designation.id}>
                          <TableCell className="font-medium">{designation.name}</TableCell>
                          <TableCell className="text-gray-500">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              {designation.department?.name || '-'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={designation.status ? 'success' : 'secondary'}>
                              {designation.status ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(designation)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(designation)}
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
      <DesignationForm
        open={formOpen}
        onClose={handleCloseForm}
        editingDesignation={editingDesignation}
        departments={departments}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDesignationDialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        designation={deletingDesignation}
        isDeleting={deleteMutation.isPending}
      />
    </MainLayout>
  );
}
