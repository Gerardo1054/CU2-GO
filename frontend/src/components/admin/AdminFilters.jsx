
function AdminFilters({
    pestañaActual,
    setPestañaActual,
    incidenciasActivas,
    incidenciasHistorial,
    edificiosDisponibles,
    edificioSeleccionado,
    setEdificioSeleccionado
}) {
    const incidenciasBase =
        pestañaActual === 'activas'
            ? incidenciasActivas
            : incidenciasHistorial;

    return (
        <div className="admin-controles-principales">
            <div className="admin-tabs">
                <button
                    type="button"
                    className={`admin-tab-btn ${
                        pestañaActual === 'activas' ? 'activo' : ''
                    }`}
                    onClick={() => setPestañaActual('activas')}
                >
                    Incidencias activas ({incidenciasActivas.length})
                </button>

                <button
                    type="button"
                    className={`admin-tab-btn ${
                        pestañaActual === 'historial' ? 'activo' : ''
                    }`}
                    onClick={() => setPestañaActual('historial')}
                >
                    Historial de incidencias ({incidenciasHistorial.length})
                </button>
            </div>

            <div className="admin-filtro-edificio">
                <label htmlFor="filtro-edificio">
                    Filtrar por edificio:
                </label>

                <div className="admin-filtro-control">
                    <select
                        id="filtro-edificio"
                        value={edificioSeleccionado}
                        onChange={e => setEdificioSeleccionado(e.target.value)}
                        className="admin-select-edificio"
                    >
                        <option value="todos">
                            Todos los edificios ({incidenciasBase.length})
                        </option>

                        {edificiosDisponibles.map(edificio => {
                            const conteo = incidenciasBase.filter(
                                i => i.edificio === edificio
                            ).length;

                            return (
                                <option key={edificio} value={edificio}>
                                    {edificio} ({conteo})
                                </option>
                            );
                        })}
                    </select>

                    <span className="admin-filtro-badge">
                        {edificioSeleccionado === 'todos'
                            ? 'Mostrando: Todos los edificios'
                            : `Mostrando edificio: ${edificioSeleccionado}`}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default AdminFilters;
