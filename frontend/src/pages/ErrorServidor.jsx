import { Link } from 'react-router-dom';
import '../styles/ErrorServidor.css';

function ErrorServidor() {
    const parametros = new URLSearchParams(window.location.search);
    const codigo = parametros.get('codigo');

    const es502 = codigo === '502';

    const titulo = es502
        ? 'Respuesta inválida del servidor'
        : 'El servidor tardó demasiado';

    const descripcion = es502
        ? 'El servidor recibió una respuesta incorrecta de otro servicio y no pudo completar tu solicitud.'
        : 'El servidor no respondió dentro del tiempo esperado. Puedes intentar nuevamente en unos momentos.';

    return (
        <main className="gateway-error-container">
            <section className="gateway-error-card">
                <div className="gateway-error-icon">!</div>

                <span className="gateway-error-tag">
                    CU2 GO · ERROR DE CONEXIÓN
                </span>

                <h1>{codigo || '500'}</h1>

                <h2>{titulo}</h2>

                <p>{descripcion}</p>

                <button
                    className="gateway-error-button"
                    onClick={() => window.location.reload()}
                >
                    Intentar nuevamente
                </button>

                <Link to="/" className="gateway-error-link">
                    Volver al inicio
                </Link>

                <span className="gateway-error-footer">
                    CU2 GO · Sistema de gestión de incidencias
                </span>
            </section>
        </main>
    );
}

export default ErrorServidor;
