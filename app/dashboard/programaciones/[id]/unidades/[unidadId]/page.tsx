import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DeleteButton } from './DeleteButton'

export default async function UnidadDetailPage({
    params,
}: {
    params: Promise<{ id: string; unidadId: string }>
}) {
    const { id, unidadId } = await params
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Fetch unidad with all related data
    const { data: unidad } = await supabase
        .from('unidades')
        .select(`
      *,
      detalles_unidad (
        id,
        desempenos (
          id,
          descripcion,
          capacidades (
            id,
            descripcion,
            competencias (
              id,
              codigo,
              nombre
            )
          )
        )
      )
    `)
        .eq('id', unidadId)
        .eq('user_id', user!.id)
        .single()

    if (!unidad) {
        notFound()
    }

    // Count sesiones for this unidad
    const { count: sesionesCount } = await supabase
        .from('sesiones')
        .select('*', { count: 'exact', head: true })
        .eq('unidad_id', unidadId)

    // Group desempeños by competencia
    const desempenosPorCompetencia: Record<string, any> = {}

    unidad.detalles_unidad?.forEach((detalle: any) => {
        const desempeno = detalle.desempenos
        const competencia = desempeno.capacidades.competencias

        if (!desempenosPorCompetencia[competencia.id]) {
            desempenosPorCompetencia[competencia.id] = {
                competencia,
                desempenos: [],
            }
        }

        desempenosPorCompetencia[competencia.id].desempenos.push(desempeno)
    })

    const grupos = Object.values(desempenosPorCompetencia)

    return (
        <div className="max-w-5xl">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <Link
                        href={`/dashboard/programaciones/${id}/unidades`}
                        className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
                    >
                        ← Volver a Unidades
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">
                        {unidad.titulo}
                    </h1>
                    <p className="text-gray-600 mt-2">Unidad {unidad.orden}</p>
                </div>
                <div className="flex gap-3">
                    <span
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${unidad.estado === 'Validado' || unidad.estado === 'Finalizado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}
                    >
                        {unidad.estado}
                    </span>
                    <Link
                        href={`/dashboard/programaciones/${id}/unidades/${unidadId}/editar`}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100 transition"
                    >
                        ✏️ Editar
                    </Link>
                    <DeleteButton unidadId={unidadId} programacionId={id} />
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Duración</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {unidad.duracion_semanas} semanas
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Desempeños</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {unidad.detalles_unidad?.length || 0}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Sesiones</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {sesionesCount || 0}
                    </div>
                    <Link
                        href={`/dashboard/programaciones/${id}/unidades/${unidadId}/sesiones`}
                        className="inline-block mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                        📝 Ver Sesiones →
                    </Link>
                </div>
            </div>

            {/* Situación Significativa */}
            {unidad.situacion_significativa && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Situación Significativa
                    </h2>
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {unidad.situacion_significativa}
                    </p>
                </div>
            )}

            {/* Desempeños */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Desempeños Seleccionados
                </h2>

                {grupos.length > 0 ? (
                    <div className="space-y-6">
                        {grupos.map((grupo: any) => (
                            <div
                                key={grupo.competencia.id}
                                className="border border-gray-200 rounded-lg p-6"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-lg font-bold text-indigo-600">
                                        {grupo.competencia.codigo.split('-')[1] || '?'}
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">
                                            {grupo.competencia.codigo}
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {grupo.competencia.nombre}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-3 ml-16">
                                    {grupo.desempenos.map((desempeno: any) => (
                                        <div
                                            key={desempeno.id}
                                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <span className="text-indigo-600 mt-1">✓</span>
                                            <p className="text-sm text-gray-700">
                                                {desempeno.descripcion}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        No hay desempeños seleccionados
                    </p>
                )}
            </div>

            {/* Metadata */}
            <div className="mt-8 text-sm text-gray-500 text-center">
                Creado el{' '}
                {new Date(unidad.created_at).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </div>
        </div>
    )
}
