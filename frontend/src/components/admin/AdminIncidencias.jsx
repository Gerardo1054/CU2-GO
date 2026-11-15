
import AdminIncidenciaCard from './AdminIncidenciaCard';

function AdminIncidencias({
    pestañaActual,
    edificioSeleccionado,
    incidenciasMostradas,
    cargando,
    error,
    estados,
    setEstados,
    observaciones,
    setObservaciones,
    guardando,
    guardarCambios,
    mensajes,
    evidenciaVisible,
    setEvidenciaVisible,
    historiales,
    historialVisible,
    setHistorialVisible,
    cargandoHistorial,
    cargarHistorial,
    formatoEstado,
    formatoTipo,
    formatoFecha,
    setReportePendiente
}) {
    const notificaciones = Object.values(mensajes || {}).filter(Boolean);
    const mensajeActual = notificaciones[notificaciones.length - 1];

    return (
        <section className="admin-incidencias">

            {mensajeActual && (
                <div className="admin-toast" role="status">
                    <span className="admin-toast-icono">✓</span>
                    <span>{mensajeActual}</span>
                </div>
            )}

            <div className="admin-seccion-encabezado">
                <div>
                    <h2>
                        {pestañaActual === 'activas'
                            ? 'Incidencias activas'
                            : 'Historial de incidencias solucionadas'}
                    </h2>

                    <p>
                        {pestañaActual === 'activas'
                            ? 'Reportes pendientes en estado Recibida o En proceso.'
                            : 'Reportes completados en estado Arreglada.'}
                    </p>
                </div>

                <span className="admin-contador-reportes">
                    {incidenciasMostradas.length}{' '}
                    {incidenciasMostradas.length === 1
                        ? 'reporte'
                        : 'reportes'}
                </span>
            </div>

            {cargando && <p>Cargando incidencias...</p>}

            {error && <p>{error}</p>}

            {!cargando && !error && incidenciasMostradas.length === 0 && (
                <div className="admin-empty-state">
                    <div className="empty-icon">
                        {pestañaActual === 'activas' ? '✓' : '📜'}
                    </div>

                    <h3>
                        {pestañaActual === 'activas'
                            ? edificioSeleccionado === 'todos'
                                ? 'No hay incidencias activas'
                                : `No hay incidencias activas en el edificio ${edificioSeleccionado}`
                            : edificioSeleccionado === 'todos'
                                ? 'No hay incidencias en el historial'
                                : `No hay incidencias resueltas en el edificio ${edificioSeleccionado}`}
                    </h3>

                    <p>
                        {pestañaActual === 'activas'
                            ? 'Todas las incidencias han sido solucionadas o no se han generado nuevos reportes.'
                            : 'Cuando cambies el estado de una incidencia a arreglada, se archivará aquí automáticamente.'}
                    </p>
                </div>
            )}

            {!cargando && incidenciasMostradas.map(incidencia => (
                <AdminIncidenciaCard
                    key={incidencia.id}
                    incidencia={incidencia}
                    estados={estados}
                    setEstados={setEstados}
                    observaciones={observaciones}
                    setObservaciones={setObservaciones}
                    guardando={guardando}
                    guardarCambios={guardarCambios}
                    evidenciaVisible={evidenciaVisible}
                    setEvidenciaVisible={setEvidenciaVisible}
                    historiales={historiales}
                    historialVisible={historialVisible}
                    setHistorialVisible={setHistorialVisible}
                    cargandoHistorial={cargandoHistorial}
                    cargarHistorial={cargarHistorial}
                    formatoEstado={formatoEstado}
                    formatoTipo={formatoTipo}
                    formatoFecha={formatoFecha}
                    onEliminar={() => setReportePendiente(incidencia)}
                />
            ))}

        </section>
    );
}

export default AdminIncidencias;
