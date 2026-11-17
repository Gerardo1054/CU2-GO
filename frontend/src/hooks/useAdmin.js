
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function useAdmin() {
    const [incidencias, setIncidencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const [estados, setEstados] = useState({});
    const [observaciones, setObservaciones] = useState({});
    const [guardando, setGuardando] = useState(null);
    const [eliminando, setEliminando] = useState(null);

    const [mensajes, setMensajes] = useState({});
    const [historiales, setHistoriales] = useState({});
    const [cargandoHistorial, setCargandoHistorial] = useState(null);

    const [evidenciaVisible, setEvidenciaVisible] = useState({});
    const [historialVisible, setHistorialVisible] = useState({});

    const [reportePendiente, setReportePendiente] = useState(null);
    const [cerrandoSesion, setCerrandoSesion] = useState(false);
    const [errorSesion, setErrorSesion] = useState('');

    const [pestañaActual, setPestañaActual] = useState('activas');
    const [edificioSeleccionado, setEdificioSeleccionado] = useState('todos');
    const [listaEdificios, setListaEdificios] = useState([]);

    const navigate = useNavigate();

    // Ocultar notificaciones después de 3 segundos
    useEffect(() => {
        if (!Object.values(mensajes).some(Boolean)) return;

        const temporizador = setTimeout(() => {
            setMensajes({});
        }, 3000);

        return () => clearTimeout(temporizador);
    }, [mensajes]);

    // Cargar incidencias
    const cargarIncidencias = async () => {
        try {
            setCargando(true);

            const respuesta = await api.get('/admin/incidencias');

            setIncidencias(respuesta.data);
            setError('');
        } catch (err) {
            setError(
                err.response?.data?.mensaje ||
                'No se pudieron cargar las incidencias'
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarIncidencias();
    }, []);

    // Cargar catálogo de edificios
    useEffect(() => {
        const cargarEdificios = async () => {
            try {
                const resp = await api.get('/recursos/espacios');

                const unicos = Array.from(
                    new Set(resp.data.map(item => item.edificio))
                ).sort((a, b) =>
                    a.localeCompare(b, undefined, { numeric: true })
                );

                setListaEdificios(unicos);
            } catch (err) {
                console.error(
                    'No se pudo cargar el catálogo de edificios:',
                    err
                );
            }
        };

        cargarEdificios();
    }, []);

    // Edificios disponibles
    const edificiosDisponibles = useMemo(() => {
        if (listaEdificios.length > 0) return listaEdificios;

        return Array.from(
            new Set(incidencias.map(i => i.edificio).filter(Boolean))
        ).sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true })
        );
    }, [listaEdificios, incidencias]);

    // Separar incidencias activas e historial
const incidenciasActivas = useMemo(() => {
    return incidencias.filter(
        i =>
            i.estado === 'recibida' ||
            i.estado === 'en_proceso' ||
            i.estado === 'pendiente_validacion'
    );
}, [incidencias]);

    const incidenciasHistorial = useMemo(() => {
        return incidencias.filter(
            i => i.estado === 'arreglada'
        );
    }, [incidencias]);

    // Aplicar filtros
    const incidenciasMostradas = useMemo(() => {
        const base = pestañaActual === 'activas'
            ? incidenciasActivas
            : incidenciasHistorial;

        if (edificioSeleccionado === 'todos') {
            return base;
        }

        return base.filter(
            i => i.edificio === edificioSeleccionado
        );
    }, [
        pestañaActual,
        edificioSeleccionado,
        incidenciasActivas,
        incidenciasHistorial
    ]);

    // Cerrar sesión
    const cerrarSesion = async () => {
        try {
            setCerrandoSesion(true);
            setErrorSesion('');

            await api.post('/auth/logout');

            navigate('/', { replace: true });
        } catch (err) {
            setErrorSesion(
                err.response?.data?.mensaje ||
                'No se pudo cerrar la sesión. Intenta nuevamente.'
            );
        } finally {
            setCerrandoSesion(false);
        }
    };

    // Guardar cambios de una incidencia
    const guardarCambios = async (id) => {
        const incidencia = incidencias.find(i => i.id === id);

        const nuevoEstado = estados[id] || incidencia?.estado;
        const observacion = observaciones[id]?.trim();

        if (!observacion) {
            setMensajes({
                [id]: 'Escribe una observación antes de guardar.'
            });
            return;
        }

        try {
            setGuardando(id);
            setMensajes({});

            await api.put(`/admin/incidencias/${id}/estado`, {
                estado: nuevoEstado,
                observacion
            });

            setMensajes({
                [id]: 'Cambios guardados correctamente.'
            });

            setObservaciones(prev => ({
                ...prev,
                [id]: ''
            }));

            await cargarIncidencias();
            await cargarHistorial(id);

        } catch (err) {
            setMensajes({
                [id]:
                    err.response?.data?.mensaje ||
                    'No se pudieron guardar los cambios.'
            });
        } finally {
            setGuardando(null);
        }
    };

    // Consultar historial de seguimiento
    const cargarHistorial = async (id) => {
        try {
            setCargandoHistorial(id);

            const respuesta = await api.get(
                `/admin/incidencias/${id}/seguimiento`
            );

            setHistoriales(prev => ({
                ...prev,
                [id]: respuesta.data
            }));
        } catch (err) {
            setMensajes({
                [id]:
                    err.response?.data?.mensaje ||
                    'No se pudo cargar el historial.'
            });
        } finally {
            setCargandoHistorial(null);
        }
    };

    // Eliminar reporte
    const eliminarReporte = async () => {
        if (!reportePendiente) return;

        const incidencia = reportePendiente;

        try {
            setEliminando(incidencia.id);

            const respuesta = await api.delete(
                `/admin/incidencias/${incidencia.id}`
            );

            setIncidencias(prev =>
                prev.filter(item => item.id !== incidencia.id)
            );

            setMensajes({
                [incidencia.id]: respuesta.data.mensaje
            });

            setHistoriales(prev => {
                const nuevos = { ...prev };
                delete nuevos[incidencia.id];
                return nuevos;
            });

            setReportePendiente(null);

        } catch (err) {
            setMensajes({
                [incidencia.id]:
                    err.response?.data?.mensaje ||
                    'No se pudo eliminar el reporte.'
            });
        } finally {
            setEliminando(null);
        }
    };

    // Formatear estado
    const formatoEstado = (estado) => {
        const nombres = {
            recibida: 'Recibida',
            en_proceso: 'En proceso',
            arreglada: 'Arreglada'
        };

        return nombres[estado] || estado;
    };

    // Formatear tipo de recurso
    const formatoTipo = (tipo) => {
        const nombres = {
            computadora: 'Computadora',
            monitor: 'Monitor',
            teclado: 'Teclado',
            mouse: 'Mouse',
            multicontacto: 'Multicontacto',
            aire_acondicionado: 'Aire acondicionado',
            lampara: 'Lámpara',
            television: 'Televisión',
            proyector: 'Proyector',
            mesa: 'Mesa',
            silla: 'Silla',
            contacto: 'Contacto',
            otro: 'Otro recurso'
        };

        return nombres[tipo] || tipo || 'No especificado';
    };

    // Formatear fecha
    const formatoFecha = (fecha) => {
        if (!fecha) return 'No disponible';

        return new Date(fecha).toLocaleString('es-MX', {
            timeZone: 'America/Mexico_City',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return {
        incidencias,
        cargando,
        error,

        estados,
        setEstados,
        observaciones,
        setObservaciones,
        guardando,
        eliminando,

        mensajes,
        historiales,
        cargandoHistorial,

        evidenciaVisible,
        setEvidenciaVisible,
        historialVisible,
        setHistorialVisible,

        reportePendiente,
        setReportePendiente,
        cerrandoSesion,
        errorSesion,

        pestañaActual,
        setPestañaActual,
        edificioSeleccionado,
        setEdificioSeleccionado,

        edificiosDisponibles,
        incidenciasActivas,
        incidenciasHistorial,
        incidenciasMostradas,

        cargarIncidencias,
        cerrarSesion,
        guardarCambios,
        cargarHistorial,
        eliminarReporte,

        formatoEstado,
        formatoTipo,
        formatoFecha
    };
}

export default useAdmin;
