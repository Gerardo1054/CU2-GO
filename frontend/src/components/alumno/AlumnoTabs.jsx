
function AlumnoTabs({
    seccionActual,
    setSeccionActual,
    totalActivas,
    totalHistorial
}) {
    return (
        <div className="alumno-tabs">
            <button
                type="button"
                className={`alumno-tab-btn ${seccionActual === 'activos' ? 'activo' : ''}`}
                onClick={() => setSeccionActual('activos')}
            >
                Reportes activos ({totalActivas})
            </button>

            <button
                type="button"
                className={`alumno-tab-btn ${seccionActual === 'historial' ? 'activo' : ''}`}
                onClick={() => setSeccionActual('historial')}
            >
                Mi historial ({totalHistorial})
            </button>
        </div>
    );
}

export default AlumnoTabs;
