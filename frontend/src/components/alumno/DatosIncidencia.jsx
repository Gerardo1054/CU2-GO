
function DatosIncidencia({
    titulo,
    descripcion,
    categoria,
    tipoProblema,
    tiposProblemaDisponibles = [],
    setTitulo,
    setDescripcion,
    setCategoria,
    setTipoProblema
}) {
    return (
        <>
            <div className="form-group">
                <label htmlFor="titulo">
                    Título de la incidencia
                </label>

                <input
                    id="titulo"
                    type="text"
                    placeholder="Ej. La computadora no enciende"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    maxLength="150"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="descripcion">
                    Descripción del problema
                </label>

                <textarea
                    id="descripcion"
                    placeholder="Explica qué sucede y desde cuándo..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows="5"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="categoria">Categoría</label>

                <select
                    id="categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    <option value="computo">Equipo de cómputo</option>
                    <option value="proyectores">Proyectores</option>
                    <option value="internet">Internet</option>
                    <option value="mobiliario">Mobiliario</option>
                    <option value="electricidad">Electricidad</option>
                    <option value="otros">Otros</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="tipoProblema">
                    Tipo de problema
                </label>

                <select
                    id="tipoProblema"
                    value={tipoProblema}
                    onChange={(e) => setTipoProblema(e.target.value)}
                    disabled={!tiposProblemaDisponibles.length}
                    required
                >
                    <option value="">
                        {!tiposProblemaDisponibles.length
                            ? 'Primero selecciona un recurso en el mapa'
                            : 'Selecciona el tipo de problema'}
                    </option>

                    {tiposProblemaDisponibles.map((problema) => (
                        <option
                            key={problema.valor}
                            value={problema.valor}
                        >
                            {problema.nombre}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}

export default DatosIncidencia;
