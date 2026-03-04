import {
    Document,
    Page,
    Text,
    Image,
    View,
    StyleSheet,
} from '@react-pdf/renderer'

// ── Styles ─────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        paddingTop: 36,
        paddingBottom: 52,
        paddingHorizontal: 40,
        backgroundColor: '#ffffff',
    },
    // Header
    header: {
        borderBottom: '2px solid #059669',
        paddingBottom: 10,
        marginBottom: 14,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    logo: { width: 34, height: 34, objectFit: 'contain', marginRight: 10 },
    institutionName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111827', textTransform: 'uppercase', letterSpacing: 0.5 },
    docTypeLabel: { fontSize: 8, color: '#059669', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },
    title: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 3, marginTop: 8 },
    subtitle: { fontSize: 8, color: '#4B5563' },
    // Metadata grid
    metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
    metaItem: { backgroundColor: '#F0FDF4', borderRadius: 4, padding: '4 8', width: '31%' },
    metaLabel: { fontSize: 7, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 1 },
    metaValue: { fontSize: 9, color: '#111827', fontFamily: 'Helvetica-Bold' },
    // Section titles — roman numeral prefix style
    sectionBlock: { marginBottom: 14 },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#059669',
        textTransform: 'uppercase',
        borderBottom: '1.5px solid #059669',
        paddingBottom: 3,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1E40AF', marginBottom: 4 },
    body: { fontSize: 9, color: '#374151', lineHeight: 1.5 },
    bodyBold: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#374151' },
    // Tables
    table: { width: '100%', border: '1px solid #E5E7EB', borderRadius: 2 },
    thead: { flexDirection: 'row', backgroundColor: '#059669', borderRadius: 2 },
    theadCell: { color: '#fff', fontSize: 8, fontFamily: 'Helvetica-Bold', padding: '5 6' },
    trow: { flexDirection: 'row', borderBottom: '1px solid #F0F0F0' },
    trowAlt: { flexDirection: 'row', borderBottom: '1px solid #F0F0F0', backgroundColor: '#F9FAFB' },
    tcell: { fontSize: 8, color: '#374151', padding: '5 6', lineHeight: 1.4 },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 18,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTop: '1px solid #E5E7EB',
        paddingTop: 5,
    },
    footerText: { fontSize: 7, color: '#9CA3AF' },
})

// ── Sub-components ──────────────────────────────────────────────────────────
function MetaItem({ label, value }: { label: string; value: string }) {
    return (
        <View style={S.metaItem}>
            <Text style={S.metaLabel}>{label}</Text>
            <Text style={S.metaValue}>{value || '—'}</Text>
        </View>
    )
}

function Footer({ docente, date }: { docente: string; date: string }) {
    return (
        <View style={S.footer} fixed>
            <Text style={S.footerText}>{docente} — Unidad Didáctica</Text>
            <Text style={S.footerText}>Elaborado: {date}</Text>
        </View>
    )
}

/** Parses the situación text into CONTEXTO / EXPLORACIÓN / RETO / PROPÓSITO blocks */
function SituacionBlock({ text }: { text: string }) {
    const labels = ['CONTEXTO', 'EXPLORACIÓN', 'RETO', 'PROPÓSITO']
    return (
        <>
            {labels.map((label, idx) => {
                const next = labels[idx + 1]
                const rex = new RegExp(`${label}[:\\s]*([\\s\\S]*?)${next ? `(?=${next})` : '$'}`, 'i')
                const m = text.match(rex)
                const content = m ? m[1].trim() : ''
                if (!content) return null
                return (
                    <View key={label} style={{ marginBottom: 7 }}>
                        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#059669', marginBottom: 2 }}>{label}</Text>
                        <Text style={S.body}>{content}</Text>
                    </View>
                )
            })}
        </>
    )
}

/** Matrix row group — competencia centered, one sub-row per (cap[i], des[i]) pair */
function MatrizGroup({ mat, isOdd }: { mat: any; isOdd: boolean }) {
    const caps: string[] = mat.capacidades || []
    const dess: string[] = mat.desempenos_contextualizados || []
    const maxRows = Math.max(caps.length, dess.length, 1)
    const bg = isOdd ? '#F0FDF4' : '#FFFFFF'
    return (
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #A7F3D0' }}>
            {/* Competencia col — vertically centered */}
            <View style={{ width: '22%', backgroundColor: bg, padding: '6 6', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #A7F3D0' }}>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#065F46', textAlign: 'center' }}>{mat.competencia}</Text>
            </View>
            {/* Pairs col */}
            <View style={{ width: '78%', backgroundColor: bg }}>
                {Array.from({ length: maxRows }).map((_, i) => (
                    <View key={i} style={{ flexDirection: 'row', borderBottom: i < maxRows - 1 ? '0.5px solid #D1FAE5' : 'none' }}>
                        <View style={{ width: '35%', padding: '5 6', borderRight: '0.5px solid #D1FAE5' }}>
                            {caps[i] && <Text style={[S.body, { fontSize: 8 }]}>• {caps[i]}</Text>}
                        </View>
                        <View style={{ width: '65%', padding: '5 6' }}>
                            {dess[i] && <Text style={[S.body, { fontSize: 8 }]}>• {dess[i]}</Text>}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}

// ── Main component ──────────────────────────────────────────────────────────
export interface UnidadPDFData {
    titulo: string
    curso?: string
    proposito?: string
    situacion_significativa?: string
    duracion_semanas: number
    programacion_titulo: string
    area: string
    grado: string
    ciclo?: string
    periodo_tipo?: string
    fecha_inicio?: string
    fecha_fin?: string
    validation_status: string | null
    matriz_ia?: any
    evaluacion_ia?: any
    enfoques_transversales?: any[]
    desempenos: Array<{ codigo?: string; descripcion: string; competencia_nombre: string }>
    sesiones: Array<{ titulo: string; duracion_minutos: number; fecha?: string; proposito?: string; evidencias?: string }>
    docente: string
    institucion?: string
    logo_url?: string
}

export function UnidadPDF({ data }: { data: UnidadPDFData }) {
    const generatedAt = new Date().toLocaleDateString('es-PE', {
        day: '2-digit', month: 'long', year: 'numeric'
    })

    const matrices: any[] = data.matriz_ia
        ? (Array.isArray(data.matriz_ia) ? data.matriz_ia : [data.matriz_ia])
        : []

    const fmtDate = (d?: string) =>
        d ? new Date(d + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) : ''

    // ── PAGE 1: Header + Metadata + I. Situación + II. Propósitos ──────────
    return (
        <Document title={`Unidad Didáctica — ${data.titulo}`} author="Asistente Normativo Docente">
            <Page size="A4" style={S.page}>
                {/* Header */}
                <View style={S.header}>
                    <View style={S.headerRow}>
                        {data.logo_url && <Image src={data.logo_url} style={S.logo} />}
                        <View>
                            <Text style={S.institutionName}>{data.institucion || 'Institución Educativa'}</Text>
                            <Text style={S.docTypeLabel}>Unidad Didáctica de Aprendizaje</Text>
                        </View>
                    </View>
                    <Text style={S.title}>{data.titulo}</Text>
                    <Text style={S.subtitle}>{data.programacion_titulo}</Text>
                </View>

                {/* Metadata grid */}
                <View style={S.metaGrid}>
                    <MetaItem label="Área Curricular" value={data.area} />
                    <MetaItem label="Curso / Módulo" value={data.curso || '—'} />
                    <MetaItem label="Grado" value={data.grado} />
                    <MetaItem label="Ciclo" value={data.ciclo || '—'} />
                    <MetaItem label="Tipo de Periodo" value={data.periodo_tipo || '—'} />
                    <MetaItem label="Duración" value={`${data.duracion_semanas} semanas`} />
                    {data.fecha_inicio && <MetaItem label="Fecha de Inicio" value={fmtDate(data.fecha_inicio)} />}
                    {data.fecha_fin && <MetaItem label="Fecha de Fin" value={fmtDate(data.fecha_fin)} />}
                    <MetaItem label="Docente" value={data.docente} />
                </View>

                {/* I. SITUACIÓN SIGNIFICATIVA */}
                {data.situacion_significativa && (
                    <View style={S.sectionBlock}>
                        <Text style={S.sectionTitle}>I. Situación Significativa</Text>
                        <SituacionBlock text={data.situacion_significativa} />
                    </View>
                )}

                {/* II. PROPÓSITOS DE APRENDIZAJE (texto + propósito IA — sin matriz) */}
                <View style={S.sectionBlock}>
                    <Text style={S.sectionTitle}>II. Propósitos de Aprendizaje</Text>
                    {data.proposito && (
                        <Text style={[S.body, { marginBottom: 6 }]}>{data.proposito}</Text>
                    )}
                    {/* Matrix header note for context — table is on page 2 */}
                    {matrices.length > 0 && (
                        <Text style={[S.body, { color: '#6B7280', fontStyle: 'italic', fontSize: 8 }]}>
                            * Vease Matriz CNEB en la siguiente pagina.
                        </Text>
                    )}
                </View>

                <Footer docente={data.docente} date={generatedAt} />
            </Page>

            {/* ── PAGE 2+: Matriz CNEB ──────────────────────────────────────── */}
            {matrices.length > 0 && (
                <Page size="A4" style={S.page}>
                    <View style={S.sectionBlock}>
                        <Text style={S.sectionTitle}>II. Propósitos de Aprendizaje — Matriz CNEB</Text>
                        <Text style={[S.subTitle, { marginBottom: 8, fontSize: 8, color: '#374151' }]}>
                            Competencias, Capacidades y Desempeños Contextualizados
                        </Text>

                        {/* Table */}
                        <View style={[S.table, { borderRadius: 3 }]}>
                            {/* Header */}
                            <View style={[S.thead, { borderRadius: 3 }]}>
                                <Text style={[S.theadCell, { width: '22%' }]}>Competencia</Text>
                                <Text style={[S.theadCell, { width: '27%' }]}>Capacidades</Text>
                                <Text style={[S.theadCell, { width: '51%' }]}>Desempeños Contextualizados</Text>
                            </View>

                            {matrices.map((mat, mx) => (
                                <MatrizGroup key={mx} mat={mat} isOdd={mx % 2 === 1} />
                            ))}
                        </View>
                    </View>

                    <Footer docente={data.docente} date={generatedAt} />
                </Page>
            )}

            {/* ── PAGE 3: III. Sesiones + IV. Enfoques ─────────────────────── */}
            <Page size="A4" style={S.page}>
                {/* III. SECUENCIA DE LAS SESIONES */}
                <View style={S.sectionBlock}>
                    <Text style={S.sectionTitle}>III. Secuencia de las Sesiones de Aprendizaje</Text>
                    <View style={S.table}>
                        <View style={S.thead}>
                            <Text style={[S.theadCell, { flex: 0.28 }]}>Sesión</Text>
                            <Text style={[S.theadCell, { flex: 0.72 }]}>Desempeño Precisado y Experiencia de Aprendizaje</Text>
                        </View>
                        {data.sesiones.length === 0 ? (
                            <View style={S.trow}>
                                <Text style={[S.tcell, { color: '#9CA3AF', fontStyle: 'italic' }]}>Sin sesiones asociadas aún.</Text>
                            </View>
                        ) : (
                            data.sesiones.map((s, i) => (
                                <View key={i} style={i % 2 === 0 ? S.trow : S.trowAlt}>
                                    <View style={{ flex: 0.28, padding: '5 6' }}>
                                        <Text style={[S.tcell, { fontFamily: 'Helvetica-Bold', color: '#111827', padding: 0 }]}>Sesión {i + 1}</Text>
                                        <Text style={[S.body, { fontSize: 8, marginTop: 2 }]}>{s.titulo}</Text>
                                        {s.fecha && (
                                            <Text style={[S.body, { marginTop: 3, color: '#6B7280', fontSize: 7, fontStyle: 'italic' }]}>
                                                {new Date(s.fecha).toLocaleDateString('es-PE')}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={{ flex: 0.72, padding: '5 6' }}>
                                        <Text style={[S.body, { fontSize: 8 }]}>
                                            <Text style={S.bodyBold}>Desempeño: </Text>{s.proposito || '—'}
                                        </Text>
                                        <Text style={[S.body, { marginTop: 4, fontSize: 8 }]}>
                                            <Text style={S.bodyBold}>Experiencia: </Text>{s.evidencias || '—'}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </View>

                {/* IV. ENFOQUES TRANSVERSALES */}
                {data.enfoques_transversales && data.enfoques_transversales.length > 0 && (
                    <View style={S.sectionBlock}>
                        <Text style={S.sectionTitle}>IV. Enfoques Transversales</Text>
                        <View style={S.table}>
                            <View style={S.thead}>
                                <Text style={[S.theadCell, { flex: 0.22 }]}>Enfoque</Text>
                                <Text style={[S.theadCell, { flex: 0.22 }]}>Valor</Text>
                                <Text style={[S.theadCell, { flex: 0.56 }]}>Actitudes Observables</Text>
                            </View>
                            {data.enfoques_transversales.map((enf, i) => (
                                <View key={i} style={i % 2 === 0 ? S.trow : S.trowAlt}>
                                    <Text style={[S.tcell, { flex: 0.22, fontFamily: 'Helvetica-Bold', color: '#047857' }]}>{enf.enfoque}</Text>
                                    <Text style={[S.tcell, { flex: 0.22, fontStyle: 'italic' }]}>{enf.valor}</Text>
                                    <Text style={[S.tcell, { flex: 0.56 }]}>{enf.actitudes}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <Footer docente={data.docente} date={generatedAt} />
            </Page>

            {/* ── PAGE 4: V. Evaluación + Firmas ───────────────────────────── */}
            <Page size="A4" style={S.page}>
                {/* V. EVALUACIÓN */}
                <View style={S.sectionBlock}>
                    <Text style={S.sectionTitle}>V. Evaluación de la Unidad</Text>
                    {data.evaluacion_ia ? (
                        <>
                            {/* Evidencia + Instrumento row */}
                            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                                <View style={{ flex: 1, backgroundColor: '#ECFDF5', borderRadius: 4, padding: 10, border: '1px solid #A7F3D0' }}>
                                    <Text style={[S.bodyBold, { fontSize: 8, marginBottom: 4, color: '#065F46' }]}>EVIDENCIA PRINCIPAL</Text>
                                    <Text style={[S.body, { fontSize: 8 }]}>{data.evaluacion_ia.evidencias}</Text>
                                </View>
                                <View style={{ flex: 0.5, backgroundColor: '#ECFDF5', borderRadius: 4, padding: 10, border: '1px solid #A7F3D0' }}>
                                    <Text style={[S.bodyBold, { fontSize: 8, marginBottom: 4, color: '#065F46' }]}>INSTRUMENTO</Text>
                                    <Text style={[S.body, { fontSize: 8 }]}>{data.evaluacion_ia.instrumento}</Text>
                                </View>
                            </View>
                            {/* Criterios */}
                            <View style={{ backgroundColor: '#F9FAFB', border: '1px solid #D1FAE5', borderRadius: 4, padding: 10 }}>
                                <Text style={[S.bodyBold, { fontSize: 8, marginBottom: 6, color: '#374151' }]}>CRITERIOS DE ÉXITO</Text>
                                {data.evaluacion_ia.criterios?.map((c: string, i: number) => (
                                    <View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>
                                        <Text style={[S.body, { fontSize: 8, color: '#059669', marginRight: 4 }]}>•</Text>
                                        <Text style={[S.body, { fontSize: 8, flex: 1 }]}>{c}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : (
                        <Text style={[S.body, { color: '#9CA3AF', fontStyle: 'italic' }]}>Evaluación no generada.</Text>
                    )}
                </View>

                {/* Firmas */}
                <View wrap={false} style={{ marginTop: 32 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ width: '38%', alignItems: 'center' }}>
                            <View style={{ width: '100%', borderTop: '1pt solid #111827', paddingTop: 6, alignItems: 'center' }}>
                                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#111827' }}>Firma del Docente</Text>
                                <Text style={{ fontSize: 8, color: '#6B7280', marginTop: 2 }}>{data.docente}</Text>
                            </View>
                        </View>
                        <View style={{ width: '38%', alignItems: 'center' }}>
                            <View style={{ width: '100%', borderTop: '1pt solid #111827', paddingTop: 6, alignItems: 'center' }}>
                                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#111827' }}>Firma del Personal Directivo</Text>
                                <Text style={{ fontSize: 8, color: '#6B7280', marginTop: 2 }}>V°B° Dirección / Subdirección</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Footer docente={data.docente} date={generatedAt} />
            </Page>
        </Document>
    )
}
