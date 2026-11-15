
import useSeleccionarEMA from '../hooks/useSeleccionarEMA';
import '../styles/SeleccionarEMA.css';

function SeleccionarEMA() {
    const {
        edificios,
        edificioSeleccionado,
        setEdificioSeleccionado,
        cargando,
        error,
        continuar,
        cerrarSesion
    } = useSeleccionarEMA();

    return (
        <main className="seleccionar-ema-container">

            <header className="seleccionar-ema-header">
                <div className="seleccionar-ema-logo">
                    CU2 GO
                </div>

                <button
                    className="seleccionar-ema-logout"
                    onClick={cerrarSesion}
                >
                    Cerrar sesión
                </button>
            </header>

            <section className="seleccionar-ema-contenido">

                <div className="seleccionar-ema-icono">
                    <span>🏫</span>
                </div>

                <h1>Selecciona tu EMA</h1>

                <p className="seleccionar-ema-descripcion">
                    Selecciona el edificio donde impartirás clases
                    para consultar y atender las incidencias
                    correspondientes.
                </p>

                {cargando ? (
                    <p className="seleccionar-ema-mensaje">
                        Cargando edificios disponibles...
                    </p>
                ) : (
                    <>
                        <div className="seleccionar-ema-formulario">

                            <label htmlFor="edificio">
                                Edificio o EMA
                            </label>

                            <select
                                id="edificio"
                                value={edificioSeleccionado}
                                onChange={(e) =>
                                    setEdificioSeleccionado(e.target.value)
                                }
                            >
                                <option value="">
                                    Selecciona un edificio
                                </option>

                                {edificios.map((edificio) => (
                                    <option
                                        key={edificio}
                                        value={edificio}
                                    >
                                        {edificio}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {edificios.length === 0 && !error && (
                            <p className="seleccionar-ema-error">
                                No hay edificios disponibles.
                            </p>
                        )}

                        {error && (
                            <p className="seleccionar-ema-error">
                                {error}
                            </p>
                        )}

                        <button
                            className="seleccionar-ema-continuar"
                            onClick={continuar}
                            disabled={!edificioSeleccionado}
                        >
                            Entrar al panel
                        </button>
                    </>
                )}

                <div className="seleccionar-ema-nota">
                    <span>ⓘ</span>
                    <p>
                        Solo visualizarás las incidencias
                        correspondientes al EMA seleccionado.
                    </p>
                </div>

            </section>

        </main>
    );
}

export default SeleccionarEMA;
