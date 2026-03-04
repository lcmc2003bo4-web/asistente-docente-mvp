'use client'

import React, { useState } from 'react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string
    error?: string
    helper?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    showPasswordToggle?: boolean
    maxChars?: number
}

export default function Input({
    label,
    error,
    helper,
    leftIcon,
    rightIcon,
    showPasswordToggle,
    maxChars,
    id,
    type = 'text',
    required,
    className = '',
    value,
    onChange,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const actualType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type
    const charCount = typeof value === 'string' ? value.length : 0

    const baseInputClasses = [
        'w-full bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
        leftIcon ? 'pl-10' : 'pl-3',
        (rightIcon || showPasswordToggle) ? 'pr-10' : 'pr-3',
        'py-2.5',
        error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100',
        className,
    ].join(' ')

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500 text-xs">*</span>}
                </label>
            )}

            <div className="relative">
                {/* Left icon */}
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    type={actualType}
                    required={required}
                    value={value}
                    onChange={onChange}
                    aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
                    aria-invalid={!!error}
                    className={baseInputClasses}
                    {...props}
                />

                {/* Right icon / password toggle */}
                {showPasswordToggle ? (
                    <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showPassword ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                ) : rightIcon ? (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {rightIcon}
                    </div>
                ) : null}
            </div>

            {/* Footer: error / helper / char count */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    {error && (
                        <p id={`${inputId}-error`} className="text-xs text-red-600 flex items-center gap-1">
                            <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            {error}
                        </p>
                    )}
                    {!error && helper && (
                        <p id={`${inputId}-helper`} className="text-xs text-slate-400">{helper}</p>
                    )}
                </div>
                {maxChars && (
                    <span className={`text-xs flex-shrink-0 ${charCount > maxChars ? 'text-red-500' : 'text-slate-400'}`}>
                        {charCount}/{maxChars}
                    </span>
                )}
            </div>
        </div>
    )
}
