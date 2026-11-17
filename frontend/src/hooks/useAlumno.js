
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function useAlumno() {
    const [incidencias, setIncidencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [cerrandoSesion, setCerrandoSesion] = useState(false);
    const [errorSesion, setErrorSesion] = useState('');
    const [eliminandoId, setEliminandoId] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [reportePendiente, setReportePendiente] = useState(null);
    const [seccionActual, setSeccionActual] = useState('activos');
    const [evidenciaVisible, setEvidenciaVisible] = useState({});
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [actualizando, setActualizando] = useState(false);

    const navigate = useNavigate();

    // Cargar y actualizar incidencias del alumno
        const cargarIncidencias = useCallback(async () => {
            try {
                setActualizando(true);
                setError('');

                const respuesta = await api.get('/incidencias/mis-incidencias');
                setIncidencias(respuesta.data);

            } catch (err) {
                setError('No se pudieron cargar tus incidencias.');
                console.error(err);

            } finally {
                setCargando(false);
                setActualizando(false);
            }
        }, []);

        useEffect(() => {
            cargarIncidencias();
        }, [cargarIncidencias]);

    // Ocultar mensajes después de 3 segundos
    useEffect(() => {
        if (!mensaje) return;

        const temporizador = setTimeout(() => {
            setMensaje('');
        }, 3000);

        return () => clearTimeout(temporizador);
    }, [mensaje]);

    // Cerrar sesión
    const cerrarSesion = async () => {
        try {
            setCerrandoSesion(true);
            setErrorSesion('');

            await api.post('/auth/logout');

            navigate('/', { replace: true });
        } catch (err) {
            setErrorSesion('No se pudo cerrar la sesión. Intenta nuevamente.');
            console.error(err);
        } finally {
            setCerrandoSesion(false);
        }
    };

    // Eliminar reporte
    const eliminarReporte = async () => {
        if (!reportePendiente) return;

        const incidencia = reportePendiente;

        try {
            setEliminandoId(incidencia.id);
            setMensaje('');
            setError('');

            const respuesta = await api.delete(
                `/incidencias/${incidencia.id}`
            );

            setIncidencias(actuales =>
                actuales.filter(item => item.id !== incidencia.id)
            );

            setMensaje(
                respuesta.data?.mensaje || 'Reporte eliminado correctamente.'
            );

            setReportePendiente(null);
        } catch (err) {
            const mensajeError =
                err.response?.data?.mensaje ||
                'No se pudo eliminar el reporte. Intenta nuevamente.';

            setError(mensajeError);
            console.error(err);
        } finally {
            setEliminandoId(null);
        }
    };

    // Filtrar incidencias activas
const incidenciasActivas = useMemo(() => {
    return incidencias.filter(
        incidencia =>
            incidencia.estado === 'recibida' ||
            incidencia.estado === 'en_proceso' ||
            incidencia.estado === 'pendiente_validacion'
    );
}, [incidencias]);

    // Filtrar historial
    const incidenciasHistorial = useMemo(() => {
        return incidencias.filter(
            incidencia => incidencia.estado === 'arreglada'
        );
    }, [incidencias]);

    // Seleccionar incidencias mostradas
    const incidenciasMostradas =
        seccionActual === 'activos'
            ? incidenciasActivas
            : incidenciasHistorial;

    // Contadores
    const enProceso = incidencias.filter(
        incidencia => incidencia.estado === 'en_proceso'
    ).length;

    const arregladas = incidencias.filter(
        incidencia => incidencia.estado === 'arreglada'
    ).length;

    // Mostrar u ocultar evidencia
    const toggleEvidencia = (id) => {
        setEvidenciaVisible(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return {
        incidencias,
        cargando,
        actualizando,
        cargarIncidencias,
        error,
        cerrandoSesion,
        errorSesion,
        eliminandoId,
        mensaje,
        reportePendiente,
        setReportePendiente,
        seccionActual,
        setSeccionActual,
        evidenciaVisible,
        menuAbierto,
        setMenuAbierto,
        incidenciasActivas,
        incidenciasHistorial,
        incidenciasMostradas,
        enProceso,
        arregladas,
        cerrarSesion,
        eliminarReporte,
        toggleEvidencia
    };
}

export default useAlumno;
