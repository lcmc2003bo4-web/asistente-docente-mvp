import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChatWidget from '@/components/chat/ChatWidget'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('users')
        .select('nombre_completo')
        .eq('id', user.id)
        .single()

    const handleSignOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    const nombreCompleto = profile?.nombre_completo || user.email || 'Docente'
    const initials = nombreCompleto
        .split(' ')
        .slice(0, 2)
        .map((n: string) => n[0]?.toUpperCase() ?? '')
        .join('')

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
            {/* ── Top bar ── */}
            <header className="flex-none h-16 bg-white border-b border-slate-100 shadow-xs flex items-center px-4 sm:px-6 z-30 sticky top-0">
                <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        {/* Hamburger (móvil) — funcionalidad en DashboardSidebar */}
                        <div id="sidebar-toggle-placeholder" />

                        {/* Logotipo AND */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className="text-sm font-bold text-indigo-700 hidden sm:block" style={{ letterSpacing: '-0.01em' }}>
                                Asistente Normativo Docente
                            </span>
                            <span className="text-sm font-bold text-indigo-700 sm:hidden">AND</span>
                        </div>
                    </div>

                    {/* Usuario + Sign out */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 hidden md:block truncate max-w-[180px]">
                            {nombreCompleto}
                        </span>
                        {/* Avatar */}
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" aria-hidden="true">
                            {initials}
                        </div>
                        <form action={handleSignOut}>
                            <button
                                type="submit"
                                className="text-xs text-slate-400 hover:text-slate-700 transition-colors duration-150 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100"
                                aria-label="Cerrar sesión"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:block">Salir</span>
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* ── Body: sidebar + main ── */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (componente cliente con active state) */}
                <DashboardSidebar name={nombreCompleto} />

                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 min-h-0">
                    {children}
                </main>
            </div>

            {/* Chat Widget flotante */}
            <ChatWidget />
        </div>
    )
}
