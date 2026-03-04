import {
    Document,
    Page,
    Text,
    Image,
    View,
    StyleSheet,
    Font,
    Link,
} from '@react-pdf/renderer'

Font.register({
    family: 'SymbolFont',
    fonts: [
        { src: '/fonts/DejaVuSans.ttf', fontWeight: 400 },
        { src: '/fonts/DejaVuSans-Bold.ttf', fontWeight: 700 },
    ],
})

const MOMENTO_COLORS: Record<string, string> = {
    Inicio: '#3B82F6',
    Desarrollo: '#8B5CF6',
    Cierre: '#F59E0B',
}

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        paddingTop: 40,
        paddingBottom: 50,
        paddingHorizontal: 40,
        backgroundColor: '#ffffff',
    },
    header: {
        borderBottom: '2px solid #7C3AED',
        paddingBottom: 12,
        marginBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    institutionName: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 700,
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    logo: {
        width: 36,
        height: 36,
        objectFit: 'contain',
        marginRight: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    docType: {
        fontSize: 9,
        color: '#7C3AED',
        fontFamily: 'Helvetica-Bold',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 15,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 700,
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 9,
        color: '#4B5563',
    },
    metaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    metaItem: {
        backgroundColor: '#F5F3FF',
        borderRadius: 4,
        padding: '4 8',
        minWidth: '22%',
    },
    metaLabel: {
        fontSize: 7,
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 9,
        color: '#111827',
        fontFamily: 'Helvetica-Bold',
        fontWeight: 700,
    },
    section: {
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 700,
        color: '#7C3AED',
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: 4,
        marginBottom: 8,
    },
    // Secuencia card
    secuenciaCard: {
        marginBottom: 8,
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
    },
    secuenciaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5 8',
    },
    secuenciaMomento: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 700,
        color: '#ffffff',
    },
    secuenciaTiempo: {
        fontSize: 8,
        color: '#ffffff',
    },
    secuenciaBody: {
        padding: '6 8',
        backgroundColor: '#FAFAFA',
    },
    secuenciaActividad: {
        fontSize: 9,
        color: '#374151',
        lineHeight: 1.4,
        marginBottom: 4,
    },
    secuenciaRecursos: {
        fontSize: 8,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    // Desempeños
    desempenoItem: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 5,
        padding: '4 6',
        backgroundColor: '#F5F3FF',
        borderRadius: 3,
        borderLeft: '3px solid #7C3AED',
    },
    desempenoText: {
        fontSize: 9,
        color: '#374151',
        flex: 1,
        lineHeight: 1.4,
    },
    validBadge: {
        backgroundColor: '#D1FAE5',
        color: '#065F46',
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 700,
        padding: '3 8',
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    invalidBadge: {
        backgroundColor: '#FEE2E2',
        color: '#991B1B',
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 700,
        padding: '3 8',
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    pendingBadge: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 700,
        padding: '3 8',
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTop: '1px solid #E5E7EB',
        paddingTop: 6,
    },
    footerText: {
        fontSize: 7,
        color: '#9CA3AF',
    },
    emptyText: {
        fontSize: 9,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    // AI Tables
    tableWrapper: {
        borderTop: '1px solid #D1D5DB',
        borderLeft: '1px solid #D1D5DB',
        marginBottom: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #D1D5DB',
    },
    tableHeaderRow: {
        backgroundColor: '#F3F4F6',
        flexDirection: 'row',
        borderBottom: '1px solid #D1D5DB',
    },
    tableCol: {
        borderRight: '1px solid #D1D5DB',
        fontFamily: 'Helvetica',
        lineHeight: 1.4,
    },
    // Estilo especial para celdas con posibles símbolos matemáticos
    tableCellMath: {
        padding: 4,
        fontSize: 7.5,
        fontFamily: 'SymbolFont',
        color: '#4B5563',
        lineHeight: 1.4,
    },
    tableCellHeader: {
        padding: 4,
        fontSize: 7.5,
        fontFamily: 'Helvetica-Bold',
        color: '#374151',
    },
    tableCell: {
        padding: 4,
        fontSize: 7.5,
        color: '#4B5563',
        lineHeight: 1.3,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    bullet: {
        width: 10,
        fontSize: 7.5,
        fontFamily: 'SymbolFont',
    },
    listItemText: {
        flex: 1,
        fontSize: 7.5,
        lineHeight: 1.3,
        fontFamily: 'SymbolFont',
    },
})

function ValidationBadge({ status }: { status: string | null | undefined }) {
    const s = status || 'pending'
    const style = s === 'valid' ? styles.validBadge : s === 'invalid' ? styles.invalidBadge : styles.pendingBadge
    const label = s === 'valid' ? '✓ Válida' : s === 'invalid' ? '✗ Con errores' : '⏳ Pendiente'
    return <Text style={style}>{label}</Text>
}

function MetaItem({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>{label}</Text>
            <Text style={styles.metaValue}>{value || '—'}</Text>
        </View>
    )
}

export interface SesionPDFData {
    titulo: string
    curso?: string
    fecha?: string
    duracion_minutos: number
    unidad_titulo: string
    area: string
    grado: string
    validation_status: string | null
    desempenos: Array<{ descripcion: string; competencia_nombre: string }>
    secuencias: Array<{
        momento: string
        actividad: string
        tiempo_minutos: number
        recursos?: string
        orden: number
    }>
    docente: string
    institucion?: string
    logo_url?: string
    contenido_ia?: any
}

export function SesionPDF({ data }: { data: SesionPDFData }) {
    const generatedAt = new Date().toLocaleDateString('es-PE', {
        day: '2-digit', month: 'long', year: 'numeric'
    })

    const momentos = ['Inicio', 'Desarrollo', 'Cierre']
    const secuenciasByMomento = momentos.map(m => ({
        momento: m,
        items: data.secuencias.filter(s => s.momento === m).sort((a, b) => a.orden - b.orden)
    }))

    const totalTiempo = data.secuencias.reduce((sum, s) => sum + s.tiempo_minutos, 0)

    return (
        <Document title={`Sesión de Aprendizaje — ${data.titulo}`} author="Asistente Normativo Docente">
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerRow}>
                            {data.logo_url && <Image src={data.logo_url} style={styles.logo} />}
                            <View>
                                <Text style={styles.institutionName}>{data.institucion || 'Institución Educativa'}</Text>
                                <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>Sesión de Aprendizaje</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.title}>{data.titulo}</Text>
                    <Text style={styles.subtitle}>{data.unidad_titulo}</Text>
                </View>

                {/* Metadata */}
                <View style={styles.metaGrid}>
                    <MetaItem label="Área Curricular" value={data.area} />
                    <MetaItem label="Curso" value={data.curso || '—'} />
                    <MetaItem label="Grado" value={data.grado} />
                    <MetaItem label="Duración" value={`${data.duracion_minutos} min`} />
                    <MetaItem label="Tiempo en Secuencias" value={`${totalTiempo} min`} />
                    {data.fecha && <MetaItem label="Fecha" value={new Date(data.fecha).toLocaleDateString('es-PE')} />}
                    <MetaItem label="Docente" value={data.docente} />
                </View>

                {/* Desempeños u Aspectos Curriculares (IA) */}
                {data.contenido_ia ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>I. ASPECTOS CURRICULARES</Text>
                        <View style={styles.tableWrapper}>
                            <View style={styles.tableHeaderRow}>
                                <View style={[styles.tableCol, { width: '33.33%' }]}><Text style={styles.tableCellHeader}>Capacidades</Text></View>
                                <View style={[styles.tableCol, { width: '33.33%' }]}><Text style={styles.tableCellHeader}>Conocimientos</Text></View>
                                <View style={[styles.tableCol, { width: '33.33%' }]}><Text style={styles.tableCellHeader}>Actitudes</Text></View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={[styles.tableCol, { width: '33.33%' }]}>
                                    <View style={styles.tableCellMath}>
                                        {data.contenido_ia.aspectos_curriculares?.capacidades?.map((c: string, idx: number) => (
                                            <View key={idx} style={styles.listItem}>
                                                <Text style={styles.bullet}>•</Text>
                                                <Text style={styles.listItemText}>{c}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                <View style={[styles.tableCol, { width: '33.33%' }]}>
                                    <View style={styles.tableCellMath}>
                                        {data.contenido_ia.aspectos_curriculares?.conocimientos?.map((c: string, idx: number) => (
                                            <View key={idx} style={styles.listItem}>
                                                <Text style={styles.bullet}>•</Text>
                                                <Text style={styles.listItemText}>{c}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                <View style={[styles.tableCol, { width: '33.33%' }]}>
                                    <View style={styles.tableCell}>
                                        {data.contenido_ia.aspectos_curriculares?.actitudes?.map((c: string, idx: number) => (
                                            <View key={idx} style={styles.listItem}>
                                                <Text style={styles.bullet}>•</Text>
                                                <Text style={styles.listItemText}>{c}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: 6, padding: 8, backgroundColor: '#F9FAFB', borderRadius: 4, borderLeft: '3px solid #6366F1' }}>
                            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1F2937', marginBottom: 4 }}>Aprendizaje Esperado (Propósito)</Text>
                            <Text style={{ fontSize: 9, color: '#4B5563', lineHeight: 1.5 }}>
                                {data.contenido_ia.aspectos_curriculares?.aprendizaje_esperado}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Desempeños de la Sesión ({data.desempenos.length})</Text>
                        {data.desempenos.length === 0 ? (
                            <Text style={styles.emptyText}>Sin desempeños seleccionados</Text>
                        ) : (
                            data.desempenos.map((d, i) => (
                                <View key={i} style={styles.desempenoItem}>
                                    <Text style={[styles.desempenoText, { flex: 0 }]}>•</Text>
                                    <Text style={styles.desempenoText}>
                                        <Text style={{ fontFamily: 'Helvetica-Bold', fontWeight: 700, color: '#7C3AED' }}>
                                            {d.competencia_nombre}:{' '}
                                        </Text>
                                        {d.descripcion}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>
                )}

                {/* Secuencia Didáctica */}
                {data.contenido_ia ? (
                    <View style={styles.section} break>
                        <Text style={styles.sectionTitle}>II. SECUENCIA DIDÁCTICA</Text>
                        <View style={styles.tableWrapper}>
                            <View style={styles.tableHeaderRow}>
                                <View style={[styles.tableCol, { width: '15%' }]}><Text style={[styles.tableCellHeader, { textAlign: 'center' }]}>Fases</Text></View>
                                <View style={[styles.tableCol, { width: '55%' }]}><Text style={[styles.tableCellHeader, { textAlign: 'center' }]}>Estrategias / Actividades</Text></View>
                                <View style={[styles.tableCol, { width: '15%' }]}><Text style={[styles.tableCellHeader, { textAlign: 'center' }]}>Tiempo</Text></View>
                                <View style={[styles.tableCol, { width: '15%' }]}><Text style={[styles.tableCellHeader, { textAlign: 'center' }]}>Recursos</Text></View>
                            </View>
                            {data.contenido_ia.secuencia_didactica?.map((fase: any, idx: number) => (
                                <View key={idx} style={styles.tableRow} wrap={false}>
                                    <View style={[styles.tableCol, { width: '15%', backgroundColor: '#F9FAFB', justifyContent: 'center' }]}>
                                        <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold', textAlign: 'center' }]}>{fase.fase}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '55%' }]}>
                                        <View style={styles.tableCellMath}>
                                            {fase.actividades?.map((act: any, i: number) => (
                                                <View key={i} style={{ marginBottom: 4 }}>
                                                    <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#1F2937' }}>{act.titulo}:</Text>
                                                    <Text style={{ fontSize: 8, color: '#4B5563', lineHeight: 1.4 }}>{act.descripcion}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                    <View style={[styles.tableCol, { width: '15%', justifyContent: 'center' }]}>
                                        <View style={{ padding: 4 }}>
                                            {fase.actividades?.map((act: any, i: number) => (
                                                <Text key={i} style={{ fontSize: 8, textAlign: 'center', marginBottom: 4, color: '#4B5563' }}>{act.tiempo_sugerido}</Text>
                                            ))}
                                            <Text style={{ fontSize: 8, textAlign: 'center', fontFamily: 'Helvetica-Bold', borderTop: '1px solid #E5E7EB', paddingTop: 2, marginTop: 2, color: '#374151' }}>Total: {fase.tiempo_total} min</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableCol, { width: '15%', justifyContent: 'center' }]}>
                                        <Text style={[styles.tableCell, { fontSize: 8, textAlign: 'center' }]}>{fase.recursos?.join(', ') || '—'}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Evaluacion si existe */}
                        {data.contenido_ia.evaluacion && (
                            <View style={[styles.section, { marginTop: 8 }]} break>
                                <Text style={styles.sectionTitle}>III. EVALUACIÓN DE LOS APRENDIZAJES</Text>

                                {/* 3.1 Criterios de Evaluación */}
                                {(data.contenido_ia.evaluacion.aprendizajes?.length > 0) && (
                                    <View style={{ marginBottom: 6 }}>
                                        <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: '#374151' }}>3.1 Criterios de Evaluación de los Aprendizajes</Text>
                                        <View style={styles.tableWrapper}>
                                            <View style={styles.tableHeaderRow}>
                                                <View style={[styles.tableCol, { width: '33.3%' }]}><Text style={styles.tableCellHeader}>Criterio de Evaluación</Text></View>
                                                <View style={[styles.tableCol, { width: '33.3%' }]}><Text style={styles.tableCellHeader}>Indicadores</Text></View>
                                                <View style={[styles.tableCol, { width: '33.3%' }]}><Text style={styles.tableCellHeader}>Instrumentos</Text></View>
                                            </View>
                                            {data.contenido_ia.evaluacion.aprendizajes?.map((e: any, idx: number) => (
                                                <View key={idx} style={styles.tableRow} wrap={false}>
                                                    <View style={[styles.tableCol, { width: '33.3%' }]}>
                                                        <Text style={styles.tableCell}>{e.criterio}</Text>
                                                    </View>
                                                    <View style={[styles.tableCol, { width: '33.3%' }]}>
                                                        <View style={styles.tableCellMath}>
                                                            {e.indicadores?.map((ind: string, i: number) => (
                                                                <View key={i} style={styles.listItem}>
                                                                    <Text style={styles.bullet}>•</Text>
                                                                    <Text style={styles.listItemText}>{ind}</Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>
                                                    <View style={[styles.tableCol, { width: '33.3%' }]}>
                                                        <Text style={styles.tableCell}>{e.instrumento}</Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* 3.2 Actitudes */}
                                {(data.contenido_ia.evaluacion.actitudes?.length > 0) && (
                                    <View style={{ marginBottom: 6 }}>
                                        <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: '#374151' }}>3.2 Criterios de Actitud ante el Área</Text>
                                        <View style={styles.tableWrapper}>
                                            <View style={styles.tableHeaderRow}>
                                                <View style={[styles.tableCol, { width: '33.3%' }]}><Text style={styles.tableCellHeader}>Criterio de Evaluación</Text></View>
                                                <View style={[styles.tableCol, { width: '33.3%' }]}><Text style={styles.tableCellHeader}>Indicadores</Text></View>
                                                <View style={[styles.tableCol, { width: '33.3%' }]}><Text style={styles.tableCellHeader}>Instrumentos</Text></View>
                                            </View>
                                            {data.contenido_ia.evaluacion.actitudes?.map((e: any, idx: number) => (
                                                <View key={idx} style={styles.tableRow} wrap={false}>
                                                    <View style={[styles.tableCol, { width: '33.3%' }]}>
                                                        <Text style={styles.tableCell}>{e.criterio}</Text>
                                                    </View>
                                                    <View style={[styles.tableCol, { width: '33.3%' }]}>
                                                        <View style={styles.tableCellMath}>
                                                            {e.indicadores?.map((ind: string, i: number) => (
                                                                <View key={i} style={styles.listItem}>
                                                                    <Text style={styles.bullet}>•</Text>
                                                                    <Text style={styles.listItemText}>{ind}</Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>
                                                    <View style={[styles.tableCol, { width: '33.3%' }]}>
                                                        <Text style={styles.tableCell}>{e.instrumento}</Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* 3.3 Rúbrica */}
                                {data.contenido_ia.evaluacion.rubrica && (
                                    <View style={{ marginBottom: 6 }}>
                                        <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: '#374151' }}>3.3 Rúbrica de Evaluación</Text>
                                        <View style={styles.tableWrapper}>
                                            <View style={[styles.tableHeaderRow, { backgroundColor: '#EEF2FF' }]}>
                                                <View style={[styles.tableCol, { width: '20%' }]}><Text style={[styles.tableCellHeader, { color: '#3730A3' }]}>Aspectos a Evaluar</Text></View>
                                                <View style={[styles.tableCol, { width: '20%' }]}><Text style={[styles.tableCellHeader, { color: '#3730A3', textAlign: 'center' }]}>Nivel de Inicio</Text></View>
                                                <View style={[styles.tableCol, { width: '20%' }]}><Text style={[styles.tableCellHeader, { color: '#3730A3', textAlign: 'center' }]}>Nivel en Proceso</Text></View>
                                                <View style={[styles.tableCol, { width: '20%' }]}><Text style={[styles.tableCellHeader, { color: '#3730A3', textAlign: 'center' }]}>Nivel Satisfactorio</Text></View>
                                                <View style={[styles.tableCol, { width: '20%' }]}><Text style={[styles.tableCellHeader, { color: '#3730A3', textAlign: 'center' }]}>Nivel Sobresaliente</Text></View>
                                            </View>
                                            {data.contenido_ia.evaluacion.rubrica.aspectos?.map((aspecto: string, idx: number) => (
                                                <View key={idx} style={styles.tableRow} wrap={false}>
                                                    <View style={[styles.tableCol, { width: '20%', backgroundColor: '#F9FAFB' }]}>
                                                        <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold' }]}>{aspecto}</Text>
                                                    </View>
                                                    <View style={[styles.tableCol, { width: '20%' }]}>
                                                        <Text style={styles.tableCellMath}>{data.contenido_ia.evaluacion.rubrica?.niveles?.inicio?.[idx]}</Text>
                                                    </View>
                                                    <View style={[styles.tableCol, { width: '20%' }]}>
                                                        <Text style={styles.tableCellMath}>{data.contenido_ia.evaluacion.rubrica?.niveles?.en_proceso?.[idx]}</Text>
                                                    </View>
                                                    <View style={[styles.tableCol, { width: '20%' }]}>
                                                        <Text style={styles.tableCellMath}>{data.contenido_ia.evaluacion.rubrica?.niveles?.satisfactorio?.[idx]}</Text>
                                                    </View>
                                                    <View style={[styles.tableCol, { width: '20%' }]}>
                                                        <Text style={styles.tableCellMath}>{data.contenido_ia.evaluacion.rubrica?.niveles?.sobresaliente?.[idx]}</Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Secuencia Didáctica</Text>
                        {secuenciasByMomento.map(({ momento, items }) => (
                            <View key={momento} style={{ marginBottom: 10 }}>
                                <View style={[styles.secuenciaHeader, { backgroundColor: MOMENTO_COLORS[momento] || '#6B7280', borderRadius: 4, marginBottom: 4 }]}>
                                    <Text style={styles.secuenciaMomento}>{momento}</Text>
                                    <Text style={styles.secuenciaTiempo}>
                                        {items.reduce((s, i) => s + i.tiempo_minutos, 0)} min
                                    </Text>
                                </View>
                                {items.length === 0 ? (
                                    <Text style={[styles.emptyText, { paddingLeft: 8 }]}>Sin actividades en este momento</Text>
                                ) : (
                                    items.map((item, idx) => (
                                        <View key={idx} style={styles.secuenciaCard} wrap={false}>
                                            <View style={[styles.secuenciaHeader, { backgroundColor: MOMENTO_COLORS[momento] + '20' || '#F3F4F6' }]}>
                                                <Text style={[styles.secuenciaMomento, { color: MOMENTO_COLORS[momento] || '#374151' }]}>
                                                    Actividad {idx + 1}
                                                </Text>
                                                <Text style={[styles.secuenciaTiempo, { color: '#6B7280' }]}>{item.tiempo_minutos} min</Text>
                                            </View>
                                            <View style={styles.secuenciaBody}>
                                                <Text style={styles.secuenciaActividad}>{item.actividad}</Text>
                                                {item.recursos && (
                                                    <Text style={styles.secuenciaRecursos}>Recursos: {item.recursos}</Text>
                                                )}
                                            </View>
                                        </View>
                                    ))
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>{data.docente} — Sesión de Aprendizaje</Text>
                    <Text style={styles.footerText}>Elaborado: {generatedAt}</Text>
                </View>
            </Page>

            {/* Hoja 4: Lista de Cotejo, Bibliografía y Firmas */}
            {/* Hoja 4: Lista de Cotejo, Bibliografía y Firmas */}
            <Page size="A4" style={styles.page}>
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>3.4 Lista de Cotejo</Text>
                    {/* Lista de cotejo ocupa maximo la mitad de la hoja */}
                    <View style={[styles.tableWrapper, { marginBottom: 6 }]}>
                        <View style={[styles.tableHeaderRow, { backgroundColor: '#EEF2FF' }]}>
                            <View style={[styles.tableCol, { width: '8%' }]}><Text style={[styles.tableCellHeader, { color: '#3730A3', textAlign: 'center', fontSize: 8 }]}>N°</Text></View>
                            <View style={[styles.tableCol, { width: '42%' }]}><Text style={[styles.tableCellHeader, { color: '#3730A3', fontSize: 8 }]}>Apellidos y Nombres</Text></View>
                            <View style={[styles.tableCol, { width: '25%' }]}><Text style={[styles.tableCellHeader, { color: '#3730A3', textAlign: 'center', fontSize: 8 }]}>Criterio 1</Text></View>
                            <View style={[styles.tableCol, { width: '25%' }]}><Text style={[styles.tableCellHeader, { color: '#3730A3', textAlign: 'center', fontSize: 8 }]}>Criterio 2</Text></View>
                        </View>
                        {Array.from({ length: 25 }).map((_, idx) => (
                            <View key={idx} style={styles.tableRow} wrap={false}>
                                <View style={[styles.tableCol, { width: '8%' }]}>
                                    <Text style={[styles.tableCell, { textAlign: 'center', paddingVertical: 1.5 }]}>{idx + 1}</Text>
                                </View>
                                <View style={[styles.tableCol, { width: '42%' }]}>
                                    <Text style={[styles.tableCell, { paddingVertical: 1.5 }]}></Text>
                                </View>
                                <View style={[styles.tableCol, { width: '25%' }]}>
                                    <Text style={[styles.tableCell, { paddingVertical: 1.5 }]}></Text>
                                </View>
                                <View style={[styles.tableCol, { width: '25%' }]}>
                                    <Text style={[styles.tableCell, { paddingVertical: 1.5 }]}></Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>IV. BIBLIOGRAFÍA Y RECURSOS</Text>

                    <View style={{ marginTop: 6, marginBottom: 12 }}>
                        <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5, fontWeight: 700, marginBottom: 8 }}>
                            Repositorio y videos sugeridos para apoyo docente / estudiante:
                        </Text>

                        {data.contenido_ia?.bibliografia && data.contenido_ia.bibliografia.length > 0 ? (
                            data.contenido_ia.bibliografia.map((bib: any, idx: number) => (
                                <View key={idx} style={{ flexDirection: 'row', marginBottom: 6, backgroundColor: '#F8FAFC', padding: 6, paddingHorizontal: 8, borderRadius: 4 }}>
                                    <Text style={{ width: 14, fontSize: 10, color: '#4F46E5', fontFamily: 'SymbolFont' }}>▶</Text>
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Text style={{ fontFamily: 'Helvetica-Bold', color: '#312E81', marginBottom: 2, fontSize: 9, lineHeight: 1.3 }}>
                                            {bib.titulo_video}
                                        </Text>
                                        {bib.descripcion && (
                                            <Text style={{ fontFamily: 'Helvetica', color: '#4B5563', fontSize: 8, marginBottom: 2, lineHeight: 1.3 }}>
                                                {bib.descripcion}
                                            </Text>
                                        )}
                                        <Link src={bib.url} style={{ fontFamily: 'Helvetica', color: '#2563EB', textDecoration: 'underline', fontSize: 9, lineHeight: 1.3 }}>
                                            {bib.url}
                                        </Link>
                                    </View>
                                </View>
                            ))
                        ) : (
                            // Fallback para sesiones generadas previamente sin bibliografía enriquecida
                            <>
                                <View style={[styles.listItem, { marginBottom: 8 }]}>
                                    <Text style={styles.bullet}>•</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.listItemText, { fontWeight: 700, marginBottom: 4 }]}>
                                            Video Educativo referencial sobre el tema principal:
                                        </Text>
                                        <Link src={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${data.titulo} ${data.grado}`)}`} style={[styles.listItemText, { color: '#2563EB', textDecoration: 'underline' }]}>
                                            Ver videos sugeridos en YouTube
                                        </Link>
                                    </View>
                                </View>

                                <View style={[styles.listItem, { marginBottom: 8 }]}>
                                    <Text style={styles.bullet}>•</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.listItemText, { fontWeight: 700, marginBottom: 4 }]}>
                                            Dinámicas y estrategias para el nivel / área:
                                        </Text>
                                        <Link src={`https://www.youtube.com/results?search_query=${encodeURIComponent(`estrategias didacticas ${data.area} ${data.grado}`)}`} style={[styles.listItemText, { color: '#2563EB', textDecoration: 'underline' }]}>
                                            Ver estrategias en YouTube
                                        </Link>
                                    </View>
                                </View>

                                <View style={[styles.listItem, { marginBottom: 8 }]}>
                                    <Text style={styles.bullet}>•</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.listItemText, { fontWeight: 700, marginBottom: 4 }]}>
                                            Material audiovisual de profundización sobre el propósito:
                                        </Text>
                                        <Link src={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                                            data.contenido_ia?.aspectos_curriculares?.aprendizaje_esperado?.substring(0, 50) || data.titulo
                                        )}`} style={[styles.listItemText, { color: '#2563EB', textDecoration: 'underline' }]}>
                                            Ver material de profundización en YouTube
                                        </Link>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>

                </View>

                {/* Firmas Area (Fijas al final de la página antes del footer) */}
                <View style={{ position: 'absolute', bottom: 60, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 40 }}>
                    <View style={{ width: '40%', alignItems: 'center' }}>
                        <View style={{ borderTop: '1px solid #111827', width: '100%', paddingTop: 6, alignItems: 'center' }}>
                            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#111827' }}>Firma del Docente</Text>
                            <Text style={{ fontSize: 8, color: '#4B5563', marginTop: 2 }}>{data.docente}</Text>
                        </View>
                    </View>
                    <View style={{ width: '40%', alignItems: 'center' }}>
                        <View style={{ borderTop: '1px solid #111827', width: '100%', paddingTop: 6, alignItems: 'center' }}>
                            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#111827' }}>Firma del Personal Directivo</Text>
                            <Text style={{ fontSize: 8, color: '#4B5563', marginTop: 2 }}>V°B° Dirección / Subdirección</Text>
                        </View>
                    </View>
                </View>

                {/* Footer de la nueva hoja */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>{data.docente} — Sesión de Aprendizaje</Text>
                    <Text style={styles.footerText}>Elaborado: {generatedAt}</Text>
                </View>
            </Page>
        </Document>
    )
}
