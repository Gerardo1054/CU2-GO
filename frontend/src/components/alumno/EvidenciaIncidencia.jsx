
function EvidenciaIncidencia({
    evidencia,
    vistaPrevia,
    seleccionarEvidencia,
    quitarEvidencia
}) {
    return (
        <div className="form-group evidencia-group">
            <label htmlFor="evidencia">
                Evidencia del problema
            </label>

            <p>
                Adjunta una fotografía o un video de máximo
                15 segundos.
            </p>

            <input
                id="evidencia"
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                onChange={seleccionarEvidencia}
            />

            {vistaPrevia && evidencia && (
                <div className="evidencia-preview">
                    {evidencia.type.startsWith('image/') ? (
                        <img
                            src={vistaPrevia}
                            alt="Vista previa de evidencia"
                        />
                    ) : (
                        <video src={vistaPrevia} controls />
                    )}

                    <button
                        type="button"
                        className="quitar-evidencia"
                        onClick={quitarEvidencia}
                    >
                        Quitar archivo
                    </button>

                    <small>{evidencia.name}</small>
                </div>
            )}
        </div>
    );
}

export default EvidenciaIncidencia;
