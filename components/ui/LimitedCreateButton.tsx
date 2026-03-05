'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UpgradeModal from '@/components/ui/UpgradeModal'
import {
    getUserUsage,
    checkProgramacionLimit,
    checkUnidadLimit,
    checkSesionLimit,
    checkAiGenerationLimit,
} from '@/lib/services/UsageService'

// ── Types ──────────────────────────────────────────────────────────────
type LimitType = 'programacion' | 'unidad' | 'sesion' | 'ai'

interface LimitedCreateButtonProps {
    href: string
    limitType: LimitType
    children: React.ReactNode
    className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export default function LimitedCreateButton({
    href,
    limitType,
    children,
    className = '',
}: LimitedCreateButtonProps) {
    const router = useRouter()
    const [upgradeOpen, setUpgradeOpen] = useState(false)
    const [upgradeReason, setUpgradeReason] = useState<string | undefined>()
    const [checking, setChecking] = useState(false)

    async function handleClick() {
        setChecking(true)
        try {
            const usage = await getUserUsage()

            let result = { allowed: true, reason: undefined as string | undefined }

            if (limitType === 'programacion') {
                const r = checkProgramacionLimit(usage)
                result = { allowed: r.allowed, reason: r.reason }
            } else if (limitType === 'unidad') {
                const r = checkUnidadLimit(usage)
                result = { allowed: r.allowed, reason: r.reason }
            } else if (limitType === 'sesion') {
                const r = checkSesionLimit(usage)
                result = { allowed: r.allowed, reason: r.reason }
            } else if (limitType === 'ai') {
                const r = checkAiGenerationLimit(usage)
                result = { allowed: r.allowed, reason: r.reason }
            }

            if (result.allowed) {
                router.push(href)
            } else {
                setUpgradeReason(result.reason)
                setUpgradeOpen(true)
            }
        } catch {
            // On error (e.g. no subscription yet), allow navigation
            router.push(href)
        } finally {
            setChecking(false)
        }
    }

    return (
        <>
            <button
                onClick={handleClick}
                disabled={checking}
                className={`${className} ${checking ? 'opacity-80 cursor-wait' : ''}`}
            >
                {checking ? (
                    <span className="inline-flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                            <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        Verificando...
                    </span>
                ) : children}
            </button>

            <UpgradeModal
                isOpen={upgradeOpen}
                onClose={() => setUpgradeOpen(false)}
                reason={upgradeReason}
            />
        </>
    )
}
