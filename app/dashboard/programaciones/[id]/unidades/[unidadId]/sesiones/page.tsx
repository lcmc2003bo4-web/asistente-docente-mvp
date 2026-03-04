import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function SesionesPage({
    params,
}: {
    params: Promise<{ id: string; unidadId: string }>
}) {
    const { id, unidadId } = await params
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Fetch unidad to verify ownership and get details
    const { data: unidad } = await supabase
        .from('unidades')
        .select('*, programaciones(titulo)')
        .eq('id', unidadId)
        .eq('user_id', user!.id)
        .single()

    if (!unidad) {
        notFound()
    }

    // Fetch sesiones with secuencias count
    const { data: sesiones } = await supabase
        .from('sesiones')
        .select(`
      *,
      secuencias_sesion (id)
    `)
        .eq('unidad_id', unidadId)
        .order('orden', { ascending: true })

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link
                        href={`/dashboard/programaciones/${id}/unidades/${unidadId}`}
                        className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
                    >
                        ← Volver a Unidad
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">
                        Sesiones de Aprendizaje
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {unidad.titulo} - {(unidad.programaciones as any)?.titulo}
                    </p>
                </div>
                <Link
                    href={`/dashboard/programaciones/${id}/unidades/${unidadId}/sesiones/nueva`}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
                >
                    <span>➕</span>
                    Nueva Sesión
                </Link>
            </div>

            {/* List of Sesiones */}
            {!sesiones || sesiones.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No tienes sesiones aún
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Crea tu primera sesión de aprendizaje para esta unidad didáctica
                    </p>
                    <Link
                        href={`/dashboard/programaciones/${id}/unidades/${unidadId}/sesiones/nueva`}
                        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Crear Primera Sesión
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sesiones.map((sesion) => (
                        <Link
                            key={sesion.id}
                            href={`/dashboard/programaciones/${id}/unidades/${unidadId}/sesiones/${sesion.id}`}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition group"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-xl font-bold text-indigo-600">
                                    {sesion.orden}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition line-clamp-2">
                                        {sesion.titulo}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span>⏱️</span>
                                    <span>{sesion.duracion_minutos} minutos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>📋</span>
                                    <span>
                                        {sesion.secuencias_sesion?.length || 0} secuencias
                                    </span>
                                </div>
                                {sesion.fecha_tentativa && (
                                    <div className="flex items-center gap-2">
                                        <span>📅</span>
                                        <span>
                                            {new Date(sesion.fecha_tentativa).toLocaleDateString('es-PE', {
                                                day: '2-digit',
                                                month: 'short',
                                            })}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${sesion.estado === 'Validado' || sesion.estado === 'Finalizado'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                    >
                                        {sesion.estado}
                                    </span>
                                </div>
                            </div>

                            {sesion.proposito_aprendizaje && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {sesion.proposito_aprendizaje}
                                    </p>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
