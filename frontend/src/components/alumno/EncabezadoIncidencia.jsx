
import { Link } from 'react-router-dom';

function EncabezadoIncidencia({ rutaRegreso = '/alumno' }) {
    return (
        <>
            <header className="incidencia-header">
                <Link to={rutaRegreso} className="back-link">
                    Volver al panel
                </Link>

                <span>CU2 GO · BUAP</span>
            </header>

            <div className="incidencia-heading">
                <span className="incidencia-tag">NUEVO REPORTE</span>

                <h1>Registrar incidencia</h1>

                <p>
                    Selecciona el espacio y localiza en el mapa
                    el recurso que presenta el problema.
                </p>
            </div>
        </>
    );
}

export default EncabezadoIncidencia;
