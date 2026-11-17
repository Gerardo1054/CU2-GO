
import { useState } from 'react';

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
    const [mostrarAyuda, setMostrarAyuda] = useState(false);

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
                <div className="tipo-problema-label">
                    <label htmlFor="tipoProblema">
                        Tipo de problema
                    </label>

                    <button
                        type="button"
                        className="boton-ayuda"
                        onClick={() => setMostrarAyuda(!mostrarAyuda)}
                        aria-label="Ayuda sobre el tipo de problema"
                        aria-expanded={mostrarAyuda}
                    >
                        ⓘ
                    </button>
                </div>

                {mostrarAyuda && (
                    <div className="mensaje-ayuda">
                        <strong>¿Cómo seleccionar el tipo de problema?</strong>
                        <p>
                            1. Primero selecciona el edificio y el salón donde
                            se encuentra el problema.
                        </p>
                        <p>
                            2. Después se desplegará el mapa con los recursos
                            disponibles en esa ubicación.
                        </p>
                        <p>
                            3. Selecciona en el mapa el recurso que presenta
                            la falla.
                        </p>
                        <p>
                            4. Finalmente, regresa a este apartado y selecciona
                            el tipo de problema correspondiente.
                        </p>
                    </div>
                )}

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
