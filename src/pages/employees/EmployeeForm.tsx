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
import { useCreateEmployee, useUpdateEmployee, useManagers } from '@/hooks/useEmployees';
import { Employee, EmployeeFormData } from '@/lib/api/employeeApi';
import { Designation } from '@/lib/api/designationApi';
import { Upload, X, User } from 'lucide-react';

interface Department {
  id: number;
  name: string;
}

const employeeSchema = z.object({
  department_id: z.number().positive('Department is required'),
  designation_id: z.number().positive('Designation is required'),
  reporting_manager_id: z.number().positive().optional().or(z.literal(null)),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  joining_date: z.string().optional(),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'intern'], {
    message: 'Employment type is required',
  }),
  salary: z.number().positive().optional().or(z.literal(null)),
  status: z.boolean(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  editingEmployee: Employee | null;
  departments: Department[];
  designations: Designation[];
}

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'intern', label: 'Intern' },
];

export function EmployeeForm({
  open,
  onClose,
  editingEmployee,
  departments,
  designations,
}: EmployeeFormProps) {
  const [status, setStatus] = useState(true);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

  const { data: managers } = useManagers();

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  const designationOptions = designations
    .filter((d) => !selectedDepartment || d.department_id === selectedDepartment)
    .map((d) => ({
      value: d.id,
      label: `${d.name} (${departments.find((dep) => dep.id === d.department_id)?.name || 'N/A'})`,
    }));

  const managerOptions = [
    { value: '', label: 'No Manager' },
    ...(managers
      ?.filter((m) => !editingEmployee || m.id !== editingEmployee.id)
      .map((m) => ({
        value: m.id,
        label: m.full_name || m.email,
      })) || []),
  ];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      joining_date: '',
      employment_type: 'full_time',
      salary: undefined,
      department_id: 0,
      designation_id: 0,
      reporting_manager_id: null,
      status: true,
    },
  });

  const watchedDepartment = watch('department_id');
  const watchedDesignation = watch('designation_id');

  useEffect(() => {
    setSelectedDepartment(watchedDepartment || null);
  }, [watchedDepartment]);

  useEffect(() => {
    if (editingEmployee) {
      reset({
        first_name: editingEmployee.first_name,
        last_name: editingEmployee.last_name || '',
        email: editingEmployee.email,
        phone: editingEmployee.phone || '',
        joining_date: editingEmployee.joining_date || '',
        employment_type: editingEmployee.employment_type,
        salary: editingEmployee.salary || undefined,
        department_id: editingEmployee.department?.id || 0,
        designation_id: editingEmployee.designation?.id || 0,
        reporting_manager_id: editingEmployee.manager?.id || null,
        status: editingEmployee.status,
      });
      setStatus(editingEmployee.status);
      setSelectedDepartment(editingEmployee.department?.id || null);
      if (editingEmployee.profile_image) {
        setProfileImagePreview(editingEmployee.profile_image);
      }
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        joining_date: '',
        employment_type: 'full_time',
        salary: undefined,
        department_id: 0,
        designation_id: 0,
        reporting_manager_id: null,
        status: true,
      });
      setStatus(true);
      setProfileImage(null);
      setProfileImagePreview(null);
    }
  }, [editingEmployee, open, reset]);

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isError = createMutation.isError || updateMutation.isError;

  const onSubmit = (data: EmployeeFormValues) => {
    const submitData: EmployeeFormData = {
      ...data,
      employment_type: data.employment_type as 'full_time' | 'part_time' | 'contract' | 'intern',
      reporting_manager_id: data.reporting_manager_id || undefined,
      salary: data.salary ?? undefined,
    };

    if (profileImage) {
      submitData.profile_image = profileImage;
    }

    const mutation = editingEmployee
      ? updateMutation.mutateAsync({ id: editingEmployee.id, data: submitData })
      : createMutation.mutateAsync(submitData);

    mutation
      .then(() => {
        onClose();
        reset();
        setProfileImage(null);
        setProfileImagePreview(null);
      })
      .catch(() => {
        // Error handled by mutation state
      });
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
      reset();
      setProfileImage(null);
      setProfileImagePreview(null);
    }
  };

  const handleDepartmentChange = (value: string | number) => {
    const deptId = Number(value);
    setValue('department_id', deptId);
    setValue('designation_id', 0);
    trigger('department_id');
    setSelectedDepartment(deptId);
  };

  const handleDesignationChange = (value: string | number) => {
    setValue('designation_id', Number(value));
    trigger('designation_id');
  };

  const handleManagerChange = (value: string | number) => {
    if (value === '' || value === null) {
      setValue('reporting_manager_id', null);
    } else {
      setValue('reporting_manager_id', Number(value));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        return;
      }
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogDescription>
            {editingEmployee
              ? 'Update the employee information below.'
              : 'Fill in the details to add a new employee.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <div>
              <Label htmlFor="profile_image" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </div>
              </Label>
              <input
                type="file"
                id="profile_image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isPending}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
              {profileImagePreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="mt-1 text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                placeholder="John"
                {...register('first_name')}
                disabled={isPending}
              />
              {errors.first_name && (
                <p className="text-sm text-red-600">{errors.first_name.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                placeholder="Doe"
                {...register('last_name')}
                disabled={isPending}
              />
              {errors.last_name && (
                <p className="text-sm text-red-600">{errors.last_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@company.com"
                {...register('email')}
                disabled={isPending}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1 234 567 8900"
                {...register('phone')}
                disabled={isPending}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Select
                label="Department *"
                placeholder="Select department"
                options={departmentOptions}
                value={watchedDepartment || null}
                onChange={handleDepartmentChange}
                disabled={isPending}
                error={errors.department_id?.message}
                required
              />
              <input type="hidden" {...register('department_id', { valueAsNumber: true })} />
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Select
                label="Designation *"
                placeholder={watchedDepartment ? 'Select designation' : 'Select department first'}
                options={designationOptions}
                value={watchedDesignation || null}
                onChange={handleDesignationChange}
                disabled={isPending || !watchedDepartment}
                error={errors.designation_id?.message}
                required
              />
              <input type="hidden" {...register('designation_id', { valueAsNumber: true })} />
            </div>

            {/* Reporting Manager */}
            <div className="space-y-2">
              <Select
                label="Reporting Manager"
                placeholder="Select manager (optional)"
                options={managerOptions}
                value={watch('reporting_manager_id') || null}
                onChange={handleManagerChange}
                disabled={isPending}
              />
              <input
                type="hidden"
                {...register('reporting_manager_id', { valueAsNumber: true })}
              />
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment Type *</Label>
              <Select
                placeholder="Select type"
                options={EMPLOYMENT_TYPE_OPTIONS}
                value={watch('employment_type')}
                onChange={(v) => setValue('employment_type', v as any)}
                disabled={isPending}
                error={errors.employment_type?.message}
                required
              />
              {errors.employment_type && (
                <p className="text-sm text-red-600">{errors.employment_type.message}</p>
              )}
            </div>

            {/* Joining Date */}
            <div className="space-y-2">
              <Label htmlFor="joining_date">Joining Date</Label>
              <Input
                id="joining_date"
                type="date"
                {...register('joining_date')}
                disabled={isPending}
              />
              {errors.joining_date && (
                <p className="text-sm text-red-600">{errors.joining_date.message}</p>
              )}
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                placeholder="0.00"
                {...register('salary', { valueAsNumber: true })}
                disabled={isPending}
              />
              {errors.salary && (
                <p className="text-sm text-red-600">{errors.salary.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2 sm:col-span-2">
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
          </div>

          {isError && (
            <Alert variant="error">
              <AlertDescription>
                {editingEmployee
                  ? 'Failed to update employee. Please try again.'
                  : 'Failed to create employee. Please try again.'}
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
                : editingEmployee
                ? 'Update Employee'
                : 'Create Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
