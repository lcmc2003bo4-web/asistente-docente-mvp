'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle, Edit2, Trash2, X, Save, GripVertical } from 'lucide-react'
import { unidadesInstitucionalesService, UnidadInstitucional, CreateUnidadInstitucionalInput, UpdateUnidadInstitucionalInput } from '@/lib/services/UnidadesInstitucionalesService'

interface Props {
  institucionId: string
}

export default function UnidadesInstitucionalesList({ institucionId }: Props) {
  const [unidades, setUnidades] = useState<UnidadInstitucional[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState<Partial<CreateUnidadInstitucionalInput>>({})

  useEffect(() => {
    loadUnidades()
  }, [institucionId])

  const loadUnidades = async () => {
    setLoading(true)
    const data = await unidadesInstitucionalesService.listAllByInstitucion(institucionId)
    setUnidades(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta unidad institucional? Esta acción no se puede deshacer.')) return
    try {
      await unidadesInstitucionalesService.delete(id)
      setUnidades(prev => prev.filter(u => u.id !== id))
    } catch (err: any) {
      alert(`Error al eliminar la unidad: ${err?.message || 'Error desconocido'}`)
    }
  }

  const handleEdit = (unidad: UnidadInstitucional) => {
    setFormData(unidad)
    setEditingId(unidad.id)
    setIsCreating(false)
  }

  const handleAddNew = () => {
    setFormData({
      institucion_id: institucionId,
      titulo: '',
      situacion_significativa: '',
      enfoques_transversales: [],
      actitudes: [],
      orden: unidades.length + 1,
      grado_id: null
    })
    setIsCreating(true)
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({})
    setFormError(null)
  }

  const handleSave = async () => {
    if (!formData.titulo?.trim()) {
      setFormError('El título es requerido.')
      return
    }

    setIsSaving(true)
    setFormError(null)
    try {
      if (isCreating) {
        const insertData = {
          ...formData, // institucion_id already included
        } as CreateUnidadInstitucionalInput
        const newUnidad = await unidadesInstitucionalesService.create(insertData)
        if (newUnidad) {
          setUnidades([...unidades, newUnidad])
          handleCancel()
        }
      } else if (editingId) {
        const updateData: UpdateUnidadInstitucionalInput = {
          titulo: formData.titulo,
          situacion_significativa: formData.situacion_significativa,
          enfoques_transversales: formData.enfoques_transversales,
          actitudes: formData.actitudes,
          orden: formData.orden,
          grado_id: formData.grado_id
        }
        const updated = await unidadesInstitucionalesService.update(editingId, updateData)
        if (updated) {
          setUnidades(unidades.map(u => u.id === editingId ? updated : u))
          handleCancel()
        }
      }
    } catch (err: any) {
      console.error(err)
      setFormError(err?.message || 'Error al guardar la unidad. Verifica tu conexión e intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  const inputCls = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors mb-2"
  const textareaCls = `${inputCls} resize-none mb-2 leading-relaxed min-h-[80px]`
  const labelCls = "block text-sm font-medium text-gray-700 mb-1"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Plan Anual Institucional</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Define las unidades y situaciones significativas que tu institución utilizará como base a lo largo del año académico. Los profesores de tu IE podrán usarlas al usar IA.
          </p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle size={16} />
            Agregar Unidad
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                {isCreating ? <PlusCircle size={18} /> : <Edit2 size={18} />}
              </span>
              {isCreating ? 'Nueva Unidad Institucional' : 'Editar Unidad Institucional'}
            </h4>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-900 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-3">
                <label className={labelCls}>Título de la Unidad</label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Ej: Unidad Institucional de Prueba: Retorno Feliz"
                  value={formData.titulo || ''}
                  onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                />
              </div>
              <div className="col-span-1">
                <label className={labelCls}>N° Orden (Bimestre/Unidad)</label>
                <input
                  type="number"
                  className={inputCls}
                  placeholder="1"
                  min={1}
                  value={formData.orden || ''}
                  onChange={e => setFormData({ ...formData, orden: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Situación Significativa Institucional</label>
              <textarea
                className={`${textareaCls} min-h-[120px]`}
                placeholder="Describe la situación retadora para esta unidad. Esto instruirá a la IA para centrarse en esta problemática..."
                value={formData.situacion_significativa || ''}
                onChange={e => setFormData({ ...formData, situacion_significativa: e.target.value })}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-gray-900">Enfoques Transversales y Valores</label>
                <button 
                  type="button" 
                  onClick={() => {
                      const newEnfs = [...(formData.enfoques_transversales || [])];
                      newEnfs.push({ enfoque: '', valor: '', actitudes: '' });
                      setFormData({ ...formData, enfoques_transversales: newEnfs });
                  }}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg"
                >
                  <PlusCircle size={14} /> Agregar Enfoque
                </button>
              </div>
              
              <div className="space-y-4">
                {(formData.enfoques_transversales || []).map((enfoque: any, i: number) => (
                  <div key={i} className="flex gap-3 items-start relative bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition-all hover:border-indigo-300">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input 
                            type="text" className={`${inputCls} mb-0`} placeholder="Enfoque Transversal (Ej: Bien común)" 
                            value={enfoque.enfoque || ''}
                            onChange={e => {
                              const newEnfs = [...(formData.enfoques_transversales || [])];
                              newEnfs[i].enfoque = e.target.value;
                              setFormData({ ...formData, enfoques_transversales: newEnfs });
                            }}
                          />
                        </div>
                        <div>
                          <input 
                            type="text" className={`${inputCls} mb-0`} placeholder="Valor (Ej: Empatía)" 
                            value={enfoque.valor || ''}
                            onChange={e => {
                              const newEnfs = [...(formData.enfoques_transversales || [])];
                              newEnfs[i].valor = e.target.value;
                              setFormData({ ...formData, enfoques_transversales: newEnfs });
                            }}
                          />
                        </div>
                      </div>
                      <textarea 
                        className={`${textareaCls} mb-0 max-h-[100px]`} placeholder="Actitudes o acciones observables del enfoque..." 
                        value={enfoque.actitudes || ''}
                        onChange={e => {
                          const newEnfs = [...(formData.enfoques_transversales || [])];
                          newEnfs[i].actitudes = e.target.value;
                          setFormData({ ...formData, enfoques_transversales: newEnfs });
                        }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                          const newEnfs = [...(formData.enfoques_transversales || [])];
                          newEnfs.splice(i, 1);
                          setFormData({ ...formData, enfoques_transversales: newEnfs });
                      }}
                      className="text-gray-400 hover:bg-red-50 hover:text-red-600 p-2 rounded-lg transition-colors" title="Remover enfoque">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {(formData.enfoques_transversales || []).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4 italic">No se han agregado enfoques transversales a esta unidad.</p>
                )}
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span>{formError}</span>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 text-sm font-semibold transition-colors shadow-sm"
              >
                {isSaving ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Guardando…</>
                ) : (
                  <><Save size={18} /> {isCreating ? 'Guardar y Publicar' : 'Guardar Cambios'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {!isCreating && !editingId && unidades.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <PlusCircle size={32} />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No hay unidades en el plan anual</h4>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Agrega las unidades, títulos y situaciones significativas que se utilizarán este año en la institución.
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <PlusCircle size={18} />
            Crear Primera Unidad
          </button>
        </div>
      )}

      {unidades.length > 0 && !isCreating && !editingId && (
        <div className="space-y-4">
          {unidades.map(unidad => (
            <div key={unidad.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors shadow-sm relative group overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-200 group-hover:bg-indigo-500 transition-colors"></div>
              
              <div className="flex justify-between items-start pl-3">
                <div className="pr-12">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-md">
                      Unidad {unidad.orden}
                    </span>
                    <h5 className="font-bold text-gray-900 text-lg">{unidad.titulo}</h5>
                  </div>
                  
                  <div className="mt-3 bg-gray-50 p-3 rounded-xl text-sm text-gray-700 line-clamp-2 border border-gray-100">
                    <span className="font-semibold text-gray-900 mr-1">Situación Significativa:</span>
                    {unidad.situacion_significativa}
                  </div>

                  {unidad.enfoques_transversales?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mr-1">Enfoques:</span>
                      {unidad.enfoques_transversales.map((e: any, i: number) => (
                        <div key={i} className="text-xs flex items-center bg-indigo-50 text-indigo-800 rounded-md overflow-hidden border border-indigo-100">
                          <span className="px-2 py-1 bg-indigo-100 font-semibold">{e.enfoque || ''}</span>
                          <span className="px-2 py-1">{e.valor || ''}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleEdit(unidad)} 
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-transparent hover:border-indigo-100"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(unidad.id)} 
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
