
function IncidenciaCard({
    incidencia,
    seccionActual,
    evidenciaVisible,
    onToggleEvidencia,
    onEliminar
}) {
    return (
        <article
            className={`stat-card ${incidencia.estado === 'arreglada' ? 'reporte-card-arreglado' : ''}`}
        >
            <div className="reporte-contenido">
                <h3 className="reporte-titulo">
                    {incidencia.titulo}
                </h3>

                <p className="reporte-lugar">
                    📍 {incidencia.edificio} · {incidencia.salon}
                </p>

                {incidencia.recurso_codigo && (
                    <p className="reporte-recurso">
                        Dispositivo: {incidencia.recurso_codigo}
                        {incidencia.recurso_nombre
                            ? ` · ${incidencia.recurso_nombre}`
                            : ''}
                    </p>
                )}

                <div className="reporte-estado">
                    <span className={`estado-badge estado-${incidencia.estado}`}>
                        {incidencia.estado === 'recibida' && '● Recibida'}
                        {incidencia.estado === 'en_proceso' && '● En proceso'}
                        {incidencia.estado === 'arreglada' && '✓ Solucionada'}
                    </span>
                </div>

                <div className="reporte-descripcion">
                    <strong>Descripción del problema</strong>
                    <p>{incidencia.descripcion}</p>
                </div>

                {incidencia.evidencia_nombre && (
                    <div className="evidencia-reporte">
                        <div className="admin-seccion-toggle">
                            <div>
                                <p>
                                    <strong>Evidencia:</strong> {incidencia.evidencia_nombre}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="alumno-toggle"
                                onClick={() => onToggleEvidencia(incidencia.id)}
                            >
                                {evidenciaVisible
                                    ? 'Ocultar evidencia'
                                    : 'Mostrar evidencia'}
                            </button>
                        </div>

                        {evidenciaVisible && (
                            incidencia.evidencia_tipo === 'imagen' ? (
                                <img
                                    src={`http://localhost:3000/api/incidencias/${incidencia.id}/evidencia`}
                                    alt="Evidencia de la incidencia"
                                    className="evidencia-imagen"
                                />
                            ) : (
                                <video
                                    src={`http://localhost:3000/api/incidencias/${incidencia.id}/evidencia`}
                                    controls
                                    className="evidencia-video"
                                />
                            )
                        )}
                    </div>
                )}

                {seccionActual === 'activos' && incidencia.estado === 'recibida' && (
                    <button
                        type="button"
                        className="eliminar-reporte"
                        onClick={() => onEliminar(incidencia)}
                    >
                        Eliminar reporte
                    </button>
                )}
            </div>
        </article>
    );
}

export default IncidenciaCard;
