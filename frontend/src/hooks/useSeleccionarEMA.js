
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function useSeleccionarEMA() {
    const [edificios, setEdificios] = useState([]);
    const [edificioSeleccionado, setEdificioSeleccionado] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const cargarEdificios = async () => {
            try {
                setCargando(true);
                setError('');

                const respuesta = await api.get('/recursos/espacios');

                const edificiosUnicos = Array.from(
                    new Set(
                        respuesta.data
                            .map(item => item.edificio)
                            .filter(Boolean)
                    )
                ).sort((a, b) =>
                    a.localeCompare(b, undefined, { numeric: true })
                );

                setEdificios(edificiosUnicos);

            } catch (err) {
                setError(
                    err.response?.data?.mensaje ||
                    'No se pudieron cargar los EMA disponibles.'
                );
            } finally {
                setCargando(false);
            }
        };

        cargarEdificios();
    }, []);

    const continuar = () => {
        if (!edificioSeleccionado) {
            setError('Selecciona un EMA para continuar.');
            return;
        }

        sessionStorage.setItem(
            'docenteEMA',
            edificioSeleccionado
        );

        navigate('/docente');
    };

    const cerrarSesion = async () => {
        try {
            await api.post('/auth/logout');

            sessionStorage.removeItem('docenteEMA');

            navigate('/', { replace: true });

        } catch (err) {
            setError(
                err.response?.data?.mensaje ||
                'No se pudo cerrar la sesión.'
            );
        }
    };

    return {
        edificios,
        edificioSeleccionado,
        setEdificioSeleccionado,
        cargando,
        error,
        continuar,
        cerrarSesion
    };
}

export default useSeleccionarEMA;
