import { API_BASE_URL } from '../../services/api';

function AdminIncidenciaCard({
    incidencia,
    estados,
    setEstados,
    observaciones,
    setObservaciones,
    guardando,
    guardarCambios,
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
    onEliminar
}) {
    const id = incidencia.id;

    const esDocente = incidencia.reportante_rol === 'docente';

    const nombreReportante =
        incidencia.reportante ||
        incidencia.alumno ||
        'No especificado';

    const tipoReportante = esDocente ? 'Docente' : 'Alumno';

    return (
        <article
            className={`admin-incidencia ${
                incidencia.estado === 'arreglada'
                    ? 'admin-incidencia-arreglada'
                    : ''
            }`}
        >
            <div className="admin-card-header">
                <h3>{incidencia.titulo}</h3>

                <span className={`estado-badge estado-${incidencia.estado}`}>
                    {incidencia.estado === 'recibida' && '● Recibida'}
                    {incidencia.estado === 'en_proceso' && '● En proceso'}
                    {incidencia.estado === 'arreglada' && '✓ Arreglada'}
                </span>
            </div>

            <p>
                <strong>{tipoReportante}:</strong> {nombreReportante}
            </p>

            <p>
                <strong>Ubicación:</strong> {incidencia.edificio} · {incidencia.salon}
            </p>

            <p>
                <strong>Categoría:</strong> {incidencia.categoria}
            </p>

            <div className="admin-recurso">
                <span>DISPOSITIVO REPORTADO</span>

                <h4>{formatoTipo(incidencia.recurso_tipo)}</h4>

                <p>
                    <strong>Nombre:</strong>{' '}
                    {incidencia.recurso_nombre || 'No especificado'}
                </p>

                <p>
                    <strong>Código:</strong>{' '}
                    {incidencia.recurso_codigo || 'No disponible'}
                </p>
            </div>

            <p>{incidencia.descripcion}</p>

            <p>
                <strong>Fecha del reporte:</strong>{' '}
                {formatoFecha(incidencia.fecha_creacion)}
            </p>

            {incidencia.evidencia_nombre && (
                <div className="admin-evidencia">
                    <div className="admin-seccion-toggle">
                        <div>
                            <strong>Evidencia adjunta</strong>
                            <p>{incidencia.evidencia_nombre}</p>
                        </div>

                        <button
                            type="button"
                            className="admin-toggle"
                            onClick={() =>
                                setEvidenciaVisible(prev => ({
                                    ...prev,
                                    [id]: !prev[id]
                                }))
                            }
                        >
                            {evidenciaVisible[id]
                                ? 'Ocultar evidencia'
                                : 'Mostrar evidencia'}
                        </button>
                    </div>

                    {evidenciaVisible[id] && (
                        incidencia.evidencia_tipo === 'imagen' ? (
                            <img
                                src={`${API_BASE_URL}/api/incidencias/${id}/evidencia`}
                                alt="Evidencia de la incidencia"
                                className="admin-evidencia-imagen"
                            />
                        ) : (
                            <video
                                src={`${API_BASE_URL}/api/incidencias/${id}/evidencia`}
                                controls
                                className="admin-evidencia-video"
                            />
                        )
                    )}
                </div>
            )}

            <div className="admin-gestion">
                <h4>Gestionar incidencia</h4>

                <p>
                    <strong>Estado actual:</strong>{' '}
                    {formatoEstado(incidencia.estado)}
                </p>

                <label htmlFor={`estado-${id}`}>
                    Cambiar estado
                </label>

                <select
                    id={`estado-${id}`}
                    value={estados[id] || incidencia.estado}
                    onChange={e =>
                        setEstados(prev => ({
                            ...prev,
                            [id]: e.target.value
                        }))
                    }
                >
                    <option value="recibida">Recibida</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="arreglada">Arreglada</option>
                </select>

                <label htmlFor={`observacion-${id}`}>
                    Observación del administrador
                </label>

                <textarea
                    id={`observacion-${id}`}
                    placeholder="Describe las acciones realizadas o el motivo del cambio..."
                    value={observaciones[id] || ''}
                    onChange={e =>
                        setObservaciones(prev => ({
                            ...prev,
                            [id]: e.target.value
                        }))
                    }
                />

                <button
                    type="button"
                    className="admin-guardar"
                    onClick={() => guardarCambios(id)}
                    disabled={guardando === id}
                >
                    {guardando === id ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </div>

            <div className="admin-historial">
                <button
                    type="button"
                    className="admin-toggle"
                    onClick={() => {
                        const mostrar = !historialVisible[id];

                        setHistorialVisible(prev => ({
                            ...prev,
                            [id]: mostrar
                        }));

                        if (mostrar && !historiales[id]) {
                            cargarHistorial(id);
                        }
                    }}
                    disabled={cargandoHistorial === id}
                >
                    {cargandoHistorial === id
                        ? 'Cargando historial...'
                        : historialVisible[id]
                            ? 'Ocultar historial'
                            : 'Mostrar historial'}
                </button>

                {historialVisible[id] && (
                    historiales[id] ? (
                        <div className="admin-historial-contenido">
                            <h4>Historial de seguimiento</h4>

                            {historiales[id].length === 0 ? (
                                <p>Aún no hay movimientos registrados.</p>
                            ) : (
                                historiales[id].map((registro, index) => (
                                    <div
                                        className="admin-historial-item"
                                        key={registro.id || index}
                                    >
                                        <p>
                                            <strong>Administrador:</strong>{' '}
                                            {registro.administrador}
                                        </p>

                                        <p>
                                            <strong>Estado anterior:</strong>{' '}
                                            {formatoEstado(registro.estado_anterior)}
                                        </p>

                                        <p>
                                            <strong>Estado nuevo:</strong>{' '}
                                            {formatoEstado(registro.estado_nuevo)}
                                        </p>

                                        <p>
                                            <strong>Observación:</strong>{' '}
                                            {registro.observacion}
                                        </p>

                                        <p>
                                            <strong>Fecha:</strong>{' '}
                                            {formatoFecha(registro.fecha)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <p className="admin-cargando-historial">
                            Cargando o consultando historial...
                        </p>
                    )
                )}
            </div>

            <div className="admin-eliminar-contenedor">
                <button
                    type="button"
                    className="admin-eliminar"
                    onClick={onEliminar}
                >
                    Eliminar reporte
                </button>

                <small>Esta acción no se puede deshacer.</small>
            </div>
        </article>
    );
}

export default AdminIncidenciaCard;