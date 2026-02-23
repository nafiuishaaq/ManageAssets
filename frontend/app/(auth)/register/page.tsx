"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterMutation, useLoginMutation } from "@/lib/query/mutations/auth";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";

// Zod schema for registration validation
const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegisterMutation({
    onSuccess: (data) => {
      // Auto-login after successful registration
      loginMutation.mutate({
        email: data.user.email,
        password: "", // We don't have the password here, need to handle differently
      });
    },
    onError: (error: any) => {
      if (error.errors) {
        // Handle field-specific errors from API
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof RegisterFormData, {
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      } else {
        setApiError(error.message || "Registration failed");
      }
    },
  });

  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      setApiError("Registration successful but login failed. Please try logging in manually.");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setApiError("");
    
    // For now, we'll register and then require manual login
    // In a real implementation, you might want to handle auto-login differently
    const { confirmPassword, ...registerData } = data;
    
    registerMutation.mutate({
      ...registerData,
      name: `${data.firstName} ${data.lastName}`,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="mt-1">
              <input
                {...register("firstName")}
                type="text"
                autoComplete="given-name"
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.firstName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <div className="mt-1">
              <input
                {...register("lastName")}
                type="text"
                autoComplete="family-name"
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.lastName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                {...register("password")}
                type="password"
                autoComplete="new-password"
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Create password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <div className="mt-1">
              <input
                {...register("confirmPassword")}
                type="password"
                autoComplete="new-password"
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{apiError}</div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={registerMutation.isPending || loginMutation.isPending}
            className="w-full"
          >
            {registerMutation.isPending
              ? "Creating account..."
              : loginMutation.isPending
              ? "Signing in..."
              : "Create account"}
          </Button>
        </div>
      </form>
    </div>
  );
}
