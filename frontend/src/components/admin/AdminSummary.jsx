
function AdminSummary({ incidencias }) {
    const recibidas = incidencias.filter(
        i => i.estado === 'recibida'
    ).length;

    const enProceso = incidencias.filter(
        i => i.estado === 'en_proceso'
    ).length;

    const arregladas = incidencias.filter(
        i => i.estado === 'arreglada'
    ).length;

    return (
        <section className="admin-resumen">
            <article>
                <h3>Total de incidencias</h3>
                <strong>{incidencias.length}</strong>
            </article>

            <article>
                <h3>Recibidas</h3>
                <strong>{recibidas}</strong>
            </article>

            <article>
                <h3>En proceso</h3>
                <strong>{enProceso}</strong>
            </article>

            <article>
                <h3>Arregladas (Historial)</h3>
                <strong>{arregladas}</strong>
            </article>
        </section>
    );
}

export default AdminSummary;
