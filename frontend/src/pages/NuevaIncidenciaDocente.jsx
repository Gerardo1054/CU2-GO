
import { useNavigate } from 'react-router-dom';

import useNuevaIncidencia from '../hooks/useNuevaIncidencia';

import MapaRecursos from '../components/alumno/MapaRecursos';
import EvidenciaIncidencia from '../components/alumno/EvidenciaIncidencia';
import EncabezadoIncidencia from '../components/alumno/EncabezadoIncidencia';
import UbicacionIncidencia from '../components/alumno/UbicacionIncidencia';
import DatosIncidencia from '../components/alumno/DatosIncidencia';
import ReporteCreadoModal from '../components/alumno/ReporteCreadoModal';

import '../styles/NuevaIncidencia.css';
import '../styles/Modales.css';
import '../styles/MapaRecursos.css';

function NuevaIncidenciaDocente() {
    const navigate = useNavigate();

    const edificioFijo = sessionStorage.getItem('docenteEMA') || '';

    const {
        titulo,
        descripcion,
        categoria,
        setTitulo,
        setDescripcion,
        setCategoria,
        tipoProblema,
        setTipoProblema,
        tiposProblemaDisponibles,
        edificio,
        salon,
        salonId,
        setEdificio,
        setSalon,
        setSalonId,
        edificios,
        salones,
        espacioSeleccionado,
        cargandoEspacios,
        recursoId,
        setRecursoId,
        filtroTipo,
        setFiltroTipo,
        recursos,
        setRecursos,
        recursosFiltrados,
        recursosDistribuidos,
        cargandoRecursos,
        avisoRecursoOcupado,
        setAvisoRecursoOcupado,
        recursoSeleccionado,
        obtenerEmojiTipo,
        obtenerNombreTipo,
        estaDisponible,
        seleccionarRecurso,
        evidencia,
        vistaPrevia,
        seleccionarEvidencia,
        quitarEvidencia,
        error,
        setError,
        cargando,
        reporteCreado,
        registrarIncidencia
    } = useNuevaIncidencia(edificioFijo);

    return (
        <main className="incidencia-page">
            <section className="incidencia-card">
                <EncabezadoIncidencia rutaRegreso="/docente" />

                <form onSubmit={registrarIncidencia}>
                    <DatosIncidencia
                        titulo={titulo}
                        descripcion={descripcion}
                        categoria={categoria}
                        setTitulo={setTitulo}
                        setDescripcion={setDescripcion}
                        setCategoria={setCategoria}
                        tipoProblema={tipoProblema}
                        setTipoProblema={setTipoProblema}
                        tiposProblemaDisponibles={tiposProblemaDisponibles}
                    />

                    <UbicacionIncidencia
                        edificio={edificio}
                        edificioFijo={edificioFijo}
                        salonId={salonId}
                        edificios={edificios}
                        salones={salones}
                        cargandoEspacios={cargandoEspacios}
                        espacioSeleccionado={espacioSeleccionado}
                        setEdificio={setEdificio}
                        setSalon={setSalon}
                        setSalonId={setSalonId}
                        setRecursos={setRecursos}
                        setRecursoId={setRecursoId}
                        setError={setError}
                    />

                    {salonId && (
                        <MapaRecursos
                            edificio={edificio}
                            salon={salon}
                            recursos={recursos}
                            recursosFiltrados={recursosFiltrados}
                            recursosDistribuidos={recursosDistribuidos}
                            cargandoRecursos={cargandoRecursos}
                            avisoRecursoOcupado={avisoRecursoOcupado}
                            filtroTipo={filtroTipo}
                            setFiltroTipo={setFiltroTipo}
                            recursoId={recursoId}
                            seleccionarRecurso={seleccionarRecurso}
                            estaDisponible={estaDisponible}
                            obtenerEmojiTipo={obtenerEmojiTipo}
                            obtenerNombreTipo={obtenerNombreTipo}
                            recursoSeleccionado={recursoSeleccionado}
                            setRecursoId={setRecursoId}
                            setAvisoRecursoOcupado={setAvisoRecursoOcupado}
                            setError={setError}
                        />
                    )}

                    <EvidenciaIncidencia
                        evidencia={evidencia}
                        vistaPrevia={vistaPrevia}
                        seleccionarEvidencia={seleccionarEvidencia}
                        quitarEvidencia={quitarEvidencia}
                    />

                    {error && (
                        <div className="incidencia-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={
                            cargando ||
                            cargandoEspacios ||
                            cargandoRecursos ||
                            !recursoId ||
                            !edificioFijo
                        }
                    >
                        {cargando ? 'Registrando...' : 'Enviar reporte'}
                    </button>
                </form>
            </section>

            <ReporteCreadoModal
                reporteCreado={reporteCreado}
                navigate={navigate}
                rutaRegreso="/docente"
                textoBoton="Regresar al panel docente"
            />
        </main>
    );
}

export default NuevaIncidenciaDocente;