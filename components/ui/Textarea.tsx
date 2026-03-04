'use client'

import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helper?: string
    maxChars?: number
}

export default function Textarea({
    label,
    error,
    helper,
    maxChars,
    id,
    required,
    className = '',
    value,
    onChange,
    rows = 4,
    ...props
}: TextareaProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const charCount = typeof value === 'string' ? value.length : 0

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500 text-xs">*</span>}
                </label>
            )}

            <textarea
                id={inputId}
                required={required}
                value={value}
                onChange={onChange}
                rows={rows}
                aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
                aria-invalid={!!error}
                className={[
                    'w-full bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400',
                    'px-3 py-2.5 resize-none transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-0',
                    error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100',
                    className,
                ].join(' ')}
                {...props}
            />

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
