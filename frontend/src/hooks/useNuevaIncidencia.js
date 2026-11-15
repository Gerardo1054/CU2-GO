
import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

function useNuevaIncidencia(edificioFijo = '') {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('');
    const [tipoProblema, setTipoProblema] = useState('');

    const [edificio, setEdificio] = useState(edificioFijo);
    const [salon, setSalon] = useState('');
    const [salonId, setSalonId] = useState('');

    const [recursoId, setRecursoId] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('computo');

    const [espacios, setEspacios] = useState([]);
    const [recursos, setRecursos] = useState([]);

    const [cargandoEspacios, setCargandoEspacios] = useState(true);
    const [cargandoRecursos, setCargandoRecursos] = useState(false);

    const [evidencia, setEvidencia] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState('');

    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [reporteCreado, setReporteCreado] = useState(null);
    const [avisoRecursoOcupado, setAvisoRecursoOcupado] = useState(false);

    const problemasPorRecurso = {
        computadora: [
            { valor: 'no_enciende', nombre: 'No enciende' },
            { valor: 'pantalla_danada', nombre: 'Pantalla dañada' },
            { valor: 'teclado_no_funciona', nombre: 'Teclado no funciona' },
            { valor: 'mouse_no_funciona', nombre: 'Mouse no funciona' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        monitor: [
            { valor: 'no_enciende', nombre: 'No enciende' },
            { valor: 'pantalla_danada', nombre: 'Pantalla dañada' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        teclado: [
            { valor: 'teclado_no_funciona', nombre: 'No funciona' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        mouse: [
            { valor: 'mouse_no_funciona', nombre: 'No funciona' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        television: [
            { valor: 'no_enciende', nombre: 'No enciende' },
            { valor: 'pantalla_danada', nombre: 'Pantalla dañada' },
            { valor: 'sin_senal', nombre: 'Sin señal' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        proyector: [
            { valor: 'no_enciende', nombre: 'No enciende' },
            { valor: 'sin_senal', nombre: 'Sin señal' },
            { valor: 'imagen_danada', nombre: 'Imagen dañada' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        aire_acondicionado: [
            { valor: 'no_enciende', nombre: 'No enciende' },
            { valor: 'no_enfria', nombre: 'No enfría' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        lampara: [
            { valor: 'no_enciende', nombre: 'No enciende' },
            { valor: 'parpadea', nombre: 'Parpadea' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        mesa: [
            { valor: 'danado', nombre: 'Dañada' },
            { valor: 'roto', nombre: 'Rota' },
            { valor: 'inestable', nombre: 'Inestable' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        silla: [
            { valor: 'danado', nombre: 'Dañada' },
            { valor: 'roto', nombre: 'Rota' },
            { valor: 'inestable', nombre: 'Inestable' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        multicontacto: [
            { valor: 'no_funciona', nombre: 'No funciona' },
            { valor: 'contacto_danado', nombre: 'Contacto dañado' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        contacto: [
            { valor: 'no_funciona', nombre: 'No funciona' },
            { valor: 'contacto_danado', nombre: 'Contacto dañado' },
            { valor: 'otro', nombre: 'Otro problema' }
        ],
        otro: [
            { valor: 'otro', nombre: 'Otro problema' }
        ]
    };
    const obtenerCategoriaMapa = (tipo) => {
        const categorias = {
            computadora: 'computo',
            monitor: 'computo',
            teclado: 'computo',
            mouse: 'computo',
            mesa: 'mobiliario',
            silla: 'mobiliario',
            multicontacto: 'electricidad',
            contacto: 'electricidad',
            lampara: 'instalaciones',
            aire_acondicionado: 'instalaciones',
            television: 'audiovisual',
            proyector: 'audiovisual',
            otro: 'otros'
        };

        return categorias[tipo] || 'otros';
    };

    const obtenerEmojiTipo = (tipo) => {
        const emojis = {
            computadora: '💻',
            monitor: '🖥️',
            teclado: '⌨️',
            mouse: '🖱️',
            multicontacto: '🔌',
            aire_acondicionado: '❄️',
            lampara: '💡',
            television: '📺',
            proyector: '📽️',
            mesa: '🪑',
            silla: '🪑',
            contacto: '🔌',
            otro: '📦'
        };

        return emojis[tipo] || '•';
    };

    const obtenerNombreTipo = (tipo) => {
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

        return nombres[tipo] || tipo;
    };

    const estaDisponible = (recurso) =>
        recurso &&
        (
            recurso.disponible === true ||
            recurso.disponible === 1 ||
            recurso.disponible === '1'
        );

    // Cargar edificios y salones.
    useEffect(() => {
        const cargarEspacios = async () => {
            try {
                const respuesta = await api.get('/recursos/espacios');
                setEspacios(respuesta.data);
            } catch (err) {
                setError(
                    err.response?.data?.mensaje ||
                    'No se pudieron cargar los edificios y salones.'
                );
            } finally {
                setCargandoEspacios(false);
            }
        };

        cargarEspacios();
    }, []);

    const edificios = edificioFijo
    ? [edificioFijo]
    : [...new Set(espacios.map((espacio) => espacio.edificio))];

    const salones = espacios.filter(
        (espacio) => espacio.edificio === edificio
    );

    const espacioSeleccionado = espacios.find(
        (espacio) => String(espacio.salon_id) === String(salonId)
    );

    // Cargar recursos del salón seleccionado.
    useEffect(() => {
        if (!salonId) {
            setRecursos([]);
            setRecursoId('');
            return;
        }

        const cargarRecursos = async () => {
            setCargandoRecursos(true);
            setRecursos([]);
            setRecursoId('');
            setAvisoRecursoOcupado(false);
            setFiltroTipo('computo');
            setError('');

            try {
                const respuesta = await api.get('/recursos', {
                    params: { salon_id: salonId }
                });

                setRecursos(respuesta.data);
            } catch (err) {
                setError(
                    err.response?.data?.mensaje ||
                    'No se pudieron cargar los recursos del salón.'
                );
            } finally {
                setCargandoRecursos(false);
            }
        };

        cargarRecursos();
    }, [salonId]);

    // Crear vista previa de la evidencia.
    useEffect(() => {
        if (!evidencia) {
            setVistaPrevia('');
            return;
        }

        const url = URL.createObjectURL(evidencia);
        setVistaPrevia(url);

        return () => URL.revokeObjectURL(url);
    }, [evidencia]);

    // Validar y seleccionar evidencia.
    const seleccionarEvidencia = (e) => {
        const archivo = e.target.files[0];

        if (!archivo) return;

        setError('');

        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'video/mp4',
            'video/webm'
        ];

        if (!tiposPermitidos.includes(archivo.type)) {
            setError(
                'Formato no permitido. Utiliza JPG, PNG, WEBP, MP4 o WEBM.'
            );
            e.target.value = '';
            return;
        }

        if (archivo.size > 20 * 1024 * 1024) {
            setError('El archivo no puede superar los 20 MB.');
            e.target.value = '';
            return;
        }

        if (archivo.type.startsWith('video/')) {
            const video = document.createElement('video');
            const url = URL.createObjectURL(archivo);

            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                URL.revokeObjectURL(url);

                if (video.duration > 15) {
                    setEvidencia(null);
                    setError('El video no puede durar más de 15 segundos.');
                    e.target.value = '';
                } else {
                    setEvidencia(archivo);
                }
            };

            video.onerror = () => {
                URL.revokeObjectURL(url);
                setError('No se pudo leer el video seleccionado.');
                e.target.value = '';
            };

            video.src = url;
        } else {
            setEvidencia(archivo);
        }
    };

    const recursoSeleccionado = recursos.find(
        (recurso) => String(recurso.id) === String(recursoId)
    );

    const recursosFiltrados = useMemo(() => {
        return recursos.filter(
            (recurso) => obtenerCategoriaMapa(recurso.tipo) === filtroTipo
        );
    }, [recursos, filtroTipo]);

 const recursosDistribuidos = useMemo(() => {
    return recursosFiltrados.map((recurso) => {
        let x = Number(recurso.posicion_x);
        let y = Number(recurso.posicion_y);

        if (filtroTipo === 'mobiliario') {
            if (recurso.tipo === 'mesa') {

                x = 14 + (x - 14) * 1.15;
            }

            if (recurso.tipo === 'silla') {
                const coincidencia = recurso.codigo.match(/M(\d+)-/);

                if (coincidencia) {
                    const numeroMesa = Number(coincidencia[1]);

                    const posicionOriginalMesa =
                        14 + ((numeroMesa - 1) % 6) * 12;

                    const mesaAjustada =
                        14 + (posicionOriginalMesa - 14) * 1.15;

                    x = mesaAjustada - 7;
                }
            }
        }

        return { recurso, x, y };
    });
}, [recursosFiltrados, filtroTipo]);

    const seleccionarRecurso = (recurso) => {
        setAvisoRecursoOcupado(false);
        setError('');
        setTipoProblema('');
        setRecursoId(String(recurso.id));
    };

    // Registrar la incidencia.
    const registrarIncidencia = async (e) => {
        e.preventDefault();

        setError('');

        if (!recursoId) {
    setError('Selecciona un recurso en el mapa.');
    return;
        }

        if (!tipoProblema) {
            setError('Selecciona el tipo de problema.');
            return;
        }

        const problemasActivos = recursoSeleccionado?.incidencias_activas || [];

        if (problemasActivos.some(
            (incidencia) => incidencia.tipo_problema === tipoProblema
        )) {
            setError('Este recurso ya tiene una incidencia activa de ese tipo.');
            return;
        }

        setCargando(true);

        try {
            // Consultar nuevamente las incidencias activas.
            const verificacion = await api.get('/recursos', {
                params: { salon_id: salonId }
            });

            const recursoActual = verificacion.data.find(
                (recurso) => String(recurso.id) === String(recursoId)
            );

            const problemasActuales = recursoActual?.incidencias_activas || [];

            if (problemasActuales.some(
                (incidencia) => incidencia.tipo_problema === tipoProblema
            )) {
                setRecursos(verificacion.data);
                setError('Este recurso ya tiene una incidencia activa de ese tipo.');
                setCargando(false);
                return;
            }

            const datos = new FormData();

            datos.append('titulo', titulo);
            datos.append('descripcion', descripcion);
            datos.append('categoria', categoria);
            datos.append('tipo_problema', tipoProblema);
            datos.append('edificio', edificio);
            datos.append('salon', salon);
            datos.append('recurso_id', recursoId);

            if (evidencia) {
                datos.append('evidencia', evidencia);
            }

            await api.post('/incidencias', datos);

            setReporteCreado({
                nombre: recursoSeleccionado.nombre,
                codigo: recursoSeleccionado.codigo
            });
        } catch (err) {
            setError(
                err.response?.data?.mensaje ||
                'No se pudo registrar la incidencia. Intenta nuevamente.'
            );
        } finally {
            setCargando(false);
        }
    };

    const quitarEvidencia = () => {
        setEvidencia(null);

        const input = document.getElementById('evidencia');

        if (input) {
            input.value = '';
        }
    };

    return {
        titulo,
        descripcion,
        categoria,
        setTitulo,
        setDescripcion,
        setCategoria,
        tipoProblema,
        setTipoProblema,
        tiposProblemaDisponibles: recursoSeleccionado
            ? (problemasPorRecurso[recursoSeleccionado.tipo] || problemasPorRecurso.otro)
            : [],

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
    };
}

export default useNuevaIncidencia;
