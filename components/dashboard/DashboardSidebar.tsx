'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
    href: string
    label: string
    icon: React.ReactNode
    activeColor?: string        // clase de color cuando está activo
    activeBorder?: string       // color del borde izquierdo
}

interface NavGroup {
    label: string
    items: NavItem[]
}

// ── Íconos SVG Lucide (inline, sin dependencia extra) ──────────────
const HomeIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
)
const CalendarIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const BookOpenIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const FileTextIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
)
const CalendarDaysIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><circle cx="8" cy="15" r="1" fill="currentColor" /><circle cx="12" cy="15" r="1" fill="currentColor" /><circle cx="16" cy="15" r="1" fill="currentColor" />
    </svg>
)
const ShieldCheckIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
)
const SettingsIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
)

// ── Definición de rutas ─────────────────────────────────────────────
const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Principal',
        items: [
            { href: '/dashboard', label: 'Dashboard', icon: <HomeIcon />, activeColor: 'text-indigo-700', activeBorder: 'border-indigo-600' },
            { href: '/dashboard/programaciones', label: 'Programaciones', icon: <CalendarIcon />, activeColor: 'text-blue-700', activeBorder: 'border-blue-500' },
            { href: '/dashboard/unidades', label: 'Unidades Didácticas', icon: <BookOpenIcon />, activeColor: 'text-violet-700', activeBorder: 'border-violet-500' },
            { href: '/dashboard/sesiones', label: 'Sesiones', icon: <FileTextIcon />, activeColor: 'text-indigo-700', activeBorder: 'border-indigo-500' },
            { href: '/dashboard/planificador', label: 'Planificador', icon: <CalendarDaysIcon />, activeColor: 'text-slate-700', activeBorder: 'border-slate-500' },
        ],
    },
    {
        label: 'Herramientas',
        items: [
            { href: '/dashboard/validacion', label: 'Validación Normativa', icon: <ShieldCheckIcon />, activeColor: 'text-emerald-700', activeBorder: 'border-emerald-500' },
        ],
    },
    {
        label: 'Sistema',
        items: [
            { href: '/dashboard/configuracion', label: 'Configuración', icon: <SettingsIcon />, activeColor: 'text-slate-700', activeBorder: 'border-slate-400' },
        ],
    },
]

export default function DashboardSidebar({ name }: { name: string }) {
    const pathname = usePathname()

    // La ruta /dashboard exacta es solo activa para ese ítem, no para subpáginas
    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard'
        return pathname.startsWith(href)
    }

    return (
        <>
            {/* ── Sidebar desktop ── */}
            <aside
                aria-label="Navegación principal"
                className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-100 overflow-y-auto flex-shrink-0"
            >
                <nav className="flex-1 py-4 px-3 space-y-6">
                    {NAV_GROUPS.map(group => (
                        <div key={group.label}>
                            {/* Etiqueta del grupo */}
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
                                {group.label}
                            </p>
                            <ul className="space-y-0.5" role="list">
                                {group.items.map(item => {
                                    const active = isActive(item.href)
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                aria-current={active ? 'page' : undefined}
                                                className={[
                                                    'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150',
                                                    'border-l-2',
                                                    active
                                                        ? `bg-indigo-50 ${item.activeColor ?? 'text-indigo-700'} font-semibold ${item.activeBorder ?? 'border-indigo-600'}`
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent',
                                                ].join(' ')}
                                            >
                                                <span className={active ? (item.activeColor ?? 'text-indigo-600') : 'text-slate-400'}>
                                                    {item.icon}
                                                </span>
                                                <span className="truncate">{item.label}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Footer del sidebar — usuario */}
                <div className="border-t border-slate-100 p-3">
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
                        <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {name.split(' ').slice(0, 2).map(n => n[0]?.toUpperCase() ?? '').join('')}
                        </div>
                        <span className="text-xs text-slate-500 truncate leading-tight">{name}</span>
                    </div>
                </div>
            </aside>
        </>
    )
}
