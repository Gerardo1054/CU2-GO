
import { Link } from 'react-router-dom';

function Sidebar({
    menuAbierto,
    setMenuAbierto,
    seccionActual,
    setSeccionActual,
    totalActivas,
    totalHistorial,
    cerrandoSesion,
    cerrarSesion,
    actualizando,
    actualizarIncidencias,
}) {
    return (
        <aside className="sidebar">
            <div className="sidebar-topbar">
                <div className="sidebar-brand">
                    <h2>CU2 <span>GO</span></h2>
                    <p>BUAP · CU2</p>
                </div>

                <button
                    type="button"
                    className="sidebar-mobile-toggle"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    aria-label="Menú"
                    aria-expanded={menuAbierto}
                >
                    ☰
                </button>
            </div>

            <nav className={`sidebar-nav ${menuAbierto ? 'menu-abierto' : ''}`}>
                <a
                    href="#inicio"
                    className="nav-item active"
                    onClick={() => setMenuAbierto(false)}
                >
                    <span>⌂</span> Inicio
                </a>

                <a
                    href="#reportes"
                    className={`nav-item ${seccionActual === 'activos' ? 'activo-nav' : ''}`}
                    onClick={() => {
                        setSeccionActual('activos');
                        setMenuAbierto(false);
                    }}
                >
                    <span>▤</span> Mis reportes ({totalActivas})
                </a>

                <a
                    href="#reportes"
                    className={`nav-item ${seccionActual === 'historial' ? 'activo-nav' : ''}`}
                    onClick={() => {
                        setSeccionActual('historial');
                        setMenuAbierto(false);
                    }}
                >
                    Mi historial ({totalHistorial})
                </a>
                <button
                    type="button"
                    className="nav-item refresh-item"
                    onClick={() => {
                        setMenuAbierto(false);
                        actualizarIncidencias();
                    }}
                    disabled={actualizando}
                >
                    <span>{actualizando ? '◌' : '↻'}</span>
                    {actualizando ? 'Actualizando...' : 'Actualizar reportes'}
                </button>
                <Link
                    to="/nueva-incidencia"
                    className="nav-item"
                    onClick={() => setMenuAbierto(false)}
                >
                    <span>＋</span> Nueva incidencia
                </Link>

                <button
                    className="sidebar-logout"
                    onClick={() => {
                        setMenuAbierto(false);
                        cerrarSesion();
                    }}
                    disabled={cerrandoSesion}
                >
                    <span>↪</span>
                    {cerrandoSesion ? 'Cerrando sesión...' : 'Cerrar sesión'}
                </button>
            </nav>

            <div className="sidebar-bottom">
                <div className="user-avatar">A</div>
                <div>
                    <strong>Alumno</strong>
                    <p>Estudiante BUAP</p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
