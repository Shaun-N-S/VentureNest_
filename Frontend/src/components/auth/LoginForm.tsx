"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginFormData = z.infer<typeof loginSchema>

type LoginFormProps = {
  onSubmit: (values: LoginFormData) => void
}

export default function LoginForm({ onSubmit }: LoginFormProps) {

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted-foreground">Email</label>
        <div className="relative">
          {/* Leading icon */}
          <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-muted-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6.5l7.105 4.74a2 2 0 0 0 1.79 0L20 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <input
            {...register("email")}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={`w-full rounded-xl border bg-background text-foreground placeholder:text-muted-foreground pl-10 pr-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition ${errors.email ? "border-destructive" : "border-input"
              }`}
          />
        </div>
        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted-foreground">Password</label>
        <div className="relative">
          {/* Leading icon */}
          <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-muted-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4.75" y="10.75" width="14.5" height="8.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>

          {/* Input */}
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            className={`w-full rounded-xl border bg-background text-foreground placeholder:text-muted-foreground pl-10 pr-10 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition ${errors.password ? "border-destructive" : "border-input"
              }`}
          />

          {/* Eye toggle button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={1.5} />
            ) : (
              <Eye size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>
        {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.995 }}
        type="submit"
        className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Login
      </motion.button>
    </motion.form>
  )
}
