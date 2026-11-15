
import { useState, useEffect } from 'react';
import api from '../../services/api';

function DocenteEvaluaciones({ incidencias, cargando, onActualizada }) {
    const [observaciones, setObservaciones] = useState({});
    const [procesandoId, setProcesandoId] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        if (!mensaje && !error) return;

        const temporizador = setTimeout(() => {
            setMensaje('');
            setError('');
        }, 3000);

        return () => clearTimeout(temporizador);
    }, [mensaje, error]);

    const actualizarEstado = async (incidencia) => {
        const observacion = observaciones[incidencia.id]?.trim();

        if (!observacion) {
            setError(`Escribe una observación para "${incidencia.titulo}".`);
            setMensaje('');
            return;
        }

        const nuevoEstado = incidencia.estado === 'recibida'
            ? 'en_proceso'
            : 'pendiente_validacion';

        try {
            setProcesandoId(incidencia.id);
            setError('');
            setMensaje('');

            const respuesta = await api.put(
                `/docente/incidencias/${incidencia.id}/estado`,
                {
                    estado: nuevoEstado,
                    observacion
                }
            );

            setMensaje(
                respuesta.data.mensaje ||
                'Incidencia actualizada correctamente.'
            );

            setObservaciones(actuales => ({
                ...actuales,
                [incidencia.id]: ''
            }));

            await onActualizada();
        } catch (err) {
            setError(
                err.response?.data?.mensaje ||
                'No se pudo actualizar la incidencia.'
            );
        } finally {
            setProcesandoId(null);
        }
    };

    if (cargando) {
        return <div className="docente-mensaje-vacio">Cargando evaluaciones...</div>;
    }

    if (incidencias.length === 0) {
        return (
            <div className="docente-mensaje-vacio">
                <h3>No tienes incidencias asignadas</h3>
                <p>Cuando tomes una incidencia, podrás darle seguimiento desde esta sección.</p>
            </div>
        );
    }

    return (
        <section className="docente-incidencias-lista">

            {(mensaje || error) && (
                <div className={`docente-toast ${error ? 'error' : 'exito'}`}>
                    <span className="docente-toast-icono">
                        {error ? '!' : '✓'}
                    </span>
                    <span>{error || mensaje}</span>
                </div>
            )}

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
                                <span>Recurso</span>
                                <strong>{incidencia.recurso_nombre || 'No especificado'}</strong>
                            </div>
                        </div>

                        {incidencia.estado === 'pendiente_validacion' ? (
                            <div className="docente-evaluacion-espera">
                                <strong>Enviada a validación</strong>
                                <p>La incidencia está pendiente de revisión por el administrador.</p>
                            </div>
                        ) : incidencia.estado === 'arreglada' ? (
                            <div className="docente-evaluacion-completa">
                                Esta incidencia ya fue marcada como arreglada.
                            </div>
                        ) : (
                            <div className="docente-evaluacion-form">
                                <label htmlFor={`observacion-${incidencia.id}`}>
                                    Observaciones del trabajo realizado
                                </label>

                                <textarea
                                    id={`observacion-${incidencia.id}`}
                                    rows="3"
                                    placeholder="Describe la revisión o reparación realizada..."
                                    value={observaciones[incidencia.id] || ''}
                                    onChange={e => setObservaciones(actuales => ({
                                        ...actuales,
                                        [incidencia.id]: e.target.value
                                    }))}
                                />

                                <button
                                    type="button"
                                    className="docente-btn-tomar"
                                    disabled={procesandoId === incidencia.id}
                                    onClick={() => actualizarEstado(incidencia)}
                                >
                                    {procesandoId === incidencia.id
                                        ? 'Guardando...'
                                        : incidencia.estado === 'recibida'
                                            ? 'Iniciar atención'
                                            : 'Enviar a validación'}
                                </button>
                            </div>
                        )}
                    </div>
                </article>
            ))}
        </section>
    );
}

export default DocenteEvaluaciones;
