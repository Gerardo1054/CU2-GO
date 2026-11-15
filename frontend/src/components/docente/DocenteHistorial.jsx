import { useState } from 'react';
import api from '../../services/api';

function DocenteHistorial({ incidencias, cargando }) {
    const [incidenciaAbierta, setIncidenciaAbierta] = useState(null);
    const [seguimientos, setSeguimientos] = useState({});
    const [cargandoSeguimiento, setCargandoSeguimiento] = useState(null);
    const [error, setError] = useState('');

    const consultarSeguimiento = async (id) => {
        if (incidenciaAbierta === id) {
            setIncidenciaAbierta(null);
            return;
        }

        setIncidenciaAbierta(id);
        setError('');

        if (seguimientos[id]) return;

        try {
            setCargandoSeguimiento(id);

            const respuesta = await api.get(
                `/docente/incidencias/${id}/seguimiento`
            );

            setSeguimientos(actuales => ({
                ...actuales,
                [id]: respuesta.data
            }));
        } catch (err) {
            setError(
                err.response?.data?.mensaje ||
                'No se pudo consultar el seguimiento.'
            );
        } finally {
            setCargandoSeguimiento(null);
        }
    };

    if (cargando) {
        return <div className="docente-mensaje-vacio">Cargando historial...</div>;
    }

    if (incidencias.length === 0) {
        return (
            <div className="docente-mensaje-vacio">
                <h3>Tu historial está vacío</h3>
                <p>Las incidencias que tomes aparecerán aquí.</p>
            </div>
        );
    }

    return (
        <section className="docente-historial-lista">
            {error && <div className="docente-alerta error">{error}</div>}

            {incidencias.map(incidencia => (
                <article className="docente-incidencia-card" key={incidencia.id}>
                    <div className="docente-incidencia-contenido">
                        <div className="docente-incidencia-encabezado">
                            <span className={`docente-estado ${incidencia.estado}`}>
                                {incidencia.estado.replaceAll('_', ' ')}
                            </span>
                            <small>Reporte #{incidencia.id}</small>
                        </div>

                        <h3>{incidencia.titulo}</h3>
                        <p>{incidencia.descripcion}</p>

                        <div className="docente-incidencia-datos">
                            <div className="docente-dato">
                                <span>Salón</span>
                                <strong>{incidencia.salon}</strong>
                            </div>
                            <div className="docente-dato">
                                <span>Edificio</span>
                                <strong>{incidencia.edificio}</strong>
                            </div>
                            <div className="docente-dato">
                                <span>Fecha de reporte</span>
                                <strong>
                                    {new Date(incidencia.fecha_creacion).toLocaleString('es-MX')}
                                </strong>
                            </div>
                            <div className="docente-dato">
                                <span>Recurso</span>
                                <strong>{incidencia.recurso_nombre || 'No especificado'}</strong>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="docente-btn-tomar"
                            onClick={() => consultarSeguimiento(incidencia.id)}
                        >
                            {incidenciaAbierta === incidencia.id
                                ? 'Ocultar movimientos'
                                : 'Consultar movimientos'}
                        </button>

                        {incidenciaAbierta === incidencia.id && (
                            <div className="docente-historial-detalle">
                                <h4>Seguimiento de la incidencia</h4>

                                {cargandoSeguimiento === incidencia.id ? (
                                    <p>Cargando movimientos...</p>
                                ) : (seguimientos[incidencia.id] || []).length === 0 ? (
                                    <p>Aún no hay observaciones registradas.</p>
                                ) : (
                                    seguimientos[incidencia.id].map(movimiento => (
                                        <div
                                            className="docente-historial-movimiento"
                                            key={movimiento.id}
                                        >
                                            <strong>
                                                {movimiento.estado_anterior || 'Registro inicial'}
                                                {' → '}
                                                {movimiento.estado_nuevo || 'Sin cambio'}
                                            </strong>

                                            <p>{movimiento.observacion}</p>

                                            <small>
                                                {movimiento.realizado_por || 'Usuario'}
                                                {' · '}
                                                {new Date(movimiento.fecha).toLocaleString('es-MX')}
                                            </small>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </article>
            ))}
        </section>
    );
}

export default DocenteHistorial;