"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getCurrentUser } from "@/lib/auth";
import { userResponseDto } from "@/core/dtos/User.dto";
import ProfileForm from "./components/ProfileForm";
import ProfileView from "./components/ProfileView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<userResponseDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      if (!isAuthenticated) {
        router.push("/login/request-otp");
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/login/request-otp");
          return;
        }

        setUser(currentUser);

        // Check if profile is complete (has firstName and lastName)
        const profileComplete = !!(
          currentUser.firstName && currentUser.lastName
        );
        setIsProfileComplete(profileComplete);

        // If profile is not complete, show the form
        if (!profileComplete) {
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        router.push("/login/request-otp");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadProfile();
  }, [isAuthenticated, router]);

  const handleProfileUpdate = async (updatedUser: userResponseDto) => {
    setUser(updatedUser);
    setIsEditing(false);
    setIsProfileComplete(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              User not found. Please log in again.
            </p>
            <Button
              onClick={() => router.push("/login/request-otp")}
              className="w-full mt-4"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            {isProfileComplete
              ? "Manage your account information and preferences"
              : "Please complete your profile information"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Profile Information</span>
                  {isProfileComplete && !isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditClick}
                    >
                      Edit Profile
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <ProfileForm
                    user={user}
                    onSave={handleProfileUpdate}
                    onCancel={handleCancelEdit}
                    isFirstTime={!isProfileComplete}
                  />
                ) : (
                  <ProfileView user={user} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  My Orders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Wishlist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Help & Support
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member since:</span>
                    <span className="text-sm font-medium">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium text-green-600">
                      Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
