
function DocenteSummary({
    totalDisponibles,
    totalAsignadas,
    enProceso,
    pendientesValidacion
}) {
    return (
        <section className="admin-resumen">
            <article>
                <h3>Incidencias disponibles</h3>
                <strong>{totalDisponibles}</strong>
            </article>

            <article>
                <h3>Mis asignaciones</h3>
                <strong>{totalAsignadas}</strong>
            </article>

            <article>
                <h3>En proceso</h3>
                <strong>{enProceso}</strong>
            </article>

            <article>
                <h3>Pendientes de validación</h3>
                <strong>{pendientesValidacion}</strong>
            </article>
        </section>
    );
}

export default DocenteSummary;
