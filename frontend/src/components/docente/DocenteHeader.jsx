
function DocenteHeader({
    emaSeleccionado,
    cerrarSesion,
    cerrandoSesion
}) {
    return (
        <header className="admin-header">
            <div>
                <span>BUAP · CU2</span>

                <h1>
                    CU2 GO <strong>Docente</strong>
                </h1>

                <p>
                    Gestión y seguimiento de incidencias del campus.
                </p>

                <p className="docente-ema-header">
                    EMA seleccionada: <strong>{emaSeleccionado || 'Sin seleccionar'}</strong>
                </p>
            </div>

            <div className="admin-header-acciones">
                <button
                    className="admin-logout"
                    onClick={cerrarSesion}
                    disabled={cerrandoSesion}
                    type="button"
                >
                    {cerrandoSesion ? 'Cerrando sesión...' : 'Cerrar sesión'}
                </button>
            </div>
        </header>
    );
}

export default DocenteHeader;
