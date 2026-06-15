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
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateDesignation, useUpdateDesignation } from '@/hooks/useDesignations';
import { Designation } from '@/lib/api/designationApi';
import { Department } from '@/lib/api/designationApi';

const designationSchema = z.object({
  department_id: z.number().positive('Department is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  status: z.boolean(),
});

type DesignationFormValues = z.infer<typeof designationSchema>;

interface DesignationFormProps {
  open: boolean;
  onClose: () => void;
  editingDesignation: Designation | null;
  departments: Department[];
}

export function DesignationForm({ open, onClose, editingDesignation, departments }: DesignationFormProps) {
  const [status, setStatus] = useState(true);

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<DesignationFormValues>({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      name: '',
      department_id: 0,
      status: true,
    },
  });

  const createMutation = useCreateDesignation();
  const updateMutation = useUpdateDesignation();

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isError = createMutation.isError || updateMutation.isError;

  useEffect(() => {
    if (editingDesignation) {
      reset({
        name: editingDesignation.name,
        department_id: editingDesignation.department_id,
        status: editingDesignation.status,
      });
      setStatus(editingDesignation.status);
    } else {
      reset({
        name: '',
        department_id: 0,
        status: true,
      });
      setStatus(true);
    }
  }, [editingDesignation, open, reset]);

  const onSubmit = (data: DesignationFormValues) => {
    const mutation = editingDesignation
      ? updateMutation.mutateAsync({ id: editingDesignation.id, data })
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

  const handleDepartmentChange = (value: string | number) => {
    setValue('department_id', Number(value));
    trigger('department_id');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingDesignation ? 'Edit Designation' : 'Add New Designation'}
          </DialogTitle>
          <DialogDescription>
            {editingDesignation
              ? 'Update the designation information below.'
              : 'Fill in the details to create a new designation.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Select
              label="Department *"
              placeholder="Select a department"
              options={departmentOptions}
              value={editingDesignation?.department_id || null}
              onChange={handleDepartmentChange}
              disabled={isPending}
              error={errors.department_id?.message}
              required
            />
            <input type="hidden" {...register('department_id', { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Designation Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Senior Developer, Manager"
              {...register('name')}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
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
                {editingDesignation
                  ? 'Failed to update designation. Please try again.'
                  : 'Failed to create designation. Please try again.'}
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
                : editingDesignation
                ? 'Update Designation'
                : 'Create Designation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
