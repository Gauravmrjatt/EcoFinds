'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const { getAuthHeaders, isAuthenticated, user: authUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && authUser) {
      fetchUserProfile();
    } else if (!loading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/profile`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      const userProfile = data.user;
      setUser(userProfile);
      setFormData({
        username: userProfile.username || '',
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      setUser(data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error(error.message || 'Failed to update profile');
      setErrors({
        form: error.message || 'Failed to update profile. Please try again.',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
              <p className="text-gray-500 mb-6">You need to be logged in to view your profile.</p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
            <p className="mt-1 text-sm text-gray-600">
              Update your account profile information and preferences.
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="flex items-center space-x-5 mb-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <Image
                        className="h-16 w-16 rounded-full"
                        src={user.avatar}
                        alt="User avatar"
                        width={64}
                        height={64}
                      />
                      {isEditing && (
                        <label
                          htmlFor="avatar-upload"
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                        >
                          <span className="sr-only">Change avatar</span>
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <input
                            id="avatar-upload"
                            name="avatar"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user?.username}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={handleChange}
                      className={errors.username ? 'border-red-500' : ''}
                      disabled={!isEditing}
                      required
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'border-red-500' : ''}
                      disabled={!isEditing}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="col-span-6">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      placeholder="Tell us about yourself"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    />
                  </div>
                </div>

                {errors.form && (
                  <div className="text-red-500 text-sm mt-4">{errors.form}</div>
                )}
              </CardContent>

              <CardFooter className="flex justify-end space-x-3">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: user?.username || '',
                          email: user?.email || '',
                          firstName: user?.firstName || '',
                          lastName: user?.lastName || '',
                          phone: user?.phone || '',
                          bio: user?.bio || ''
                        });
                        setErrors({});
                      }}
                    >
                      Cancel
                    </Button>
                    <Button className="bg-green-600 text-white hover:bg-green-600/80" type="submit">
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Account Management</h3>
            <p className="mt-1 text-sm text-gray-600">
              Manage your account settings and preferences.
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <Card>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Change Password</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your password to keep your account secure.
                  </p>
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      <Link href="/profile/change-password">Change Password</Link>
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-base font-medium text-gray-900">Notifications</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your notification preferences.
                  </p>
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      <Link href="/profile/notifications">Manage Notifications</Link>
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-base font-medium text-red-600">Delete Account</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Permanently delete your account and all associated data.
                  </p>
                  <div className="mt-3">
                    <Button variant="danger" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}