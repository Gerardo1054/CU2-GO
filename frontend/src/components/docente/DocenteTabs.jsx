function DocenteTabs({ seccionActual, setSeccionActual }) {
    const pestañas = [
        { id: 'disponibles', nombre: 'Incidencias disponibles' },
        { id: 'asignadas', nombre: 'Mis asignaciones' },
        { id: 'evaluaciones', nombre: 'Evaluaciones' },
        { id: 'historial', nombre: 'Historial' }
    ];

    return (
        <nav className="docente-tabs">
            {pestañas.map(pestaña => (
                <button
                    key={pestaña.id}
                    type="button"
                    className={`docente-tab ${
                        seccionActual === pestaña.id ? 'activo' : ''
                    }`}
                    onClick={() => setSeccionActual(pestaña.id)}
                >
                    {pestaña.nombre}
                </button>
            ))}
        </nav>
    );
}

export default DocenteTabs;