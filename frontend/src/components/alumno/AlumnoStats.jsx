
function AlumnoStats({
    totalActivas,
    enProceso,
    arregladas
}) {
    return (
        <section className="stats-grid">

            <article className="stat-card">
                <div className="stat-icon blue">▤</div>
                <div>
                    <p>Reportes activos</p>
                    <h2>{totalActivas}</h2>
                    <span>Incidencias pendientes</span>
                </div>
            </article>

            <article className="stat-card">
                <div className="stat-icon orange">◷</div>
                <div>
                    <p>En proceso</p>
                    <h2>{enProceso}</h2>
                    <span>Incidencias en revisión</span>
                </div>
            </article>

            <article className="stat-card">
                <div className="stat-icon green">✓</div>
                <div>
                    <p>Mi historial</p>
                    <h2>{arregladas}</h2>
                    <span>Incidencias solucionadas</span>
                </div>
            </article>

        </section>
    );
}

export default AlumnoStats;
