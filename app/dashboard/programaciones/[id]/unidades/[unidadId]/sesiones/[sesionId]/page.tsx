import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DeleteButton } from './DeleteButton'
import ValidationBadge from '@/components/ValidationBadge'
import ValidationErrorsDisplay from '@/components/ValidationErrorsDisplay'
import { ValidationError } from '@/types/validation.types'

export default async function SesionDetailPage({
    params,
}: {
    params: Promise<{ id: string; unidadId: string; sesionId: string }>
}) {
    const { id, unidadId, sesionId } = await params
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Fetch sesion with all related data
    const { data: sesion } = await supabase
        .from('sesiones')
        .select(`
      *,
      detalles_sesion (
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
      ),
      secuencias_sesion (
        *
      )
    `)
        .eq('id', sesionId)
        .eq('user_id', user!.id)
        .single()

    if (!sesion) {
        notFound()
    }

    // Group desempeños by competencia
    const desempenosPorCompetencia: Record<string, any> = {}

    sesion.detalles_sesion?.forEach((detalle: any) => {
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

    // Group secuencias by momento
    const secuenciasPorMomento = {
        Inicio: sesion.secuencias_sesion?.filter((s: any) => s.momento === 'Inicio') || [],
        Desarrollo: sesion.secuencias_sesion?.filter((s: any) => s.momento === 'Desarrollo') || [],
        Cierre: sesion.secuencias_sesion?.filter((s: any) => s.momento === 'Cierre') || [],
    }

    const totalTiempo = sesion.secuencias_sesion?.reduce(
        (sum: number, sec: any) => sum + sec.tiempo_minutos,
        0
    ) || 0

    // Run validation
    const { data: validationResult } = await supabase
        .rpc('validate_sesion', { sesion_id_param: sesionId })

    const validationErrors: ValidationError[] = validationResult?.errors || []

    return (
        <div className="max-w-5xl">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <Link
                        href={`/dashboard/programaciones/${id}/unidades/${unidadId}/sesiones`}
                        className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
                    >
                        ← Volver a Sesiones
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">
                        {sesion.titulo}
                    </h1>
                    <p className="text-gray-600 mt-2">Sesión {sesion.orden}</p>
                </div>
                <div className="flex gap-3">
                    <span
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${sesion.estado === 'Validado' || sesion.estado === 'Finalizado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}
                    >
                        {sesion.estado}
                    </span>
                    <ValidationBadge
                        status={sesion.validation_status || 'pending'}
                        errorCount={validationErrors.filter(e => e.severity === 'error').length}
                    />
                    <Link
                        href={`/dashboard/programaciones/${id}/unidades/${unidadId}/sesiones/${sesionId}/editar`}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100 transition"
                    >
                        ✏️ Editar
                    </Link>
                    <DeleteButton sesionId={sesionId} programacionId={id} unidadId={unidadId} />
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Duración</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {sesion.duracion_minutos} min
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Usado: {totalTiempo} min
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Secuencias</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {sesion.secuencias_sesion?.length || 0}
                    </div>
                </div>
                {sesion.fecha_tentativa && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Fecha Tentativa</div>
                        <div className="text-lg font-bold text-gray-900">
                            {new Date(sesion.fecha_tentativa).toLocaleDateString('es-PE', {
                                day: '2-digit',
                                month: 'long',
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <div className="mb-8">
                    <ValidationErrorsDisplay errors={validationErrors} />
                </div>
            )}

            {/* Propósito y Evaluación */}
            {(sesion.proposito_aprendizaje || sesion.evidencias_aprendizaje || sesion.criterios_evaluacion) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Propósito y Evaluación
                    </h2>

                    {sesion.proposito_aprendizaje && (
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                Propósito de Aprendizaje
                            </h3>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {sesion.proposito_aprendizaje}
                            </p>
                        </div>
                    )}

                    {sesion.evidencias_aprendizaje && (
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                Evidencias de Aprendizaje
                            </h3>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {sesion.evidencias_aprendizaje}
                            </p>
                        </div>
                    )}

                    {sesion.criterios_evaluacion && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                Criterios de Evaluación
                            </h3>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {sesion.criterios_evaluacion}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Desempeños */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Desempeños Trabajados
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

            {/* Secuencia Didáctica */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Secuencia Didáctica
                </h2>

                <div className="space-y-8">
                    {(['Inicio', 'Desarrollo', 'Cierre'] as const).map((momento) => {
                        const secuencias = secuenciasPorMomento[momento]
                        if (secuencias.length === 0) return null

                        return (
                            <div key={momento}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                    {momento}
                                </h3>

                                <div className="space-y-4 ml-4">
                                    {secuencias.map((secuencia: any) => (
                                        <div
                                            key={secuencia.id}
                                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-gray-900">
                                                    Secuencia {secuencia.orden}
                                                </h4>
                                                <span className="text-sm text-gray-600">
                                                    ⏱️ {secuencia.tiempo_minutos} min
                                                </span>
                                            </div>

                                            <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                                                {secuencia.actividad}
                                            </p>

                                            {secuencia.recursos && (
                                                <div className="text-sm text-gray-600">
                                                    <strong>Recursos:</strong> {secuencia.recursos}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Metadata */}
            <div className="mt-8 text-sm text-gray-500 text-center">
                Creado el{' '}
                {new Date(sesion.created_at).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </div>
        </div>
    )
}
