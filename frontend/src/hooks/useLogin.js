
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function useLogin() {
    const [modoRegistro, setModoRegistro] = useState(false);

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');

    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();

    const limpiarMensajes = () => {
        setError('');
        setMensaje('');
    };

    const iniciarSesion = async (e) => {
        e.preventDefault();
        limpiarMensajes();
        setCargando(true);

        try {
            const respuesta = await api.post('/auth/login', {
                correo,
                password
            });

            const rol = respuesta.data.usuario?.rol || respuesta.data.rol;

            if (rol === 'administrador') {
                navigate('/admin');
            } else if (rol === 'docente') {
                navigate('/docente/seleccionar-ema');
            } else if (rol === 'alumno') {
                navigate('/alumno');
            } else {
                setError('El tipo de usuario no es válido');
            }

        } catch (err) {
            setError(
                err.response?.data?.mensaje ||
                'No se pudo conectar con el servidor'
            );
        } finally {
            setCargando(false);
        }
    };

    const registrarAlumno = async (e) => {
        e.preventDefault();
        limpiarMensajes();

        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        setCargando(true);

        try {
            await api.post('/auth/registro', {
                nombre,
                correo,
                password
            });

            setMensaje(
                'Cuenta creada correctamente. Ya puedes iniciar sesión.'
            );

            setModoRegistro(false);
            setNombre('');
            setPassword('');
            setConfirmarPassword('');

        } catch (err) {
            setError(
                err.response?.data?.mensaje ||
                'No se pudo crear la cuenta'
            );
        } finally {
            setCargando(false);
        }
    };

    const cambiarModo = () => {
        setModoRegistro(!modoRegistro);
        limpiarMensajes();
        setNombre('');
        setCorreo('');
        setPassword('');
        setConfirmarPassword('');
    };

    return {
        modoRegistro,
        setModoRegistro,

        nombre,
        setNombre,
        correo,
        setCorreo,
        password,
        setPassword,
        confirmarPassword,
        setConfirmarPassword,

        error,
        mensaje,
        cargando,

        iniciarSesion,
        registrarAlumno,
        cambiarModo
    };
}

export default useLogin;
