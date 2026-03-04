import { pdf } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/client'
import { ProgramacionPDF, type ProgramacionPDFData } from '@/components/pdf/ProgramacionPDF'
import { UnidadPDF, type UnidadPDFData } from '@/components/pdf/UnidadPDF'
import { SesionPDF, type SesionPDFData } from '@/components/pdf/SesionPDF'
import { PlanificadorPDF } from '@/components/pdf/PlanificadorPDF'
import type { PlanificadorRow, PlanificadorMeta } from '@/lib/services/PlanificadorService'
import React from 'react'

class PdfService {
    private supabase = createClient()

    // ============================================================
    // Download helpers
    // ============================================================

    private triggerDownload(blob: Blob, filename: string) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    private sanitizeFilename(name: string): string {
        return name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9\s-_]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 60)
    }

    // ============================================================
    // Programacion PDF
    // ============================================================

    async downloadProgramacionPDF(id: string): Promise<void> {
        const supabase = this.supabase
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        // Fetch all data
        const { data: prog, error } = await supabase
            .from('programaciones')
            .select(`
        *,
        areas (id, nombre),
        grados (id, nombre, nivel, ciclo),
        detalles_programacion (
          id,
          competencias (id, codigo, nombre, descripcion)
        )
      `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error || !prog) throw new Error('Programación no encontrada')

        const { data: unidades } = await supabase
            .from('unidades')
            .select('titulo, duracion_semanas, orden')
            .eq('programacion_id', id)
            .order('orden', { ascending: true })

        const { data: profile } = await supabase
            .from('users')
            .select('nombre_completo')
            .eq('id', user.id)
            .single()

        const data: ProgramacionPDFData = {
            titulo: prog.titulo,
            curso: prog.curso_nombre || undefined,
            area: (prog as any).areas?.nombre || '—',
            grado: (prog as any).grados?.nombre || '—',
            nivel: (prog as any).grados?.nivel || '—',
            ciclo: (prog as any).grados?.ciclo ? `Ciclo ${(prog as any).grados.ciclo}` : '—',
            periodo: prog.periodo_tipo || '—',
            anio: prog.anio_escolar?.toString() || new Date().getFullYear().toString(),
            validation_status: prog.validation_status,
            competencias: ((prog as any).detalles_programacion || []).map((d: any) => ({
                codigo: d.competencias?.codigo || '—',
                nombre: d.competencias?.nombre || '—',
                descripcion: d.competencias?.descripcion,
            })),
            unidades: (unidades || []).map((u: any) => ({
                titulo: u.titulo,
                duracion_semanas: u.duracion_semanas || 0,
                orden: u.orden || 1,
            })),
            docente: profile?.nombre_completo || user.email || '—',
            institucion: prog.institucion || undefined,
            logo_url: prog.logo_url || undefined,
        }

        const blob = await pdf(React.createElement(ProgramacionPDF, { data }) as any).toBlob()
        const filename = `Programacion_${this.sanitizeFilename(data.titulo)}.pdf`
        this.triggerDownload(blob, filename)
    }

    // ============================================================
    // Unidad PDF
    // ============================================================

    async downloadUnidadPDF(id: string): Promise<void> {
        const supabase = this.supabase
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data: unidad, error } = await supabase
            .from('unidades')
            .select(`
        *,
        programaciones (
          titulo,
          curso_nombre,
          institucion,
          logo_url,
          periodo_tipo,
          areas (nombre),
          grados (nombre, ciclo)
        )
      `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error || !unidad) throw new Error('Unidad no encontrada')

        // Fetch desempeños
        const { data: detalles } = await supabase
            .from('detalles_unidad')
            .select(`
        desempenos (
          descripcion,
          competencias (nombre)
        )
      `)
            .eq('unidad_id', id)

        // Fetch sesiones
        const { data: sesiones } = await supabase
            .from('sesiones')
            .select('titulo, duracion_minutos, fecha_tentativa, proposito_aprendizaje, evidencias_aprendizaje')
            .eq('unidad_id', id)
            .order('orden', { ascending: true })

        const { data: profile } = await supabase
            .from('users')
            .select('nombre_completo')
            .eq('id', user.id)
            .single()

        const data: UnidadPDFData = {
            titulo: unidad.titulo,
            proposito: (unidad as any).proposito_aprendizaje,
            situacion_significativa: unidad.situacion_significativa,
            duracion_semanas: unidad.duracion_semanas || 0,
            programacion_titulo: (unidad as any).programaciones?.titulo || '—',
            curso: (unidad as any).programaciones?.curso_nombre || undefined,
            area: (unidad as any).programaciones?.areas?.nombre || '—',
            grado: (unidad as any).programaciones?.grados?.nombre || '—',
            ciclo: (unidad as any).programaciones?.grados?.ciclo || '—',
            periodo_tipo: (unidad as any).programaciones?.periodo_tipo || '—',
            validation_status: unidad.validation_status,
            matriz_ia: unidad.matriz_ia as any,
            evaluacion_ia: (unidad as any).evaluacion_ia || null,
            enfoques_transversales: unidad.enfoques_transversales as any,
            desempenos: (detalles || []).map((d: any) => ({
                descripcion: d.desempenos?.descripcion || '—',
                competencia_nombre: d.desempenos?.competencias?.nombre || '—',
            })),
            sesiones: (sesiones || []).map((s: any) => ({
                titulo: s.titulo,
                duracion_minutos: s.duracion_minutos || 0,
                fecha: s.fecha_tentativa,
                proposito: s.proposito_aprendizaje,
                evidencias: s.evidencias_aprendizaje,
            })),
            docente: profile?.nombre_completo || user.email || '—',
            institucion: (unidad as any).programaciones?.institucion || undefined,
            logo_url: (unidad as any).programaciones?.logo_url || undefined,
            fecha_inicio: (unidad as any).fecha_inicio || undefined,
            fecha_fin: (unidad as any).fecha_fin || undefined,
        }

        const blob = await pdf(React.createElement(UnidadPDF, { data }) as any).toBlob()
        const filename = `Unidad_${this.sanitizeFilename(data.titulo)}.pdf`
        this.triggerDownload(blob, filename)
    }

    // ============================================================
    // Sesion PDF
    // ============================================================

    async downloadSesionPDF(id: string): Promise<void> {
        const supabase = this.supabase
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data: sesion, error } = await supabase
            .from('sesiones')
            .select(`
        *,
        unidades (
          titulo,
          programaciones (
            curso_nombre,
            institucion,
            logo_url,
            areas (nombre),
            grados (nombre)
          )
        )
      `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error || !sesion) throw new Error('Sesión no encontrada')

        // Fetch desempeños
        const { data: detalles } = await supabase
            .from('detalles_sesion')
            .select(`
        desempenos (
          descripcion,
          competencias (nombre)
        )
      `)
            .eq('sesion_id', id)

        // Fetch secuencias
        const { data: secuencias } = await supabase
            .from('secuencias_sesion')
            .select('momento, actividad, tiempo_minutos, recursos, orden')
            .eq('sesion_id', id)
            .order('orden', { ascending: true })

        const { data: profile } = await supabase
            .from('users')
            .select('nombre_completo')
            .eq('id', user.id)
            .single()

        const data: SesionPDFData = {
            titulo: sesion.titulo,
            fecha: sesion.fecha_tentativa,
            duracion_minutos: sesion.duracion_minutos || 0,
            unidad_titulo: (sesion as any).unidades?.titulo || '—',
            curso: (sesion as any).unidades?.programaciones?.curso_nombre || undefined,
            area: (sesion as any).unidades?.programaciones?.areas?.nombre || '—',
            grado: (sesion as any).unidades?.programaciones?.grados?.nombre || '—',
            validation_status: sesion.validation_status,
            desempenos: (detalles || []).map((d: any) => ({
                descripcion: d.desempenos?.descripcion || '—',
                competencia_nombre: d.desempenos?.competencias?.nombre || '—',
            })),
            secuencias: (secuencias || []).map((s: any) => ({
                momento: s.momento,
                actividad: s.actividad,
                tiempo_minutos: s.tiempo_minutos || 0,
                recursos: s.recursos,
                orden: s.orden || 0,
            })),
            docente: profile?.nombre_completo || user.email || '—',
            institucion: (sesion as any).unidades?.programaciones?.institucion || undefined,
            logo_url: (sesion as any).unidades?.programaciones?.logo_url || undefined,
            contenido_ia: sesion.contenido_ia,
        }

        const blob = await pdf(React.createElement(SesionPDF, { data }) as any).toBlob()
        const filename = `Sesion_${this.sanitizeFilename(data.titulo)}.pdf`
        this.triggerDownload(blob, filename)
    }

    // ============================================================
    // Planificador Mensual PDF
    // ============================================================

    async downloadPlanificadorPDF(rows: PlanificadorRow[], meta: PlanificadorMeta): Promise<void> {
        const supabase = this.supabase
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        // Fetch logo_url from the most recent programacion of the institution
        const { data: prog } = await supabase
            .from('programaciones')
            .select('logo_url')
            .eq('user_id', user.id)
            .eq('institucion', meta.institucion)
            .not('logo_url', 'is', null)
            .limit(1)
            .maybeSingle()

        const MONTH_NAMES = [
            '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
        ]

        const pdfData = {
            rows,
            meta,
            logo_url: (prog as any)?.logo_url || undefined,
        }

        const blob = await pdf(React.createElement(PlanificadorPDF, { data: pdfData }) as any).toBlob()
        const mesName = MONTH_NAMES[meta.mes] || String(meta.mes)
        const filename = `Planificador_${mesName}_${meta.anio}_${this.sanitizeFilename(meta.institucion)}.pdf`
        this.triggerDownload(blob, filename)
    }
}


export const pdfService = new PdfService()
