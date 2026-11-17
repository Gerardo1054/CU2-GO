import { useState } from 'react';
import { API_BASE_URL } from '../../services/api';
import api from '../../services/api';


function IncidenciaCard({
    incidencia,
    seccionActual,
    evidenciaVisible,
    onToggleEvidencia,
    onEliminar
}) {

    const [seguimientoAbierto, setSeguimientoAbierto] = useState(false);
    const [seguimiento, setSeguimiento] = useState([]);
    const [cargandoSeguimiento, setCargandoSeguimiento] = useState(false);
    const [errorSeguimiento, setErrorSeguimiento] = useState('');

    const toggleSeguimiento = async () => {
        if (seguimientoAbierto) {
            setSeguimientoAbierto(false);
            return;
        }

        setSeguimientoAbierto(true);

        if (seguimiento.length > 0) return;

        try {
            setCargandoSeguimiento(true);
            setErrorSeguimiento('');

            const respuesta = await api.get(
                `/incidencias/${incidencia.id}/seguimiento`
            );

            setSeguimiento(respuesta.data);

        } catch (error) {
            setErrorSeguimiento(
                error.response?.data?.mensaje ||
                'No se pudo cargar el seguimiento.'
            );
            console.error(error);

        } finally {
            setCargandoSeguimiento(false);
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleString('es-MX', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };
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
                    {incidencia.estado === 'pendiente_validacion' && '● Pendiente de validación'}
                    {incidencia.estado === 'arreglada' && '✓ Solucionada'}
                    </span>
                </div>
<div className="seguimiento-reporte">
    <button
        type="button"
        className="seguimiento-toggle"
        onClick={toggleSeguimiento}
        aria-expanded={seguimientoAbierto}
    >
        <span>Ver seguimiento de la incidencia</span>
        <span>{seguimientoAbierto ? '−' : '+'}</span>
    </button>

    {seguimientoAbierto && (
        <div className="seguimiento-contenido">
            {cargandoSeguimiento ? (
                <p>Cargando seguimiento...</p>
            ) : errorSeguimiento ? (
                <p className="seguimiento-error">
                    {errorSeguimiento}
                </p>
            ) : seguimiento.length === 0 ? (
                <p>Aún no hay movimientos registrados.</p>
            ) : (
                <div className="seguimiento-lista">
                    {seguimiento.map(item => (
                        <article
                            className="seguimiento-item"
                            key={item.id}
                        >
                            <div className="seguimiento-item-header">
                                <strong>
                                    {item.realizado_por || 'Sistema'}
                                </strong>

                                <span>{item.rol}</span>
                            </div>

                            <p className="seguimiento-fecha">
                                {formatearFecha(item.fecha)}
                            </p>

                            {(item.estado_anterior || item.estado_nuevo) && (
                                <p className="seguimiento-estados">
                                    Estado: {item.estado_anterior || 'Inicial'}
                                    {' → '}
                                    {item.estado_nuevo || 'Sin especificar'}
                                </p>
                            )}

                            {item.observacion && (
                                <div className="seguimiento-observacion">
                                    <strong>Observación:</strong>
                                    <p>{item.observacion}</p>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </div>
    )}
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
                                    src={`${API_BASE_URL}/api/incidencias/${incidencia.id}/evidencia`}
                                    alt="Evidencia de la incidencia"
                                    className="evidencia-imagen"
                                />
                            ) : (
                                <video
                                    src={`${API_BASE_URL}/api/incidencias/${incidencia.id}/evidencia`}
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
