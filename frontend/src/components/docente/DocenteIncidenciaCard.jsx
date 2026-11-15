
function DocenteIncidenciaCard({
    incidencia,
    esDisponible,
    tomarIncidencia,
    tomandoId
}) {
    const fecha = incidencia.fecha_creacion
        ? new Date(incidencia.fecha_creacion).toLocaleDateString('es-MX')
        : 'Sin fecha';

    const estado = (incidencia.estado || 'Sin estado')
        .replaceAll('_', ' ');

    const nombreReportante =
        incidencia.creado_por ||
        incidencia.alumno ||
        'No especificado';

    const tipoReportante =
        incidencia.reportante_rol === 'docente'
            ? 'Docente'
            : 'Alumno';

    return (
        <article className="docente-incidencia-card">
            <div className="docente-incidencia-contenido">

                <div className="docente-incidencia-encabezado">
                    <h3>
                        {incidencia.titulo || `Incidencia #${incidencia.id}`}
                    </h3>

                    <span className={`docente-estado ${incidencia.estado || ''}`}>
                        {estado}
                    </span>
                </div>

                <p className="docente-incidencia-descripcion">
                    {incidencia.descripcion || 'Sin descripción disponible.'}
                </p>

                <div className="docente-incidencia-datos">

                    <div className="docente-dato">
                        <span>Salón</span>
                        <strong>
                            {incidencia.salon || 'No especificado'}
                        </strong>
                    </div>

                    <div className="docente-dato">
                        <span>Recurso</span>
                        <strong>
                            {incidencia.recurso_nombre || 'No especificado'}
                        </strong>
                    </div>

                    <div className="docente-dato">
                        <span>Reportó ({tipoReportante})</span>
                        <strong>{nombreReportante}</strong>
                    </div>

                    <div className="docente-dato">
                        <span>Fecha del reporte</span>
                        <strong>{fecha}</strong>
                    </div>

                </div>
            </div>

            {esDisponible && (
                <button
                    type="button"
                    className="docente-btn-tomar"
                    onClick={() => tomarIncidencia(incidencia.id)}
                    disabled={tomandoId === incidencia.id}
                >
                    {tomandoId === incidencia.id
                        ? 'Asignando...'
                        : 'Tomar incidencia'}
                </button>
            )}
        </article>
    );
}

export default DocenteIncidenciaCard;
