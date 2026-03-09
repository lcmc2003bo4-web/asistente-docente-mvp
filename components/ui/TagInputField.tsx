'use client'

import React, { useState, KeyboardEvent } from 'react'

interface TagInputFieldProps {
    label: string
    value: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
    suggestions?: string[]
    maxTags?: number
    className?: string
}

/**
 * Campo de entrada de etiquetas (tags) reutilizable para capturar arrays de texto
 * como actividades económicas, problemáticas locales, festividades, etc.
 * Soporta Enter para confirmar y × para eliminar. Muestra sugerencias opcionales.
 */
export default function TagInputField({
    label,
    value,
    onChange,
    placeholder = 'Escribir y presionar Enter…',
    suggestions = [],
    maxTags = 10,
    className = '',
}: TagInputFieldProps) {
    const [inputValue, setInputValue] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

    const addTag = (tag: string) => {
        const trimmed = tag.trim()
        if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return
        onChange([...value, trimmed])
        setInputValue('')
        setShowSuggestions(false)
    }

    const removeTag = (tag: string) => {
        onChange(value.filter(t => t !== tag))
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag(inputValue)
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1])
        }
    }

    const filteredSuggestions = suggestions.filter(
        s => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
    )

    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            {/* Tags + Input */}
            <div className="flex flex-wrap gap-1.5 min-h-[42px] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-colors">
                {value.map(tag => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-indigo-900 dark:hover:text-white transition-colors"
                            aria-label={`Eliminar ${tag}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
                {value.length < maxTags && (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => {
                            setInputValue(e.target.value)
                            setShowSuggestions(e.target.value.length > 0 && filteredSuggestions.length > 0)
                        }}
                        onKeyDown={handleKeyDown}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        placeholder={value.length === 0 ? placeholder : ''}
                        className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
                    />
                )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="relative z-10">
                    <ul className="absolute top-0 left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredSuggestions.slice(0, 8).map(s => (
                            <li key={s}>
                                <button
                                    type="button"
                                    onMouseDown={() => addTag(s)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                >
                                    {s}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <p className="text-xs text-gray-400">
                {value.length}/{maxTags} etiquetas · Presiona Enter para añadir
            </p>
        </div>
    )
}
