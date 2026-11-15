import { Link } from 'react-router-dom';
import '../styles/ServicioNoDisponible.css';

function ServicioNoDisponible() {
    return (
        <main className="service-error-container">
            <section className="service-error-card">
                <div className="service-error-icon">!</div>

                <span className="service-error-tag">CU2 GO · SERVICIO</span>

                <h1>503</h1>

                <h2>Servicio temporalmente no disponible</h2>

                <p>
                    En este momento no podemos atender tu solicitud.
                    El servicio podría estar en mantenimiento o presentar
                    una interrupción temporal.
                </p>

                <button
                    className="service-error-button"
                    onClick={() => window.location.reload()}
                >
                    Intentar nuevamente
                </button>

                <Link to="/" className="service-error-link">
                    Volver al inicio
                </Link>

                <span className="service-error-footer">
                    CU2 GO · Sistema de gestión de incidencias
                </span>
            </section>
        </main>
    );
}

export default ServicioNoDisponible;