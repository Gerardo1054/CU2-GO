
import IncidenciaCard from './IncidenciaCard';

function AlumnoReports({
    cargando,
    seccionActual,
    incidenciasMostradas,
    evidenciaVisible,
    toggleEvidencia,
    setReportePendiente
}) {
    return (
        <section className="reports-section" id="reportes">

            <div className="section-heading">
                <div>
                    <h2>
                        {seccionActual === 'activos'
                            ? 'Mis reportes activos'
                            : 'Mi historial de incidencias'}
                    </h2>

                    <p>
                        {seccionActual === 'activos'
                            ? 'Consulta el estado de tus reportes pendientes o en proceso.'
                            : 'Historial de tus incidencias que ya han sido solucionadas.'}
                    </p>
                </div>

                <span className="report-counter">
                    {incidenciasMostradas.length}{' '}
                    {incidenciasMostradas.length === 1
                        ? 'reporte'
                        : 'reportes'}
                </span>
            </div>

            {cargando ? (
                <div className="empty-reports">
                    <p>Cargando tus incidencias...</p>
                </div>
            ) : incidenciasMostradas.length === 0 ? (
                <div className="empty-reports">
                    <div className="empty-icon">
                        {seccionActual === 'activos' ? '✓' : '📜'}
                    </div>

                    <h3>
                        {seccionActual === 'activos'
                            ? 'No tienes reportes activos pendientes'
                            : 'Aún no tienes reportes en tu historial'}
                    </h3>

                    <p>
                        {seccionActual === 'activos'
                            ? 'Cuando registres una incidencia, podrás consultar aquí su estado y seguimiento.'
                            : 'Cuando el personal administrativo solucione una de tus incidencias, se archivará aquí automáticamente.'}
                    </p>
                </div>
            ) : (
                <div className="reports-list">
                    {incidenciasMostradas.map(incidencia => (
                        <IncidenciaCard
                            key={incidencia.id}
                            incidencia={incidencia}
                            seccionActual={seccionActual}
                            evidenciaVisible={!!evidenciaVisible[incidencia.id]}
                            onToggleEvidencia={toggleEvidencia}
                            onEliminar={setReportePendiente}
                        />
                    ))}
                </div>
            )}

        </section>
    );
}

export default AlumnoReports;
