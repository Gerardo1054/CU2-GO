import { useNavigate } from 'react-router-dom';

import useDocente from '../hooks/useDocente';

import DocenteHeader from '../components/docente/DocenteHeader';
import DocenteSummary from '../components/docente/DocenteSummary';
import DocenteTabs from '../components/docente/DocenteTabs';
import DocenteIncidencias from '../components/docente/DocenteIncidencias';
import DocenteEvaluaciones from '../components/docente/DocenteEvaluaciones';
import DocenteHistorial from '../components/docente/DocenteHistorial';

import '../styles/Docente.css';

function Docente() {
    const navigate = useNavigate();

    const {
        disponibles,
        asignadas,
        cargando,
        error,
        mensaje,
        cerrandoSesion,
        errorSesion,
        tomandoId,
        seccionActual,
        setSeccionActual,
        emaSeleccionado,
        totalDisponibles,
        totalAsignadas,
        enProceso,
        pendientesValidacion,
        incidenciasMostradas,
        tomarIncidencia,
        cargarIncidencias,
        cerrarSesion
    } = useDocente();

    return (
        <main className="docente-container">
            <DocenteHeader
                emaSeleccionado={emaSeleccionado}
                cerrarSesion={cerrarSesion}
                cerrandoSesion={cerrandoSesion}
            />

            <div className="docente-contenido">
                <div className="docente-bienvenida">
                    <h2>Bienvenido al panel docente</h2>
                    <p>
                        Administra las incidencias de tu EMA y da seguimiento
                        a los reportes asignados.
                    </p>

                    <button
                        type="button"
                        className="docente-btn-nueva-incidencia"
                        onClick={() => navigate('/docente/nueva-incidencia')}
                    >
                        + Crear nueva incidencia
                    </button>
                </div>

                {errorSesion && (
                    <div className="docente-alerta error">{errorSesion}</div>
                )}

                {mensaje && (
                    <div className="docente-alerta exito">{mensaje}</div>
                )}

                {error && (
                    <div className="docente-alerta error">{error}</div>
                )}

                <DocenteSummary
                    totalDisponibles={totalDisponibles}
                    totalAsignadas={totalAsignadas}
                    enProceso={enProceso}
                    pendientesValidacion={pendientesValidacion}
                />

                <section className="docente-seccion">
                    <div className="docente-seccion-titulo">
                        <h2>Gestión de incidencias</h2>
                    </div>

                    <DocenteTabs
                        seccionActual={seccionActual}
                        setSeccionActual={setSeccionActual}
                    />

                    {seccionActual === 'disponibles' && (
                        <DocenteIncidencias
                            incidencias={disponibles}
                            cargando={cargando}
                            seccionActual="disponibles"
                            tomarIncidencia={tomarIncidencia}
                            tomandoId={tomandoId}
                        />
                    )}

                    {seccionActual === 'asignadas' && (
                        <DocenteIncidencias
                            incidencias={incidenciasMostradas}
                            cargando={cargando}
                            seccionActual="asignadas"
                            tomarIncidencia={tomarIncidencia}
                            tomandoId={tomandoId}
                        />
                    )}

                    {seccionActual === 'evaluaciones' && (
                        <DocenteEvaluaciones
                            incidencias={asignadas}
                            cargando={cargando}
                            onActualizada={cargarIncidencias}
                        />
                    )}

                    {seccionActual === 'historial' && (
                        <DocenteHistorial
                            incidencias={asignadas}
                            cargando={cargando}
                        />
                    )}
                </section>
            </div>
        </main>
    );
}

export default Docente;