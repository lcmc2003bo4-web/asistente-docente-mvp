import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
} from '@react-pdf/renderer'

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        paddingTop: 40,
        paddingBottom: 50,
        paddingHorizontal: 40,
        backgroundColor: '#ffffff',
    },
    // Header
    header: {
        borderBottom: '2px solid #4F46E5',
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
        color: '#4F46E5',
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 10,
        color: '#4B5563',
    },
    // Metadata grid
    metaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    metaItem: {
        backgroundColor: '#F3F4F6',
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
    },
    // Section
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#4F46E5',
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: 4,
        marginBottom: 8,
    },
    // Table
    table: {
        width: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#4F46E5',
        padding: '5 8',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    },
    tableHeaderCell: {
        color: '#ffffff',
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        flex: 1,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #F3F4F6',
        padding: '5 8',
    },
    tableRowAlt: {
        flexDirection: 'row',
        borderBottom: '1px solid #F3F4F6',
        padding: '5 8',
        backgroundColor: '#F9FAFB',
    },
    tableCell: {
        fontSize: 9,
        color: '#374151',
        flex: 1,
    },
    // Validation badge
    validBadge: {
        backgroundColor: '#D1FAE5',
        color: '#065F46',
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        padding: '3 8',
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    invalidBadge: {
        backgroundColor: '#FEE2E2',
        color: '#991B1B',
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        padding: '3 8',
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    pendingBadge: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        padding: '3 8',
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    // Footer
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
    // Text helpers
    bodyText: {
        fontSize: 9,
        color: '#374151',
        lineHeight: 1.5,
    },
    emptyText: {
        fontSize: 9,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
})

// ============================================================
// Shared components
// ============================================================
function PageFooter({ docType, generatedAt }: { docType: string; generatedAt: string }) {
    return (
        <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Asistente Normativo Docente — {docType}</Text>
            <Text style={styles.footerText}>Generado: {generatedAt}</Text>
        </View>
    )
}

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

// ============================================================
// ProgramacionPDF
// ============================================================
export interface ProgramacionPDFData {
    titulo: string
    curso?: string
    area: string
    grado: string
    nivel: string
    ciclo: string
    periodo: string
    anio: string
    validation_status: string | null
    competencias: Array<{ codigo: string; nombre: string; descripcion?: string }>
    unidades: Array<{ titulo: string; duracion_semanas: number; orden: number }>
    docente: string
    institucion?: string
    logo_url?: string
}

export function ProgramacionPDF({ data }: { data: ProgramacionPDFData }) {
    const generatedAt = new Date().toLocaleDateString('es-PE', {
        day: '2-digit', month: 'long', year: 'numeric'
    })

    return (
        <Document title={`Programación Anual — ${data.titulo}`} author="Asistente Normativo Docente">
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerRow}>
                            {data.logo_url && <Image src={data.logo_url} style={styles.logo} />}
                            <View>
                                <Text style={styles.institutionName}>{data.institucion || 'Institución Educativa'}</Text>
                                <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>Programación Curricular Anual</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.title}>{data.titulo}</Text>
                    <Text style={styles.subtitle}>{data.area} — {data.grado}</Text>
                </View>

                {/* Metadata */}
                <View style={styles.metaGrid}>
                    <MetaItem label="Área Curricular" value={data.area} />
                    <MetaItem label="Curso" value={data.curso || '—'} />
                    <MetaItem label="Grado" value={data.grado} />
                    <MetaItem label="Nivel" value={data.nivel} />
                    <MetaItem label="Ciclo" value={data.ciclo} />
                    <MetaItem label="Periodo" value={data.periodo} />
                    <MetaItem label="Año Lectivo" value={data.anio} />
                    <MetaItem label="Docente" value={data.docente} />
                </View>

                {/* Competencias */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Competencias Seleccionadas ({data.competencias.length})</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { flex: 0.15 }]}>Código</Text>
                            <Text style={[styles.tableHeaderCell, { flex: 0.4 }]}>Competencia</Text>
                            <Text style={[styles.tableHeaderCell, { flex: 0.45 }]}>Descripción</Text>
                        </View>
                        {data.competencias.length === 0 ? (
                            <View style={styles.tableRow}>
                                <Text style={styles.emptyText}>Sin competencias seleccionadas</Text>
                            </View>
                        ) : (
                            data.competencias.map((c, i) => (
                                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                    <Text style={[styles.tableCell, { flex: 0.15, fontFamily: 'Helvetica-Bold' }]}>{c.codigo}</Text>
                                    <Text style={[styles.tableCell, { flex: 0.4 }]}>{c.nombre}</Text>
                                    <Text style={[styles.tableCell, { flex: 0.45, color: '#6B7280' }]}>
                                        {c.descripcion ? c.descripcion.substring(0, 120) + (c.descripcion.length > 120 ? '...' : '') : '—'}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>
                </View>

                {/* Unidades */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Unidades Didácticas ({data.unidades.length})</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { flex: 0.08 }]}>N°</Text>
                            <Text style={[styles.tableHeaderCell, { flex: 0.72 }]}>Título</Text>
                            <Text style={[styles.tableHeaderCell, { flex: 0.2 }]}>Semanas</Text>
                        </View>
                        {data.unidades.length === 0 ? (
                            <View style={styles.tableRow}>
                                <Text style={styles.emptyText}>Sin unidades creadas</Text>
                            </View>
                        ) : (
                            data.unidades.map((u, i) => (
                                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                    <Text style={[styles.tableCell, { flex: 0.08, fontFamily: 'Helvetica-Bold' }]}>{u.orden}</Text>
                                    <Text style={[styles.tableCell, { flex: 0.72 }]}>{u.titulo}</Text>
                                    <Text style={[styles.tableCell, { flex: 0.2 }]}>{u.duracion_semanas} sem.</Text>
                                </View>
                            ))
                        )}
                    </View>
                    {data.unidades.length > 0 && (
                        <Text style={[styles.bodyText, { marginTop: 6, textAlign: 'right', color: '#4F46E5' }]}>
                            Total: {data.unidades.reduce((s, u) => s + u.duracion_semanas, 0)} semanas
                        </Text>
                    )}
                </View>

                <PageFooter docType="Programación Anual" generatedAt={generatedAt} />
            </Page>
        </Document>
    )
}
