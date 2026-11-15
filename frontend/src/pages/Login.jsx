
import useLogin from '../hooks/useLogin';
import LoginBrand from '../components/login/LoginBrand';
import LoginForm from '../components/login/LoginForm';
import '../styles/Login.css';

function Login() {
    const {
        modoRegistro,
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
    } = useLogin();

    return (
        <main className="login-container">

            <LoginBrand />

            <LoginForm
                modoRegistro={modoRegistro}
                nombre={nombre}
                setNombre={setNombre}
                correo={correo}
                setCorreo={setCorreo}
                password={password}
                setPassword={setPassword}
                confirmarPassword={confirmarPassword}
                setConfirmarPassword={setConfirmarPassword}
                error={error}
                mensaje={mensaje}
                cargando={cargando}
                iniciarSesion={iniciarSesion}
                registrarAlumno={registrarAlumno}
                cambiarModo={cambiarModo}
            />

        </main>
    );
}

export default Login;
