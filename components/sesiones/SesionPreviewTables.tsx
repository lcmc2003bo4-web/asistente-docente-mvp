import React from 'react'
import type { SecuenciaResult } from '@/lib/services/AIService'

interface SesionPreviewTablesProps {
    data: SecuenciaResult
}

export default function SesionPreviewTables({ data }: SesionPreviewTablesProps) {
    if (!data) return null;

    const { aspectos_curriculares, secuencia_didactica, evaluacion } = data;

    return (
        <div className="space-y-8 bg-white p-6 rounded-xl border border-gray-200">
            {/* Tabla 1: Aspectos Curriculares */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-indigo-500 pb-2">
                    I. ASPECTOS CURRICULARES
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left font-semibold w-1/3">Capacidades</th>
                                <th className="border border-gray-300 p-2 text-left font-semibold w-1/3">Conocimientos</th>
                                <th className="border border-gray-300 p-2 text-left font-semibold w-1/3">Actitudes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-3 align-top">
                                    <ul className="list-disc pl-4 space-y-1">
                                        {aspectos_curriculares?.capacidades?.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="border border-gray-300 p-3 align-top">
                                    <ul className="list-disc pl-4 space-y-1">
                                        {aspectos_curriculares?.conocimientos?.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="border border-gray-300 p-3 align-top">
                                    <ul className="list-disc pl-4 space-y-1">
                                        {aspectos_curriculares?.actitudes?.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-md">
                    <h4 className="text-sm font-bold text-indigo-900 mb-2">Aprendizaje Esperado (Propósito)</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {aspectos_curriculares?.aprendizaje_esperado}
                    </p>
                </div>
            </div>

            {/* Tabla 2: Secuencia Didáctica */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-indigo-500 pb-2">
                    II. SECUENCIA DIDÁCTICA
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-center font-semibold w-[15%]">Fases</th>
                                <th className="border border-gray-300 p-2 text-center font-semibold w-[55%]">Estrategias / Actividades</th>
                                <th className="border border-gray-300 p-2 text-center font-semibold w-[15%]">Tiempo</th>
                                <th className="border border-gray-300 p-2 text-center font-semibold w-[15%]">Recursos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {secuencia_didactica?.map((fase, idx) => (
                                <tr key={idx}>
                                    <td className="border border-gray-300 p-3 align-top font-bold text-center bg-gray-50">
                                        {fase.fase}
                                    </td>
                                    <td className="border border-gray-300 p-3 align-top">
                                        <div className="space-y-4">
                                            {fase.actividades?.map((act, i) => (
                                                <div key={i}>
                                                    <span className="font-semibold text-gray-800">{act.titulo}:</span>{' '}
                                                    <span className="text-gray-700">{act.descripcion}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 p-3 align-top text-center text-gray-700">
                                        <div className="flex flex-col h-full justify-center space-y-2">
                                            {fase.actividades?.map((act, i) => (
                                                <div key={i} className="text-sm">{act.tiempo_sugerido}</div>
                                            ))}
                                            <div className="mt-2 font-bold border-t border-gray-200 pt-1">Total: {fase.tiempo_total} min</div>
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 p-3 align-top">
                                        <ul className="list-disc pl-4 space-y-1 text-gray-700">
                                            {fase.recursos?.map((r, i) => (
                                                <li key={i}>{r}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tabla 3: Evaluación */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-indigo-500 pb-2">
                    III. EVALUACIÓN DE LOS APRENDIZAJES
                </h3>

                {/* 3.1 Criterios de Evaluación de los Aprendizajes */}
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">3.1 Criterios de Evaluación de los Aprendizajes</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2 text-left font-semibold w-1/3">Criterio de Evaluación</th>
                                    <th className="border border-gray-300 p-2 text-left font-semibold w-1/3">Indicadores</th>
                                    <th className="border border-gray-300 p-2 text-left font-semibold w-1/3">Instrumentos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluacion?.aprendizajes?.map((ev, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-gray-300 p-3 align-top text-gray-800">{ev.criterio}</td>
                                        <td className="border border-gray-300 p-3 align-top">
                                            <ul className="list-disc pl-4 space-y-1 text-gray-700">
                                                {ev.indicadores?.map((ind, i) => <li key={i}>{ind}</li>)}
                                            </ul>
                                        </td>
                                        <td className="border border-gray-300 p-3 align-top text-gray-800">{ev.instrumento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3.2 Criterios de Actitud ante el Área */}
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">3.2 Criterios de Actitud ante el Área</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2 text-left font-semibold w-1/3">Criterio de Evaluación</th>
                                    <th className="border border-gray-300 p-2 text-left font-semibold w-1/3">Indicadores</th>
                                    <th className="border border-gray-300 p-2 text-left font-semibold w-1/3">Instrumentos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluacion?.actitudes?.map((ev, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-gray-300 p-3 align-top text-gray-800">{ev.criterio}</td>
                                        <td className="border border-gray-300 p-3 align-top">
                                            <ul className="list-disc pl-4 space-y-1 text-gray-700">
                                                {ev.indicadores?.map((ind, i) => <li key={i}>{ind}</li>)}
                                            </ul>
                                        </td>
                                        <td className="border border-gray-300 p-3 align-top text-gray-800">{ev.instrumento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3.3 Rúbrica de Evaluación */}
                {evaluacion?.rubrica && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">3.3 Rúbrica de Evaluación</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 text-sm">
                                <thead>
                                    <tr className="bg-indigo-50 text-indigo-900 border-b-2 border-indigo-200">
                                        <th className="border border-gray-300 p-2 text-left font-semibold w-1/5">Aspectos a Evaluar</th>
                                        <th className="border border-gray-300 p-2 text-center font-semibold w-1/5">Nivel de Inicio</th>
                                        <th className="border border-gray-300 p-2 text-center font-semibold w-1/5">Nivel en Proceso</th>
                                        <th className="border border-gray-300 p-2 text-center font-semibold w-1/5">Nivel Satisfactorio</th>
                                        <th className="border border-gray-300 p-2 text-center font-semibold w-1/5">Nivel Sobresaliente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluacion.rubrica.aspectos?.map((aspecto, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-3 align-top font-medium text-gray-800 bg-gray-50">
                                                {aspecto}
                                            </td>
                                            <td className="border border-gray-300 p-3 align-top text-gray-700">
                                                {evaluacion.rubrica?.niveles?.inicio?.[idx] || ""}
                                            </td>
                                            <td className="border border-gray-300 p-3 align-top text-gray-700">
                                                {evaluacion.rubrica?.niveles?.en_proceso?.[idx] || ""}
                                            </td>
                                            <td className="border border-gray-300 p-3 align-top text-gray-700">
                                                {evaluacion.rubrica?.niveles?.satisfactorio?.[idx] || ""}
                                            </td>
                                            <td className="border border-gray-300 p-3 align-top text-gray-700">
                                                {evaluacion.rubrica?.niveles?.sobresaliente?.[idx] || ""}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabla 4: Lista de Cotejo, Bibliografía y Firmas */}
            <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">3.4 Lista de Cotejo</h4>
                <div className="overflow-x-auto mb-8">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-indigo-50 text-indigo-900 border-b-2 border-indigo-200">
                                <th className="border border-gray-300 p-2 text-center font-semibold w-[8%]">N°</th>
                                <th className="border border-gray-300 p-2 text-left font-semibold w-[42%]">Apellidos y Nombres</th>
                                <th className="border border-gray-300 p-2 text-center font-semibold w-[25%]">Criterio 1</th>
                                <th className="border border-gray-300 p-2 text-center font-semibold w-[25%]">Criterio 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 15 }).map((_, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-2 align-top text-center text-gray-700">{idx + 1}</td>
                                    <td className="border border-gray-300 p-2 align-top text-gray-700 min-h-[2rem]"></td>
                                    <td className="border border-gray-300 p-2 align-top text-gray-700"></td>
                                    <td className="border border-gray-300 p-2 align-top text-gray-700"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-indigo-500 pb-2 mt-6">
                    IV. BIBLIOGRAFÍA Y RECURSOS
                </h3>
                <div className="mb-12">
                    <p className="font-semibold text-gray-800 mb-4">Repositorio y videos sugeridos para apoyo docente / estudiante:</p>

                    <div className="space-y-4 text-gray-700">
                        {data.bibliografia && data.bibliografia.length > 0 ? (
                            data.bibliografia.map((bib: any, idx: number) => (
                                <div key={idx} className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <div className="flex items-start gap-2">
                                        <span className="text-indigo-600 mt-0.5">▶</span>
                                        <div className="flex-1">
                                            <span className="font-semibold text-indigo-900 block">{bib.titulo_video}</span>
                                            {bib.descripcion && <span className="text-sm text-gray-600 block mt-1">{bib.descripcion}</span>}
                                            <a
                                                href={bib.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium inline-block mt-2 break-all"
                                            >
                                                {bib.url}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Fallback para sesiones antiguas sin bibliografía generada
                            <>
                                <div>
                                    <div className="flex items-start gap-2">
                                        <span>•</span>
                                        <span className="font-medium">Video Educativo referencial sobre el tema principal:</span>
                                    </div>
                                    <a
                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent('tema de la sesión')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="ml-4 text-indigo-600 hover:text-indigo-800 underline block mt-1"
                                    >
                                        Ver videos sugeridos en YouTube
                                    </a>
                                </div>

                                <div>
                                    <div className="flex items-start gap-2">
                                        <span>•</span>
                                        <span className="font-medium">Dinámicas y estrategias para el nivel / área:</span>
                                    </div>
                                    <a
                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent('estrategias didacticas')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="ml-4 text-indigo-600 hover:text-indigo-800 underline block mt-1"
                                    >
                                        Ver estrategias en YouTube
                                    </a>
                                </div>

                                <div>
                                    <div className="flex items-start gap-2">
                                        <span>•</span>
                                        <span className="font-medium">Material audiovisual de profundización sobre el propósito:</span>
                                    </div>
                                    <a
                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(aspectos_curriculares?.aprendizaje_esperado?.substring(0, 50) || '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="ml-4 text-indigo-600 hover:text-indigo-800 underline block mt-1"
                                    >
                                        Ver material de profundización en YouTube
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Firmas */}
                <div className="flex justify-around items-end pt-8 pb-4 px-8 mt-12 border-t border-gray-100">
                    <div className="w-[40%] flex flex-col items-center">
                        <div className="w-full border-t border-gray-800 pt-2 text-center">
                            <p className="font-bold text-gray-900 text-sm">Firma del Docente</p>
                        </div>
                    </div>
                    <div className="w-[40%] flex flex-col items-center">
                        <div className="w-full border-t border-gray-800 pt-2 text-center">
                            <p className="font-bold text-gray-900 text-sm">Firma del Personal Directivo</p>
                            <p className="text-gray-600 text-xs mt-1">V°B° Dirección / Subdirección</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
