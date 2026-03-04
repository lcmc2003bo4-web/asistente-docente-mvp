import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
} from '@react-pdf/renderer'
import type { PlanificadorRow, PlanificadorMeta } from '@/lib/services/PlanificadorService'

const MONTH_NAMES = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

// ============================================================
// Styles — portrait A4, paleta emerald
// ============================================================
const S = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        paddingTop: 36,
        paddingBottom: 52,
        paddingHorizontal: 36,
        backgroundColor: '#ffffff',
    },

    // Header
    header: {
        borderBottom: '2px solid #059669',
        paddingBottom: 10,
        marginBottom: 14,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    logo: { width: 34, height: 34, objectFit: 'contain', marginRight: 10 },
    institutionName: {
        fontSize: 10, fontFamily: 'Helvetica-Bold',
        color: '#111827', textTransform: 'uppercase', letterSpacing: 0.5,
    },
    docType: {
        fontSize: 8, color: '#059669',
        fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5,
    },
    title: {
        fontSize: 15, fontFamily: 'Helvetica-Bold',
        color: '#111827', marginBottom: 3,
    },
    subtitle: { fontSize: 9, color: '#4B5563' },

    // Metadata row
    metaRow: { flexDirection: 'row', gap: 6, marginBottom: 14 },
    metaItem: {
        backgroundColor: '#F0FDF4',
        borderRadius: 4,
        padding: '5 8',
        flex: 1,
        border: '1px solid #D1FAE5',
    },
    metaLabel: {
        fontSize: 6.5, color: '#6B7280',
        textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 2,
    },
    metaValue: {
        fontSize: 8.5, color: '#111827', fontFamily: 'Helvetica-Bold',
    },

    // Section title
    sectionTitle: {
        fontSize: 10, fontFamily: 'Helvetica-Bold',
        color: '#065F46', borderBottom: '1px solid #D1FAE5',
        paddingBottom: 4, marginBottom: 8,
    },

    // Week sub-header
    weekHeader: {
        backgroundColor: '#ECFDF5',
        padding: '4 8',
        borderLeft: '3px solid #059669',
    },
    weekHeaderText: {
        fontSize: 7.5, fontFamily: 'Helvetica-Bold',
        color: '#065F46', textTransform: 'uppercase', letterSpacing: 0.4,
    },

    // Table
    table: { width: '100%', marginBottom: 14 },
    thead: {
        flexDirection: 'row',
        backgroundColor: '#059669',
        padding: '5 6',
    },
    theadCell: {
        color: '#ffffff', fontSize: 7.5, fontFamily: 'Helvetica-Bold',
    },
    trow: {
        flexDirection: 'row',
        borderBottom: '1px solid #F0FDF4',
        padding: '5 6',
        backgroundColor: '#ffffff',
    },
    trowAlt: {
        flexDirection: 'row',
        borderBottom: '1px solid #F0FDF4',
        padding: '5 6',
        backgroundColor: '#F9FAFB',
    },
    tcell: { fontSize: 8, color: '#374151' },

    // Signature
    signatureSection: {
        marginTop: 24, flexDirection: 'row', justifyContent: 'flex-end',
    },
    signatureBox: {
        borderTop: '1px solid #9CA3AF',
        paddingTop: 4, minWidth: 160, alignItems: 'center',
    },
    signatureLabel: { fontSize: 7, color: '#6B7280' },

    // Footer
    footer: {
        position: 'absolute', bottom: 20, left: 36, right: 36,
        flexDirection: 'row', justifyContent: 'space-between',
        borderTop: '1px solid #D1FAE5', paddingTop: 5,
    },
    footerText: { fontSize: 6.5, color: '#9CA3AF' },
})

// ============================================================
// Helpers
// ============================================================
function groupByWeek(rows: PlanificadorRow[]): Map<number, PlanificadorRow[]> {
    const map = new Map<number, PlanificadorRow[]>()
    for (const row of rows) {
        const g = map.get(row.semana) || []
        g.push(row)
        map.set(row.semana, g)
    }
    return map
}

/** Returns "DD/MM" from ISO "YYYY-MM-DD" */
function formatDate(iso: string): string {
    const [, m, d] = iso.split('-')
    return `${d}/${m}`
}

// ============================================================
// PlanificadorPDF component
// ============================================================
export interface PlanificadorPDFData {
    rows: PlanificadorRow[]
    meta: PlanificadorMeta
    logo_url?: string
}

export function PlanificadorPDF({ data }: { data: PlanificadorPDFData }) {
    const { rows, meta, logo_url } = data
    const generatedAt = new Date().toLocaleDateString('es-PE', {
        day: '2-digit', month: 'long', year: 'numeric',
    })
    const weekGroups = groupByWeek(rows)
    const weekEntries = Array.from(weekGroups.entries()).sort(([a], [b]) => a - b)
    const mesLabel = `${MONTH_NAMES[meta.mes]} ${meta.anio}`

    // Show Sección column only when the data has named sections
    const hasSecciones = rows.some(r => r.seccion && r.seccion !== '—')

    // Column flex proportions (sum ≈ 1.0)
    const wFecha = 0.13
    const wDia = 0.13
    const wTitulo = hasSecciones ? 0.42 : 0.49
    const wGrado = hasSecciones ? 0.22 : 0.25
    const wSec = 0.10   // only rendered when hasSecciones

    return (
        <Document title={`Planificador Mensual — ${mesLabel}`} author="Asistente Normativo Docente">
            <Page size="A4" style={S.page}>

                {/* ── Header ── */}
                <View style={S.header}>
                    <View style={S.headerTop}>
                        {logo_url && <Image src={logo_url} style={S.logo} />}
                        <View>
                            <Text style={S.institutionName}>{meta.institucion || 'Institución Educativa'}</Text>
                            <Text style={S.docType}>Planificador Mensual de Sesiones</Text>
                        </View>
                    </View>
                    <Text style={S.title}>Planificador — {mesLabel}</Text>
                    <Text style={S.subtitle}>Docente: {meta.docente}</Text>
                </View>

                {/* ── Metadata ── */}
                <View style={S.metaRow}>
                    <View style={S.metaItem}>
                        <Text style={S.metaLabel}>Institución</Text>
                        <Text style={S.metaValue}>{meta.institucion || '—'}</Text>
                    </View>
                    <View style={S.metaItem}>
                        <Text style={S.metaLabel}>Docente</Text>
                        <Text style={S.metaValue}>{meta.docente || '—'}</Text>
                    </View>
                    <View style={S.metaItem}>
                        <Text style={S.metaLabel}>Mes / Año</Text>
                        <Text style={S.metaValue}>{mesLabel}</Text>
                    </View>
                    <View style={S.metaItem}>
                        <Text style={S.metaLabel}>Total Sesiones</Text>
                        <Text style={S.metaValue}>{meta.total}</Text>
                    </View>
                </View>

                {/* ── Section title ── */}
                <Text style={S.sectionTitle}>Sesiones de Aprendizaje Programadas</Text>

                {/* ── Table ── */}
                <View style={S.table}>
                    {/* Table header */}
                    <View style={S.thead}>
                        <Text style={[S.theadCell, { flex: wFecha }]}>Fecha</Text>
                        <Text style={[S.theadCell, { flex: wDia }]}>Día</Text>
                        <Text style={[S.theadCell, { flex: wTitulo }]}>Título de la Sesión</Text>
                        <Text style={[S.theadCell, { flex: wGrado }]}>Grado / Área</Text>
                        {hasSecciones && (
                            <Text style={[S.theadCell, { flex: wSec, textAlign: 'center' }]}>Secc.</Text>
                        )}
                    </View>

                    {/* Week groups */}
                    {weekEntries.map(([semana, weekRows]) => (
                        <View key={semana}>
                            <View style={S.weekHeader}>
                                <Text style={S.weekHeaderText}>Semana {semana}</Text>
                            </View>
                            {weekRows.map((row, i) => (
                                <View
                                    key={`${row.id}-${row.seccion}-${row.fecha}`}
                                    style={i % 2 === 0 ? S.trow : S.trowAlt}
                                >
                                    <Text style={[S.tcell, { flex: wFecha, fontFamily: 'Helvetica-Bold', fontSize: 7.5 }]}>
                                        {formatDate(row.fecha)}
                                    </Text>
                                    <Text style={[S.tcell, { flex: wDia }]}>
                                        {row.dia_semana}
                                    </Text>
                                    <Text style={[S.tcell, { flex: wTitulo }]}>
                                        {row.titulo}
                                    </Text>
                                    <Text style={[S.tcell, { flex: wGrado, color: '#6B7280', fontSize: 7.5 }]}>
                                        {row.grado_nombre}{'\n'}{row.area_nombre}
                                    </Text>
                                    {hasSecciones && (
                                        <Text style={[S.tcell, {
                                            flex: wSec,
                                            textAlign: 'center',
                                            fontFamily: 'Helvetica-Bold',
                                            color: '#065F46',
                                        }]}>
                                            {row.seccion !== '—' ? row.seccion : ''}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* ── Signature ── */}
                <View style={S.signatureSection}>
                    <View style={S.signatureBox}>
                        <Text style={S.signatureLabel}>{meta.docente}</Text>
                        <Text style={S.signatureLabel}>Docente responsable</Text>
                    </View>
                </View>

                {/* ── Footer (fixed on all pages) ── */}
                <View style={S.footer} fixed>
                    <Text style={S.footerText}>{meta.docente} — Planificador Mensual</Text>
                    <Text style={S.footerText}>Elaborado: {generatedAt}</Text>
                </View>

            </Page>
        </Document>
    )
}
