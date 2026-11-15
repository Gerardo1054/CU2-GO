
function AdminHeader({ onRefresh, onLogout, cerrandoSesion }) {
    return (
        <header className="admin-header">
            <div>
                <span>BUAP · CU2</span>
                <h1>CU2 GO <strong>Administración</strong></h1>
                <p>Gestión y seguimiento de incidencias del campus.</p>
            </div>

            <div className="admin-header-acciones">
                <button onClick={onRefresh} type="button">
                    Actualizar
                </button>

                <button
                    className="admin-logout"
                    onClick={onLogout}
                    disabled={cerrandoSesion}
                    type="button"
                >
                    {cerrandoSesion
                        ? 'Cerrando sesión...'
                        : '↪ Cerrar sesión'}
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;
