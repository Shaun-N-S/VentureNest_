"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const SignupSchema = z
  .object({
    userName: z.string().min(3, "Please enter your full name").max(50, "Name is too long"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one symbol"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type SignupFormValues = z.infer<typeof SignupSchema>

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void
}

export default function SignUpForm({ onSubmit }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { userName: "", email: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-foreground/80">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="John Doe"
          {...register("userName")}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 outline-none ring-0 focus:border-primary/60"
          aria-invalid={!!errors.userName}
          aria-describedby={errors.userName ? "fullName-error" : undefined}
        />
        {errors.userName && (
          <p id="fullName-error" className="mt-1 text-sm text-red-600">
            {errors.userName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="founder@company.com"
          {...register("email")}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 outline-none ring-0 focus:border-primary/60"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground/80">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            {...register("password")}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-12 outline-none ring-0 focus:border-primary/60"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/70"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground/80">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your password"
            {...register("confirmPassword")}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-12 outline-none ring-0 focus:border-primary/60"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/70"
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Creating Account..." : "Create your account"}
        </button>
      </div>
    </form>
  )
}
