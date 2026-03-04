import React from 'react'
import type { SecuenciaResult } from '@/lib/services/AIService'

interface EditableSesionTablesProps {
    data: SecuenciaResult
    onChange: (newData: SecuenciaResult) => void
}

const TextAreaAuto = ({ value, onChange, className = "" }: { value: string, onChange: (v: string) => void, className?: string }) => {
    return (
        <textarea
            className={`w-full bg-transparent border-none p-1 m-0 focus:ring-1 focus:ring-indigo-500 focus:bg-white rounded transition resize-none hover:bg-gray-50 overflow-hidden ${className}`}
            value={value || ""}
            onChange={(e) => {
                onChange(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
            }}
            // This ensures it sizes correctly initially.
            ref={(el) => {
                if (el) {
                    el.style.height = 'auto';
                    el.style.height = el.scrollHeight + 'px';
                }
            }}
            rows={1}
        />
    )
}

export default function EditableSesionTables({ data, onChange }: EditableSesionTablesProps) {
    if (!data) return null;

    const { aspectos_curriculares, secuencia_didactica, evaluacion } = data;

    // Helper to deeply clone data and apply updates
    const updateData = (newData: Partial<SecuenciaResult>) => {
        onChange({ ...data, ...newData });
    }

    // Handlers for Aspectos Curriculares
    const updateAspectosItem = (field: keyof typeof aspectos_curriculares, index: number, value: string) => {
        if (!aspectos_curriculares) return;
        const arr = [...(aspectos_curriculares[field] as string[] || [])];
        arr[index] = value;
        updateData({ aspectos_curriculares: { ...aspectos_curriculares, [field]: arr } });
    }

    const updateAprendizajeEsperado = (value: string) => {
        if (!aspectos_curriculares) return;
        updateData({ aspectos_curriculares: { ...aspectos_curriculares, aprendizaje_esperado: value } });
    }

    // Handlers for Secuencia Didáctica
    const updateFaseField = (faseIdx: number, field: string, value: string | number) => {
        if (!secuencia_didactica) return;
        const newSecuencia = [...secuencia_didactica];
        (newSecuencia[faseIdx] as any)[field] = value;
        updateData({ secuencia_didactica: newSecuencia });
    }

    const updateActividadField = (faseIdx: number, actIdx: number, field: string, value: string) => {
        if (!secuencia_didactica) return;
        const newSecuencia = [...secuencia_didactica];
        const newActividades = [...newSecuencia[faseIdx].actividades];
        (newActividades[actIdx] as any)[field] = value;
        newSecuencia[faseIdx].actividades = newActividades;
        updateData({ secuencia_didactica: newSecuencia });
    }

    const updateFaseRecurso = (faseIdx: number, itemIdx: number, value: string) => {
        if (!secuencia_didactica) return;
        const newSecuencia = [...secuencia_didactica];
        const newRecursos = [...(newSecuencia[faseIdx].recursos || [])];
        newRecursos[itemIdx] = value;
        newSecuencia[faseIdx].recursos = newRecursos;
        updateData({ secuencia_didactica: newSecuencia });
    }

    // Handlers for Evaluacion
    const updateEvalCriterio = (type: 'aprendizajes' | 'actitudes', idx: number, field: string, value: string) => {
        if (!evaluacion) return;
        const newEvalArr = [...(evaluacion[type] || [])];
        (newEvalArr[idx] as any)[field] = value;
        updateData({ evaluacion: { ...evaluacion, [type]: newEvalArr } });
    }

    const updateEvalIndicador = (type: 'aprendizajes' | 'actitudes', critIdx: number, indIdx: number, value: string) => {
        if (!evaluacion) return;
        const newEvalArr = [...(evaluacion[type] || [])];
        const newIndicadores = [...newEvalArr[critIdx].indicadores];
        newIndicadores[indIdx] = value;
        newEvalArr[critIdx].indicadores = newIndicadores;
        updateData({ evaluacion: { ...evaluacion, [type]: newEvalArr } });
    }

    const updateRubrica = (field: string, idx: number, value: string) => {
        if (!evaluacion || !evaluacion.rubrica) return;

        const newRubrica = { ...evaluacion.rubrica };

        if (field === 'aspectos') {
            const newAspectos = [...newRubrica.aspectos];
            newAspectos[idx] = value;
            newRubrica.aspectos = newAspectos;
        } else {
            const newNiveles = { ...newRubrica.niveles };
            const levelArr = [...(newNiveles as any)[field]];
            levelArr[idx] = value;
            (newNiveles as any)[field] = levelArr;
            newRubrica.niveles = newNiveles;
        }

        updateData({ evaluacion: { ...evaluacion, rubrica: newRubrica } });
    }



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
                                <td className="border border-gray-300 p-2 align-top">
                                    <ul className="list-disc pl-4 space-y-1">
                                        {aspectos_curriculares?.capacidades?.map((c, i) => (
                                            <li key={i}>
                                                <TextAreaAuto value={c} onChange={(v) => updateAspectosItem('capacidades', i, v)} />
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="border border-gray-300 p-2 align-top">
                                    <ul className="list-disc pl-4 space-y-1">
                                        {aspectos_curriculares?.conocimientos?.map((c, i) => (
                                            <li key={i}>
                                                <TextAreaAuto value={c} onChange={(v) => updateAspectosItem('conocimientos', i, v)} />
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="border border-gray-300 p-2 align-top">
                                    <ul className="list-disc pl-4 space-y-1">
                                        {aspectos_curriculares?.actitudes?.map((c, i) => (
                                            <li key={i}>
                                                <TextAreaAuto value={c} onChange={(v) => updateAspectosItem('actitudes', i, v)} />
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-md">
                    <h4 className="text-sm font-bold text-indigo-900 mb-2">Aprendizaje Esperado (Propósito)</h4>
                    <TextAreaAuto
                        value={aspectos_curriculares?.aprendizaje_esperado || ''}
                        onChange={(v) => updateAprendizajeEsperado(v)}
                    />
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
                                    <td className="border border-gray-300 p-2 align-top font-bold text-center bg-gray-50">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-none text-center font-bold focus:ring-1 focus:ring-indigo-500 rounded p-1"
                                            value={fase.fase}
                                            onChange={(e) => updateFaseField(idx, 'fase', e.target.value)}
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2 align-top">
                                        <div className="space-y-4">
                                            {fase.actividades?.map((act, i) => (
                                                <div key={i} className="flex flex-col gap-1 p-1 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="text"
                                                        className="font-semibold text-gray-800 bg-transparent border-none p-1 focus:bg-white focus:ring-1 focus:ring-indigo-500 w-full rounded"
                                                        value={act.titulo}
                                                        onChange={(e) => updateActividadField(idx, i, 'titulo', e.target.value)}
                                                        placeholder="Título..."
                                                    />
                                                    <TextAreaAuto
                                                        value={act.descripcion}
                                                        onChange={(v) => updateActividadField(idx, i, 'descripcion', v)}
                                                        className="text-gray-700 whitespace-pre-wrap"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 p-2 align-top text-center text-gray-700">
                                        <div className="flex flex-col h-full justify-start space-y-4 pt-2">
                                            {fase.actividades?.map((act, i) => (
                                                <div key={i} className="text-sm">
                                                    <input
                                                        type="text"
                                                        className="w-full text-center bg-transparent border-none p-1 focus:bg-white focus:ring-1 focus:ring-indigo-500 rounded"
                                                        value={act.tiempo_sugerido}
                                                        onChange={(e) => updateActividadField(idx, i, 'tiempo_sugerido', e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                            <div className="mt-auto font-bold border-t border-gray-200 pt-2 flex items-center justify-center gap-1">
                                                Total:
                                                <input
                                                    type="number"
                                                    className="w-16 text-center bg-transparent border-none font-bold p-1 focus:bg-white focus:ring-1 focus:ring-indigo-500 rounded"
                                                    value={fase.tiempo_total}
                                                    onChange={(e) => updateFaseField(idx, 'tiempo_total', parseInt(e.target.value) || 0)}
                                                />
                                                min
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 p-2 align-top">
                                        <ul className="list-disc pl-4 space-y-1 text-gray-700">
                                            {fase.recursos?.map((r, i) => (
                                                <li key={i}>
                                                    <TextAreaAuto value={r} onChange={(v) => updateFaseRecurso(idx, i, v)} />
                                                </li>
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
                                        <td className="border border-gray-300 p-2 align-top text-gray-800">
                                            <TextAreaAuto value={ev.criterio} onChange={(v) => updateEvalCriterio('aprendizajes', idx, 'criterio', v)} />
                                        </td>
                                        <td className="border border-gray-300 p-2 align-top">
                                            <ul className="list-disc pl-4 space-y-1 text-gray-700">
                                                {ev.indicadores?.map((ind, i) => (
                                                    <li key={i}>
                                                        <TextAreaAuto value={ind} onChange={(v) => updateEvalIndicador('aprendizajes', idx, i, v)} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="border border-gray-300 p-2 align-top text-gray-800">
                                            <TextAreaAuto value={ev.instrumento} onChange={(v) => updateEvalCriterio('aprendizajes', idx, 'instrumento', v)} />
                                        </td>
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
                                        <td className="border border-gray-300 p-2 align-top text-gray-800">
                                            <TextAreaAuto value={ev.criterio} onChange={(v) => updateEvalCriterio('actitudes', idx, 'criterio', v)} />
                                        </td>
                                        <td className="border border-gray-300 p-2 align-top">
                                            <ul className="list-disc pl-4 space-y-1 text-gray-700">
                                                {ev.indicadores?.map((ind, i) => (
                                                    <li key={i}>
                                                        <TextAreaAuto value={ind} onChange={(v) => updateEvalIndicador('actitudes', idx, i, v)} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="border border-gray-300 p-2 align-top text-gray-800">
                                            <TextAreaAuto value={ev.instrumento} onChange={(v) => updateEvalCriterio('actitudes', idx, 'instrumento', v)} />
                                        </td>
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
                                            <td className="border border-gray-300 p-2 align-top font-medium text-gray-800 bg-gray-50">
                                                <TextAreaAuto value={aspecto} onChange={(v) => updateRubrica('aspectos', idx, v)} />
                                            </td>
                                            <td className="border border-gray-300 p-2 align-top text-gray-700">
                                                <TextAreaAuto value={evaluacion.rubrica?.niveles?.inicio?.[idx] || ""} onChange={(v) => updateRubrica('inicio', idx, v)} />
                                            </td>
                                            <td className="border border-gray-300 p-2 align-top text-gray-700">
                                                <TextAreaAuto value={evaluacion.rubrica?.niveles?.en_proceso?.[idx] || ""} onChange={(v) => updateRubrica('en_proceso', idx, v)} />
                                            </td>
                                            <td className="border border-gray-300 p-2 align-top text-gray-700">
                                                <TextAreaAuto value={evaluacion.rubrica?.niveles?.satisfactorio?.[idx] || ""} onChange={(v) => updateRubrica('satisfactorio', idx, v)} />
                                            </td>
                                            <td className="border border-gray-300 p-2 align-top text-gray-700">
                                                <TextAreaAuto value={evaluacion.rubrica?.niveles?.sobresaliente?.[idx] || ""} onChange={(v) => updateRubrica('sobresaliente', idx, v)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg flex items-center justify-between">
                <span className="text-indigo-800 font-medium">✏️ Modo de Edición Rápida Activado. Puedes hacer clic en cualquier texto para modificarlo.</span>
            </div>
        </div>
    )
}
