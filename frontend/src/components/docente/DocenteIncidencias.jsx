
import DocenteIncidenciaCard from './DocenteIncidenciaCard';

function DocenteIncidencias({
    incidencias,
    cargando,
    seccionActual,
    tomarIncidencia,
    tomandoId
}) {
    const esDisponible = seccionActual === 'disponibles';

    if (cargando) {
        return (
            <div className="docente-mensaje-vacio">
                Cargando incidencias...
            </div>
        );
    }

    if (incidencias.length === 0) {
        return (
            <div className="docente-mensaje-vacio">
                <h3>
                    {esDisponible
                        ? 'No hay incidencias disponibles'
                        : 'Aún no tienes incidencias asignadas'}
                </h3>

                <p>
                    {esDisponible
                        ? 'Cuando se registren nuevas incidencias en esta EMA, aparecerán aquí.'
                        : 'Las incidencias que tomes aparecerán en esta sección.'}
                </p>
            </div>
        );
    }

    return (
        <section className="docente-incidencias-lista">
            {incidencias.map(incidencia => (
                <DocenteIncidenciaCard
                    key={incidencia.id}
                    incidencia={incidencia}
                    esDisponible={esDisponible}
                    tomarIncidencia={tomarIncidencia}
                    tomandoId={tomandoId}
                />
            ))}
        </section>
    );
}

export default DocenteIncidencias;
