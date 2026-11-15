
function AdminConfirmModal({
    reportePendiente,
    eliminando,
    onCancelar,
    onConfirmar
}) {
    if (!reportePendiente) return null;

    return (
        <div className="cu2-modal-overlay" role="presentation">
            <section
                className="cu2-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmar-eliminacion-admin"
            >
                <div className="cu2-modal-icon cu2-modal-icon-danger">
                    !
                </div>

                <span className="cu2-modal-eyebrow">
                    CONFIRMACIÓN DE ADMINISTRACIÓN
                </span>

                <h2 id="confirmar-eliminacion-admin">
                    ¿Eliminar este reporte?
                </h2>

                <p>
                    Se eliminará <strong>“{reportePendiente.titulo}”</strong>,
                    junto con su historial, y se liberará el dispositivo
                    asociado. Esta acción no se puede deshacer.
                </p>

                <div className="cu2-modal-detail">
                    <span>
                        Dispositivo: {reportePendiente.recurso_nombre || 'No especificado'}
                    </span>

                    <span>
                        Código: {reportePendiente.recurso_codigo || 'No disponible'}
                    </span>
                </div>

                <div className="cu2-modal-actions">
                    <button
                        type="button"
                        className="cu2-btn-secondary"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="cu2-btn-danger"
                        onClick={onConfirmar}
                        disabled={eliminando !== null}
                    >
                        {eliminando !== null
                            ? 'Eliminando...'
                            : 'Sí, eliminar reporte'}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default AdminConfirmModal;
