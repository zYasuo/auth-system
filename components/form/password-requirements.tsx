'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const requirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    label: 'One lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'One number',
    test: (password) => /[0-9]/.test(password),
  },
  {
    label: 'One special character',
    test: (password) => /[^a-zA-Z0-9]/.test(password),
  },
]

interface PasswordRequirementsProps {
  password: string
  className?: string
}

export function PasswordRequirements({ password, className }: PasswordRequirementsProps) {
  return (
    <div className={cn('mt-2 space-y-1', className)}>
      <p className="text-sm text-muted-foreground mb-2">Password must contain:</p>
      {requirements.map((requirement, index) => {
        const isValid = requirement.test(password)
        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-2 text-sm transition-colors',
              isValid ? 'text-green-600' : 'text-muted-foreground'
            )}
          >
            {isValid ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span>{requirement.label}</span>
          </div>
        )
      })}
    </div>
  )
}
