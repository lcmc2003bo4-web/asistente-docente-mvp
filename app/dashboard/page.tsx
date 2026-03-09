import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import RecentDocumentsList from '@/components/dashboard/RecentDocumentsList'
import EmptyState from '@/components/ui/EmptyState'
import ContextoInstitucionalBanner from '@/components/configuracion/ContextoInstitucionalBanner'

// ── Íconos SVG Lucide (inline, sin dependencia) ────────────────────
const CalendarIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const BookOpenIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const FileTextIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
)
const ShieldCheckIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
)
const PlusIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const CheckCircleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const ClockIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const XCircleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
)
const LightbulbIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1H9a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" />
    </svg>
)
const FolderOpenIcon = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>
)

export default async function DashboardPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Perfil del docente
    const { data: profile } = await supabase
        .from('users')
        .select('nombre_completo')
        .eq('id', user!.id)
        .single()

    const nombreDocente = profile?.nombre_completo
        ? profile.nombre_completo.split(' ')[0]
        : user?.email?.split('@')[0] || 'Docente'

    // Resumen desde la vista optimizada
    const { data: resumen } = await supabase
        .from('dashboard_resumen')
        .select('*')
        .eq('user_id', user!.id)
        .single()

    const stats = {
        programaciones: resumen?.total_programaciones ?? 0,
        unidades: resumen?.total_unidades ?? 0,
        sesiones: resumen?.total_sesiones ?? 0,
        sesionesValidas: resumen?.sesiones_validas ?? 0,
        sesionesInvalidas: resumen?.sesiones_invalidas ?? 0,
        sesionesPendientes: resumen?.sesiones_pendientes ?? 0,
    }

    const totalSesiones = Number(stats.sesiones)
    const pctValidas = totalSesiones > 0
        ? Math.round((Number(stats.sesionesValidas) / totalSesiones) * 100)
        : 0

    // Institución predeterminada — perfil de contextualización
    const { data: institucionPredeterminada } = await supabase
        .from('instituciones')
        .select('id, nombre, perfil_completado')
        .eq('user_id', user!.id)
        .eq('es_predeterminada', true)
        .maybeSingle()

    // Documentos recientes
    const { data: rawDocs } = await supabase
        .from('documentos_recientes')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false })
        .limit(8)

    const documentos = rawDocs?.map(doc => {
        const base = doc.type === 'programacion' ? 'programaciones' : doc.type === 'unidad' ? 'unidades' : 'sesiones'
        return {
            ...doc,
            tipo: doc.type,
            url_ver: `/dashboard/${base}/${doc.id}`,
            url_editar: `/dashboard/${base}/${doc.id}/editar`
        }
    })

    const hora = new Date().getHours()
    const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'

    // Semáforo: color de la barra según porcentaje
    const barColor = pctValidas >= 80 ? 'from-emerald-400 to-emerald-500'
        : pctValidas >= 50 ? 'from-amber-400 to-amber-500'
            : 'from-red-400 to-red-500'

    return (
        <div className="max-w-6xl mx-auto">

            {/* ── Header con saludo ── */}
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full ring-1 ring-inset ring-indigo-200 mb-3">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        Panel de control pedagógico
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                        {saludo}, Prof. {nombreDocente}
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm">
                        Bienvenido a tu panel de control normativo vigente
                    </p>
                </div>
                {/* CTA principal — desktop */}
                <Link
                    href="/dashboard/programaciones/nueva"
                    className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all duration-200 shadow-sm flex-shrink-0"
                >
                    <PlusIcon />
                    Nuevo Documento
                </Link>
            </div>

            {/* ── Banner de Contextualización (no bloqueante) ── */}
            {institucionPredeterminada && !institucionPredeterminada.perfil_completado && (
                <ContextoInstitucionalBanner
                    institucionNombre={institucionPredeterminada.nombre}
                    className="mb-5"
                />
            )}

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
                {/* Programaciones */}
                <Link
                    href="/dashboard/programaciones"
                    className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-100 transition-colors">
                            <CalendarIcon />
                        </div>
                        <span className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{Number(stats.programaciones)}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Programaciones Anuales</p>
                </Link>

                {/* Unidades */}
                <Link
                    href="/dashboard/unidades"
                    className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all duration-200"
                    style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-400 group-hover:bg-violet-100 transition-colors">
                            <BookOpenIcon />
                        </div>
                        <span className="text-xs text-violet-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{Number(stats.unidades)}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Unidades Didácticas</p>
                </Link>

                {/* Sesiones — con sub-info de validación */}
                <Link
                    href="/dashboard/sesiones"
                    className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                    style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-100 transition-colors">
                            <FileTextIcon />
                        </div>
                        <span className="text-xs text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{Number(stats.sesiones)}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Sesiones de Aprendizaje</p>
                    {Number(stats.sesiones) > 0 && (
                        <div className="mt-2.5 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${barColor} rounded-full`} style={{ width: `${pctValidas}%` }} />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400">{pctValidas}%</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* ── Semáforo de Validación (accesible, sin emojis) ── */}
            {totalSesiones > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Estado de Validación Normativa</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Cumplimiento del CNEB en tus sesiones</p>
                        </div>
                        <Link href="/dashboard/validacion" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                            Ver detalle →
                        </Link>
                    </div>

                    {/* Barra de progreso con color semántico */}
                    <div className="mb-5">
                        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span>Sesiones validadas</span>
                            <span className="font-semibold text-slate-700">{pctValidas}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700`}
                                style={{ width: `${pctValidas}%` }}
                                role="progressbar"
                                aria-valuenow={pctValidas}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${pctValidas}% de sesiones validadas`}
                            />
                        </div>
                    </div>

                    {/* Iconos SVG accesibles en lugar de 🟢🟡🔴 */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="text-emerald-500 flex-shrink-0"><CheckCircleIcon /></span>
                            <div>
                                <p className="text-2xl font-bold text-emerald-800 leading-none">{Number(stats.sesionesValidas)}</p>
                                <p className="text-xs text-emerald-700 font-medium mt-1">Válidas</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <span className="text-amber-500 flex-shrink-0"><ClockIcon /></span>
                            <div>
                                <p className="text-2xl font-bold text-amber-800 leading-none">{Number(stats.sesionesPendientes)}</p>
                                <p className="text-xs text-amber-700 font-medium mt-1">Pendientes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                            <span className="text-red-500 flex-shrink-0"><XCircleIcon /></span>
                            <div>
                                <p className="text-2xl font-bold text-red-800 leading-none">{Number(stats.sesionesInvalidas)}</p>
                                <p className="text-xs text-red-700 font-medium mt-1">Con errores</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Grid inferior: Documentos recientes (amplio) + Acciones rápidas (compacto) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">

                {/* Documentos recientes — sección principal */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold text-slate-900">Documentos Recientes</h2>
                        <Link href="/dashboard/sesiones" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                            Ver historial →
                        </Link>
                    </div>
                    {documentos && documentos.length > 0 ? (
                        <RecentDocumentsList documentos={documentos as any} />
                    ) : (
                        <EmptyState
                            title="Aún no tienes documentos"
                            description="Comienza creando tu primera Programación Anual"
                            icon={<FolderOpenIcon />}
                            action={{ label: 'Crear Programación', href: '/dashboard/programaciones/nueva' }}
                        />
                    )}
                </div>

                {/* Acciones rápidas — columna compacta */}
                <div className="space-y-3">
                    {/* Crear links */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Crear nuevo</p>
                        <div className="space-y-1.5">
                            {[
                                { href: '/dashboard/programaciones/nueva', label: 'Programación', icon: <CalendarIcon />, cls: 'text-blue-500 bg-blue-50' },
                                { href: '/dashboard/unidades/nueva', label: 'Unidad Didáctica', icon: <BookOpenIcon />, cls: 'text-violet-500 bg-violet-50' },
                                { href: '/dashboard/sesiones/nueva', label: 'Sesión', icon: <FileTextIcon />, cls: 'text-indigo-500 bg-indigo-50' },
                            ].map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                                >
                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.cls}`}>{item.icon}</span>
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Validar */}
                    <Link
                        href="/dashboard/validacion"
                        className="flex items-center gap-2.5 px-4 py-3.5 bg-white rounded-2xl border border-emerald-200 hover:border-emerald-400 hover:shadow-sm transition-all group"
                        style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                    >
                        <span className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 flex-shrink-0">
                            <ShieldCheckIcon />
                        </span>
                        <div>
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700">Validar Documentos</p>
                            <p className="text-[10px] text-slate-400">Revisión normativa CNEB</p>
                        </div>
                    </Link>

                    {/* Tip pedagógico */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-2.5">
                        <span className="text-amber-500 mt-0.5 flex-shrink-0"><LightbulbIcon /></span>
                        <div>
                            <p className="text-xs font-semibold text-amber-800 mb-0.5">Tip pedagógico</p>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                Cada sesión debe heredar desempeños de su unidad didáctica para cumplir con el CNEB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA móvil */}
            <div className="sm:hidden mt-6">
                <Link
                    href="/dashboard/programaciones/nueva"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm"
                >
                    <PlusIcon />
                    Nuevo Documento
                </Link>
            </div>
        </div>
    )
}
