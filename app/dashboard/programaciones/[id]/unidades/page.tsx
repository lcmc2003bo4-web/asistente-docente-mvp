import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function UnidadesPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Fetch programacion to verify ownership and get details
    const { data: programacion } = await supabase
        .from('programaciones')
        .select('*, areas(nombre), grados(nombre)')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single()

    if (!programacion) {
        return <div>Programación no encontrada</div>
    }

    // Fetch unidades
    const { data: unidades } = await supabase
        .from('unidades')
        .select(`
      *,
      detalles_unidad (
        id,
        desempenos (id, descripcion)
      )
    `)
        .eq('programacion_id', id)
        .order('orden', { ascending: true })

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link
                        href={`/dashboard/programaciones/${id}`}
                        className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
                    >
                        ← Volver a Programación
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">
                        Unidades Didácticas
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {programacion.titulo} - {programacion.areas?.nombre}
                    </p>
                </div>
                <Link
                    href={`/dashboard/programaciones/${id}/unidades/nueva`}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
                >
                    <span>➕</span>
                    Nueva Unidad
                </Link>
            </div>

            {/* List of Unidades */}
            {!unidades || unidades.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No tienes unidades aún
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Crea tu primera unidad didáctica para esta programación
                    </p>
                    <Link
                        href={`/dashboard/programaciones/${id}/unidades/nueva`}
                        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Crear Primera Unidad
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unidades.map((unidad) => (
                        <Link
                            key={unidad.id}
                            href={`/dashboard/programaciones/${id}/unidades/${unidad.id}`}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition group"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-xl font-bold text-indigo-600">
                                    {unidad.orden}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition line-clamp-2">
                                        {unidad.titulo}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span>⏱️</span>
                                    <span>{unidad.duracion_semanas} semanas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>📋</span>
                                    <span>
                                        {unidad.detalles_unidad?.length || 0} desempeños
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${unidad.estado === 'Validado' || unidad.estado === 'Finalizado'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                    >
                                        {unidad.estado}
                                    </span>
                                </div>
                            </div>

                            {unidad.situacion_significativa && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {unidad.situacion_significativa}
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
