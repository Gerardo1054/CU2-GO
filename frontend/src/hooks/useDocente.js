
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function useDocente() {
    const [disponibles, setDisponibles] = useState([]);
    const [asignadas, setAsignadas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cerrandoSesion, setCerrandoSesion] = useState(false);
    const [errorSesion, setErrorSesion] = useState('');
    const [tomandoId, setTomandoId] = useState(null);
    const [seccionActual, setSeccionActual] = useState('disponibles');
    const [menuAbierto, setMenuAbierto] = useState(false);

    const navigate = useNavigate();

    // EMA seleccionado.
    const emaSeleccionado = sessionStorage.getItem('docenteEMA') || '';

    // Cargar incidencias del docente.
    const cargarIncidencias = async () => {
        try {
            setError('');

            const [respuestaDisponibles, respuestaAsignadas] =
                await Promise.all([
                    api.get('/docente/incidencias/disponibles'),
                    api.get('/docente/incidencias/asignadas')
                ]);

            setDisponibles(respuestaDisponibles.data);
            setAsignadas(respuestaAsignadas.data);

        } catch (err) {
            setError(
                err.response?.data?.mensaje ||
                'No se pudieron cargar las incidencias.'
            );

            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarIncidencias();
    }, []);

    // Ocultar mensajes.
    useEffect(() => {
        if (!mensaje) return;

        const temporizador = setTimeout(() => {
            setMensaje('');
        }, 3000);

        return () => clearTimeout(temporizador);
    }, [mensaje]);

    // Tomar una incidencia.
    const tomarIncidencia = async (id) => {
        try {
            setTomandoId(id);
            setError('');
            setMensaje('');

            const respuesta = await api.post(
                `/docente/incidencias/${id}/tomar`
            );

            setMensaje(
                respuesta.data?.mensaje ||
                'Incidencia asignada correctamente.'
            );

            await cargarIncidencias();

        } catch (err) {
            setError(
                err.response?.data?.mensaje ||
                'No se pudo asignar la incidencia.'
            );

            console.error(err);
        } finally {
            setTomandoId(null);
        }
    };

    // Cerrar sesión.
    const cerrarSesion = async () => {
        try {
            setCerrandoSesion(true);
            setErrorSesion('');

            await api.post('/auth/logout');

            sessionStorage.removeItem('docenteEMA');

            navigate('/', { replace: true });

        } catch (err) {
            setErrorSesion(
                'No se pudo cerrar la sesión. Intenta nuevamente.'
            );

            console.error(err);
        } finally {
            setCerrandoSesion(false);
        }
    };

    // Contadores.
    const totalDisponibles = disponibles.length;
    const totalAsignadas = asignadas.length;

    const enProceso = asignadas.filter(
        incidencia => incidencia.estado === 'en_proceso'
    ).length;

    const pendientesValidacion = asignadas.filter(
        incidencia => incidencia.estado === 'pendiente_validacion'
    ).length;

    // Incidencias mostradas.
    const incidenciasMostradas = useMemo(() => {
        return seccionActual === 'disponibles'
            ? disponibles
            : asignadas;
    }, [seccionActual, disponibles, asignadas]);

    return {
        disponibles,
        asignadas,
        cargando,
        error,
        mensaje,
        cerrandoSesion,
        errorSesion,
        tomandoId,
        seccionActual,
        setSeccionActual,
        menuAbierto,
        setMenuAbierto,
        emaSeleccionado,
        totalDisponibles,
        totalAsignadas,
        enProceso,
        pendientesValidacion,
        incidenciasMostradas,
        cargarIncidencias,
        tomarIncidencia,
        cerrarSesion
    };
}

export default useDocente;
