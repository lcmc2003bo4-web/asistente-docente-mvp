export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// -------------------------------------------------------
// Tipos de contextualización institucional
// -------------------------------------------------------
export type TipoGestion = 'Pública' | 'Privada' | 'Parroquial' | 'Fe y Alegría' | 'Otro';
export type ZonaGeografica = 'Urbana' | 'Rural' | 'Urbano-marginal';
export type NivelSocioeconomico = 'Bajo' | 'Medio-bajo' | 'Medio' | 'Medio-alto' | 'Alto';

/** Campos extendidos de contextualización añadidos a la tabla `instituciones` */
export interface ContextoInstitucionalFields {
    tipo_gestion: TipoGestion | null;
    zona: ZonaGeografica | null;
    region: string | null;
    distrito: string | null;
    mision: string | null;
    vision: string | null;
    valores: string[] | null;
    enfoque_religioso: string | null;
    contexto_socioeconomico: NivelSocioeconomico | null;
    actividades_economicas: string[] | null;
    identidad_cultural: string | null;
    problematicas_locales: string[] | null;
    festividades_regionales: string[] | null;
    proyectos_comunitarios: string[] | null;
    perfil_completado: boolean;
}

/** Payload de contexto que se envía en el body de generate-unidad-aprendizaje */
export interface ContextoInstitucionalPayload {
    nombre_institucion: string;
    tipo_gestion: TipoGestion;
    zona: ZonaGeografica;
    region: string;
    distrito: string;
    contexto_socioeconomico: NivelSocioeconomico;
    actividades_economicas: string[];
    identidad_cultural?: string | null;
    problematicas_locales: string[];
    festividades_regionales: string[];
    proyectos_comunitarios: string[];
    mision?: string | null;
    vision?: string | null;
    valores: string[];
    enfoque_religioso?: string | null;
}

export interface ContextoAulaPayload {
    seccion?: string | null;
    num_estudiantes?: number | null;
    intereses_comunes: string[];
    retos_educativos: string[];
    nivel_socioeconomico?: NivelSocioeconomico | null;
    caracteristicas_adicionales?: string | null;
}

export interface UserPreferencias {
    duracion_sesion?: number        // Default: 90 min
    nivel?: 'Inicial' | 'Primaria' | 'Secundaria'
    periodo_tipo?: 'Bimestral' | 'Trimestral'
    anio_escolar?: number
    zona_horaria?: string
}

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    nombre_completo: string
                    especialidad: string | null
                    nivel: 'Inicial' | 'Primaria' | 'Secundaria' | null
                    institucion: string | null
                    logo_url: string | null
                    avatar_url: string | null
                    preferencias: UserPreferencias | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    nombre_completo: string
                    especialidad?: string | null
                    nivel?: 'Inicial' | 'Primaria' | 'Secundaria' | null
                    institucion?: string | null
                    logo_url?: string | null
                    avatar_url?: string | null
                    preferencias?: UserPreferencias | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nombre_completo?: string
                    especialidad?: string | null
                    nivel?: 'Inicial' | 'Primaria' | 'Secundaria' | null
                    institucion?: string | null
                    logo_url?: string | null
                    avatar_url?: string | null
                    preferencias?: UserPreferencias | null
                    created_at?: string
                    updated_at?: string
                }
            }
            instituciones: {
                Row: {
                    id: string
                    user_id: string
                    nombre: string
                    codigo_modular: string | null
                    direccion: string | null
                    ugel: string | null
                    logo_url: string | null
                    es_predeterminada: boolean
                    created_at: string
                    updated_at: string
                } & ContextoInstitucionalFields
                Insert: {
                    id?: string
                    user_id: string
                    nombre: string
                    codigo_modular?: string | null
                    direccion?: string | null
                    ugel?: string | null
                    logo_url?: string | null
                    es_predeterminada?: boolean
                    created_at?: string
                    updated_at?: string
                    tipo_gestion?: TipoGestion | null
                    zona?: ZonaGeografica | null
                    region?: string | null
                    distrito?: string | null
                    mision?: string | null
                    vision?: string | null
                    valores?: string[] | null
                    enfoque_religioso?: string | null
                    contexto_socioeconomico?: NivelSocioeconomico | null
                    actividades_economicas?: string[] | null
                    identidad_cultural?: string | null
                    problematicas_locales?: string[] | null
                    festividades_regionales?: string[] | null
                    proyectos_comunitarios?: string[] | null
                    perfil_completado?: boolean
                }
                Update: {
                    id?: string
                    user_id?: string
                    nombre?: string
                    codigo_modular?: string | null
                    direccion?: string | null
                    ugel?: string | null
                    logo_url?: string | null
                    es_predeterminada?: boolean
                    created_at?: string
                    updated_at?: string
                    tipo_gestion?: TipoGestion | null
                    zona?: ZonaGeografica | null
                    region?: string | null
                    distrito?: string | null
                    mision?: string | null
                    vision?: string | null
                    valores?: string[] | null
                    enfoque_religioso?: string | null
                    contexto_socioeconomico?: NivelSocioeconomico | null
                    actividades_economicas?: string[] | null
                    identidad_cultural?: string | null
                    problematicas_locales?: string[] | null
                    festividades_regionales?: string[] | null
                    proyectos_comunitarios?: string[] | null
                    perfil_completado?: boolean
                }
            }
            contexto_aula: {
                Row: {
                    id: string
                    user_id: string
                    institucion_id: string
                    anio_escolar: number
                    grado_id: string | null
                    seccion: string | null
                    num_estudiantes: number | null
                    intereses_comunes: string[] | null
                    retos_educativos: string[] | null
                    nivel_socioeconomico: NivelSocioeconomico | null
                    caracteristicas_adicionales: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    institucion_id: string
                    anio_escolar: number
                    grado_id?: string | null
                    seccion?: string | null
                    num_estudiantes?: number | null
                    intereses_comunes?: string[] | null
                    retos_educativos?: string[] | null
                    nivel_socioeconomico?: NivelSocioeconomico | null
                    caracteristicas_adicionales?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    institucion_id?: string
                    anio_escolar?: number
                    grado_id?: string | null
                    seccion?: string | null
                    num_estudiantes?: number | null
                    intereses_comunes?: string[] | null
                    retos_educativos?: string[] | null
                    nivel_socioeconomico?: NivelSocioeconomico | null
                    caracteristicas_adicionales?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }

            grados: {
                Row: {
                    id: string
                    nombre: string
                    nivel: 'Primaria' | 'Secundaria'
                    ciclo: string
                    created_at: string
                }
            }
            areas: {
                Row: {
                    id: string
                    nombre: string
                    descripcion: string | null
                    created_at: string
                }
            }
            competencias: {
                Row: {
                    id: string
                    area_id: string
                    codigo: string
                    nombre: string
                    descripcion: string | null
                    created_at: string
                }
            }
            programaciones: {
                Row: {
                    id: string
                    user_id: string
                    titulo: string
                    curso_nombre: string | null
                    area_id: string
                    grado_id: string
                    anio_escolar: number
                    periodo_tipo: 'Bimestral' | 'Trimestral'
                    estado: 'Borrador' | 'Validado'
                    institucion: string | null
                    logo_url: string | null
                    secciones: string[] | null
                    institucion_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    titulo: string
                    curso_nombre?: string | null
                    area_id: string
                    grado_id: string
                    anio_escolar: number
                    periodo_tipo: 'Bimestral' | 'Trimestral'
                    estado?: 'Borrador' | 'Validado'
                    institucion?: string | null
                    logo_url?: string | null
                    secciones?: string[] | null
                    institucion_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    titulo?: string
                    curso_nombre?: string | null
                    area_id?: string
                    grado_id?: string
                    anio_escolar?: number
                    periodo_tipo?: 'Bimestral' | 'Trimestral'
                    estado?: 'Borrador' | 'Validado'
                    institucion?: string | null
                    logo_url?: string | null
                    secciones?: string[] | null
                    institucion_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            detalles_programacion: {
                Row: {
                    id: string
                    programacion_id: string
                    competencia_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    programacion_id: string
                    competencia_id: string
                    created_at?: string
                }
            }
            unidades: {
                Row: {
                    id: string
                    user_id: string
                    programacion_id: string
                    orden: number
                    titulo: string
                    duracion_semanas: number
                    situacion_significativa: string | null
                    estado: 'Borrador' | 'Validado'
                    tiene_contexto_institucional: boolean
                    matriz_ia: Json | null
                    enfoques_transversales: Json | null
                    evaluacion_ia: Json | null
                    aprendizajes_esperados: Json | null
                    criterios_evaluacion: Json | null
                    secuencia_sesiones_ia: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    programacion_id: string
                    orden: number
                    titulo: string
                    duracion_semanas: number
                    situacion_significativa?: string | null
                    estado?: 'Borrador' | 'Validado'
                    tiene_contexto_institucional?: boolean
                    matriz_ia?: Json | null
                    enfoques_transversales?: Json | null
                    evaluacion_ia?: Json | null
                    aprendizajes_esperados?: Json | null
                    criterios_evaluacion?: Json | null
                    secuencia_sesiones_ia?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    programacion_id?: string
                    orden?: number
                    titulo?: string
                    duracion_semanas?: number
                    situacion_significativa?: string | null
                    estado?: 'Borrador' | 'Validado'
                    tiene_contexto_institucional?: boolean
                    matriz_ia?: Json | null
                    enfoques_transversales?: Json | null
                    evaluacion_ia?: Json | null
                    aprendizajes_esperados?: Json | null
                    criterios_evaluacion?: Json | null
                    secuencia_sesiones_ia?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            detalles_unidad: {
                Row: {
                    id: string
                    unidad_id: string
                    desempeno_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    unidad_id: string
                    desempeno_id: string
                    created_at?: string
                }
            }
            desempenos: {
                Row: {
                    id: string
                    capacidad_id: string
                    grado_id: string
                    descripcion: string
                    created_at: string
                }
            }
            capacidades: {
                Row: {
                    id: string
                    competencia_id: string
                    descripcion: string
                    created_at: string
                }
            }
            sesiones: {
                Row: {
                    id: string
                    user_id: string
                    unidad_id: string
                    orden: number
                    titulo: string
                    fecha_tentativa: string | null
                    duracion_minutos: number
                    proposito_aprendizaje: string | null
                    evidencias_aprendizaje: string | null
                    criterios_evaluacion: string | null
                    estado: 'Borrador' | 'Validado'
                    validation_status: 'pending' | 'valid' | 'invalid'
                    validation_errors: Json
                    validated_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    unidad_id: string
                    orden: number
                    titulo: string
                    fecha_tentativa?: string | null
                    duracion_minutos?: number
                    proposito_aprendizaje?: string | null
                    evidencias_aprendizaje?: string | null
                    criterios_evaluacion?: string | null
                    estado?: 'Borrador' | 'Validado'
                    validation_status?: 'pending' | 'valid' | 'invalid'
                    validation_errors?: Json
                    validated_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    unidad_id?: string
                    orden?: number
                    titulo?: string
                    fecha_tentativa?: string | null
                    duracion_minutos?: number
                    proposito_aprendizaje?: string | null
                    evidencias_aprendizaje?: string | null
                    criterios_evaluacion?: string | null
                    estado?: 'Borrador' | 'Validado'
                    validation_status?: 'pending' | 'valid' | 'invalid'
                    validation_errors?: Json
                    validated_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            secuencias_sesion: {
                Row: {
                    id: string
                    sesion_id: string
                    orden: number
                    momento: 'Inicio' | 'Desarrollo' | 'Cierre'
                    actividad: string
                    tiempo_minutos: number
                    recursos: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    sesion_id: string
                    orden: number
                    momento: 'Inicio' | 'Desarrollo' | 'Cierre'
                    actividad: string
                    tiempo_minutos: number
                    recursos?: string | null
                    created_at?: string
                }
            }
            detalles_sesion: {
                Row: {
                    id: string
                    sesion_id: string
                    desempeno_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    sesion_id: string
                    desempeno_id: string
                    created_at?: string
                }
            }
            sesion_fechas_seccion: {
                Row: {
                    id: string
                    sesion_id: string
                    user_id: string
                    seccion: string
                    fecha: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    sesion_id: string
                    user_id: string
                    seccion: string
                    fecha: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    sesion_id?: string
                    user_id?: string
                    seccion?: string
                    fecha?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
