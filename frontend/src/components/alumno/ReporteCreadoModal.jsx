
function ReporteCreadoModal({
    reporteCreado,
    navigate,
    rutaRegreso = '/alumno',
    textoBoton = 'Ir a mis reportes'
}) {
    if (!reporteCreado) return null;

    return (
        <div className="cu2-modal-overlay" role="presentation">
            <section
                className="cu2-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="reporte-creado-titulo"
            >
                <div className="cu2-modal-icon cu2-modal-icon-success">
                    ✓
                </div>

                <span className="cu2-modal-eyebrow">
                    CU2 GO · BUAP
                </span>

                <h2 id="reporte-creado-titulo">
                    ¡Reporte creado correctamente!
                </h2>

                <p>
                    Tu incidencia se registró y ya está disponible
                    para su seguimiento.
                </p>

                <div className="cu2-modal-detail">
                    <span>
                        Dispositivo: {reporteCreado.nombre}
                    </span>

                    <span>
                        Código: {reporteCreado.codigo}
                    </span>
                </div>

                <div className="cu2-modal-actions cu2-modal-actions-single">
                    <button
                        type="button"
                        className="cu2-btn-primary"
                        onClick={() =>
                            navigate(rutaRegreso, { replace: true })
                        }
                    >
                        {textoBoton}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default ReporteCreadoModal;
