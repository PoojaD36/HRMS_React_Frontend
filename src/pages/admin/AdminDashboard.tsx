import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  Plus,
  Mail,
  Phone,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { companyApi, CompanyRegistrationData } from '@/lib/api/companyApi';
import axios from 'axios';

interface CompanyFormData extends CompanyRegistrationData {
  confirmPassword?: string;
}

export function AdminDashboard() {
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCompany, setCreatedCompany] = useState<{
    companyName: string;
    companyCode: string;
    adminEmail: string;
  } | null>(null);

  const [formData, setFormData] = useState<CompanyFormData>({
    company_name: '',
    company_email: '',
    phone: '',
    admin_name: '',
    admin_email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.company_name.trim()) {
      return 'Company name is required';
    }
    if (!formData.company_email.trim() || !/^\S+@\S+\.\S+$/.test(formData.company_email)) {
      return 'Valid company email is required';
    }
    if (!formData.admin_name.trim()) {
      return 'Admin name is required';
    }
    if (!formData.admin_email.trim() || !/^\S+@\S+\.\S+$/.test(formData.admin_email)) {
      return 'Valid admin email is required';
    }
    if (!formData.password || formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsCreating(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await companyApi.registerCompany(registrationData);

      setCreatedCompany({
        companyName: response.data.company.name,
        companyCode: response.data.company.company_code,
        adminEmail: response.data.user.email,
      });
      setShowSuccess(true);

      // Reset form
      setFormData({
        company_name: '',
        company_email: '',
        phone: '',
        admin_name: '',
        admin_email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.response?.data?.error;
        setError(
          message || 'Failed to create company. Please try again.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleReset = () => {
    setShowSuccess(false);
    setCreatedCompany(null);
    setError(null);
  };

  return (
    <MainLayout
      title="Admin Dashboard"
      subtitle="Create and manage companies"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {showSuccess ? 'Company Created Successfully!' : 'Create New Company'}
            </h2>
            <p className="text-gray-500 mt-1">
              {showSuccess
                ? 'Share these details with the company administrator'
                : 'Fill in the details below to register a new company'}
            </p>
          </div>
          {showSuccess && (
            <Button variant="outline" onClick={handleReset}>
              <Plus className="h-4 w-4 mr-2" />
              Create Another
            </Button>
          )}
        </div>

        {showSuccess && createdCompany ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-semibold text-green-900">Company Registration Complete</h3>
                    <p className="text-sm text-green-700 mt-1">
                      The company has been successfully registered and their database has been set up.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3 border border-green-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Company Name</p>
                        <p className="font-medium text-gray-900">{createdCompany.companyName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Company Code</p>
                        <p className="font-medium text-gray-900 font-mono">{createdCompany.companyCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Admin Email</p>
                        <p className="font-medium text-gray-900">{createdCompany.adminEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800">
                      <strong>Important:</strong> Please share these details with the company administrator.
                      They can use their email and the password you set to log in to their dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Company Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Details
                </CardTitle>
                <CardDescription>
                  Enter the company information for the new tenant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    placeholder="Acme Corporation"
                    value={formData.company_name}
                    onChange={handleChange}
                    disabled={isCreating}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_email">Company Email *</Label>
                  <Input
                    id="company_email"
                    name="company_email"
                    type="email"
                    placeholder="company@example.com"
                    value={formData.company_email}
                    onChange={handleChange}
                    disabled={isCreating}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isCreating}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Admin Account Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Administrator Account
                </CardTitle>
                <CardDescription>
                  Create the primary administrator account for this company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin_name">Admin Name *</Label>
                  <Input
                    id="admin_name"
                    name="admin_name"
                    placeholder="John Doe"
                    value={formData.admin_name}
                    onChange={handleChange}
                    disabled={isCreating}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_email">Admin Email *</Label>
                  <Input
                    id="admin_email"
                    name="admin_email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.admin_email}
                    onChange={handleChange}
                    disabled={isCreating}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isCreating}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isCreating}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Password must be at least 6 characters long. The admin will be able to change it
                  after first login.
                </p>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({
                  company_name: '',
                  company_email: '',
                  phone: '',
                  admin_name: '',
                  admin_email: '',
                  password: '',
                  confirmPassword: '',
                })}
                disabled={isCreating}
              >
                Clear Form
              </Button>
              <Button type="submit" disabled={isCreating} className="min-w-[160px]">
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Company
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}
