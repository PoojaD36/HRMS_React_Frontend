import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateDepartment, useUpdateDepartment } from '@/hooks/useDepartments';
import { Department } from '@/lib/api/departmentApi';

const departmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  status: z.boolean(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  open: boolean;
  onClose: () => void;
  editingDepartment: Department | null;
}

export function DepartmentForm({ open, onClose, editingDepartment }: DepartmentFormProps) {
  const [status, setStatus] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      description: '',
      status: true,
    },
  });

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isError = createMutation.isError || updateMutation.isError;

  useEffect(() => {
    if (editingDepartment) {
      reset({
        name: editingDepartment.name,
        description: editingDepartment.description || '',
        status: editingDepartment.status,
      });
      setStatus(editingDepartment.status);
    } else {
      reset({
        name: '',
        description: '',
        status: true,
      });
      setStatus(true);
    }
  }, [editingDepartment, open, reset]);

  const onSubmit = (data: DepartmentFormValues) => {
    const mutation = editingDepartment
      ? updateMutation.mutateAsync({ id: editingDepartment.id, data })
      : createMutation.mutateAsync(data);

    mutation
      .then(() => {
        onClose();
        reset();
      })
      .catch(() => {
        // Error handled by mutation state
      });
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingDepartment ? 'Edit Department' : 'Add New Department'}
          </DialogTitle>
          <DialogDescription>
            {editingDepartment
              ? 'Update the department information below.'
              : 'Fill in the details to create a new department.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Engineering, Marketing"
              {...register('name')}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the department..."
              rows={3}
              {...register('description')}
              disabled={isPending}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={status}
              onCheckedChange={(checked) => {
                setStatus(checked);
                setValue('status', checked);
              }}
              disabled={isPending}
            />
            <Label className="cursor-pointer">Active Status</Label>
          </div>

          {isError && (
            <Alert variant="error">
              <AlertDescription>
                {editingDepartment
                  ? 'Failed to update department. Please try again.'
                  : 'Failed to create department. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? 'Saving...'
                : editingDepartment
                ? 'Update Department'
                : 'Create Department'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
