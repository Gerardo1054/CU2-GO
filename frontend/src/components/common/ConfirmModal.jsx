
function ConfirmModal({
    reporte,
    eliminando,
    onCancelar,
    onConfirmar
}) {
    if (!reporte) return null;

    return (
        <div className="cu2-modal-overlay" role="presentation">
            <section
                className="cu2-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmar-eliminacion-alumno"
            >
                <div className="cu2-modal-icon cu2-modal-icon-danger">!</div>

                <span className="cu2-modal-eyebrow">CONFIRMACIÓN</span>

                <h2 id="confirmar-eliminacion-alumno">
                    ¿Eliminar este reporte?
                </h2>

                <p>
                    Estás por eliminar <strong>“{reporte.titulo}”</strong>.
                    Esta acción no se puede deshacer.
                </p>

                <div className="cu2-modal-actions">
                    <button
                        type="button"
                        className="cu2-btn-secondary"
                        onClick={onCancelar}
                        disabled={eliminando}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="cu2-btn-danger"
                        onClick={onConfirmar}
                        disabled={eliminando}
                    >
                        {eliminando ? 'Eliminando...' : 'Sí, eliminar reporte'}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default ConfirmModal;
