import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

function NotFound() {
    return (
        <main className="not-found-container">
            <section className="not-found-card">
                <div className="not-found-icon">?</div>

                <span className="not-found-tag">CU2 GO · ERROR</span>

                <h1>404</h1>

                <h2>Página no encontrada</h2>

                <p>
                    Lo sentimos, la página que estás buscando no existe,
                    fue movida o la dirección es incorrecta.
                </p>

                <Link to="/" className="not-found-button">
                    Volver al inicio
                </Link>

                <span className="not-found-footer">
                    CU2 GO · Sistema de gestión de incidencias
                </span>
            </section>
        </main>
    );
}

export default NotFound;