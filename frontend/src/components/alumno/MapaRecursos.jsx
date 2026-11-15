
const categoriasMapa = [
    { id: 'computo', nombre: 'Cómputo', emoji: '💻' },
    { id: 'mobiliario', nombre: 'Mobiliario', emoji: '🪑' },
    { id: 'electricidad', nombre: 'Electricidad', emoji: '🔌' },
    { id: 'instalaciones', nombre: 'Instalaciones', emoji: '💡' },
    { id: 'audiovisual', nombre: 'Audiovisual', emoji: '' }
];

function MapaRecursos({
    edificio,
    salon,
    recursos,
    recursosFiltrados,
    recursosDistribuidos,
    cargandoRecursos,
    avisoRecursoOcupado,
    filtroTipo,
    setFiltroTipo,
    recursoId,
    seleccionarRecurso,
    estaDisponible,
    obtenerEmojiTipo,
    obtenerNombreTipo,
    recursoSeleccionado,
    setRecursoId,
    setAvisoRecursoOcupado,
    setError
}) {
    return (
        <section className="mapa-recursos-section">
            <div className="mapa-encabezado">
                <div>
                    <span className="incidencia-tag">
                        UBICACIÓN VISUAL
                    </span>
                    <h2>Mapa del espacio</h2>
                    <p>{edificio} · Salón {salon}</p>
                </div>

                <div className="mapa-contador">
                    <strong>{recursosFiltrados.length}</strong>
                    <span>recursos</span>
                </div>
            </div>

            {avisoRecursoOcupado && (
                <div className="mapa-aviso-flotante" role="alert">
                    <span className="aviso-icono">!</span>
                    <span>
                        Este recurso ya tiene un reporte activo y no puede
                        generar otro reporte.
                    </span>
                </div>
            )}

            {cargandoRecursos ? (
                <div className="mapa-mensaje">
                    Cargando recursos del salón...
                </div>
            ) : recursos.length === 0 ? (
                <div className="mapa-mensaje">
                    Este espacio todavía no tiene recursos registrados.
                </div>
            ) : (
                <>
                    <div className="mapa-leyenda">
                        <span>
                            <i className="punto-disponible"></i>
                            Disponible
                        </span>
                        <span>
                            <i className="punto-ocupado"></i>
                            Reporte activo
                        </span>
                        <span>
                            <i className="punto-seleccionado"></i>
                            Seleccionado
                        </span>
                    </div>

                    <div className="mapa-categorias">
                        {categoriasMapa.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`mapa-pestana ${
                                    filtroTipo === item.id ? 'activa' : ''
                                }`}
                                onClick={() => {
                                    setFiltroTipo(item.id);
                                    setRecursoId('');
                                    setError('');
                                }}
                            >
                                {item.emoji && (
                                    <span className="categoria-emoji">
                                        {item.emoji}
                                    </span>
                                )}
                                {item.nombre}
                            </button>
                        ))}
                    </div>

                    <div className="mapa-scroll">
                        <div className="mapa-plano">
                            <div className="mapa-frente">
                                <span>FRENTE DEL SALÓN</span>
                            </div>

                            <div className="mapa-pizarron">
                                PIZARRÓN
                            </div>

                            <div className="mapa-puerta">
                                <span>PUERTA</span>
                                <div className="puerta-hoja"></div>
                                <div className="puerta-arco"></div>
                            </div>

                            <div className="mapa-area">
                                {recursosDistribuidos.map((punto) => {
                                    const recurso = punto.recurso;
                                    const disponible = estaDisponible(recurso);
                                    const seleccionado =
                                        String(recurso.id) === String(recursoId);

                                    return (
                                        <button
                                            key={recurso.id}
                                            type="button"
                                            title={`${recurso.codigo} - ${recurso.nombre}${
                                                disponible ? '' : ' - Tiene incidencias activas'
                                            }`}
                                            aria-label={`Seleccionar ${recurso.nombre}`}
                                            className={`mapa-marcador ${recurso.tipo}
                                                    ${disponible ? 'disponible' : 'ocupado'}
                                                    ${seleccionado ? 'seleccionado' : ''}`}
                                            style={{
                                                left: `${punto.x}%`,
                                                top: `${punto.y}%`
                                            }}
                                            onClick={() => seleccionarRecurso(recurso)}
                                        >
                                            <span className="marcador-icono">
                                                {obtenerEmojiTipo(recurso.tipo)}
                                            </span>

                                            <small className="marcador-codigo">
                                                {recurso.codigo}
                                            </small>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mapa-ayuda">
                        Selecciona cualquier recurso. Los marcadores rojos
                        tienen incidencias activas, pero puedes reportar
                        un problema diferente.
                    </div>

                    {recursoSeleccionado && (
                        <div className="recurso-seleccionado">
                            <div>
                                <span>RECURSO SELECCIONADO</span>

                                <h3>
                                    {obtenerEmojiTipo(recursoSeleccionado.tipo)}{' '}
                                    {obtenerNombreTipo(recursoSeleccionado.tipo)}
                                </h3>

                                <p>
                                    Código: {recursoSeleccionado.codigo}
                                </p>
                            </div>
                                {recursoSeleccionado.incidencias_activas?.length > 0 && (
                                    <div className="incidencias-recurso-activas">
                                        <h4>Incidencias activas de este recurso</h4>

                                        {recursoSeleccionado.incidencias_activas.map((incidencia) => (
                                            <div
                                                key={incidencia.id}
                                                className="incidencia-recurso-item"
                                            >
                                                <strong>
                                                    {incidencia.tipo_problema.replaceAll('_', ' ')}
                                                </strong>

                                                <span>
                                                    Estado: {incidencia.estado.replaceAll('_', ' ')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            <button
                                type="button"
                                onClick={() => {
                                    setRecursoId('');
                                    setAvisoRecursoOcupado(false);
                                }}
                            >
                                Quitar selección
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default MapaRecursos;
