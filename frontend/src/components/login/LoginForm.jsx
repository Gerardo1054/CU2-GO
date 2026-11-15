
import LoginFooter from './LoginFooter';

function LoginForm({
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
}) {
    return (
        <section className="login-form-section">
            <div className="login-card">

                <div className="login-heading">
                    <span className="login-icon">⌖</span>

                    <h2>
                        {modoRegistro ? 'Crear cuenta' : 'Bienvenido'}
                    </h2>

                    <p>
                        {modoRegistro
                            ? 'Regístrate para reportar incidencias'
                            : 'Inicia sesión para continuar'}
                    </p>
                </div>

                <form onSubmit={modoRegistro ? registrarAlumno : iniciarSesion}>

                    {modoRegistro && (
                        <>
                            <label htmlFor="nombre">
                                Nombre completo
                            </label>

                            <input
                                id="nombre"
                                type="text"
                                placeholder="Ingresa tu nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                minLength={3}
                                maxLength={100}
                                required
                            />
                        </>
                    )}

                    <label htmlFor="correo">
                        Correo electrónico
                    </label>

                    <input
                        id="correo"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />

                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                    />

                    {modoRegistro && (
                        <>
                            <label htmlFor="confirmarPassword">
                                Confirmar contraseña
                            </label>

                            <input
                                id="confirmarPassword"
                                type="password"
                                placeholder="Repite tu contraseña"
                                value={confirmarPassword}
                                onChange={(e) => setConfirmarPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                        </>
                    )}

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    {mensaje && (
                        <div className="login-success">
                            {mensaje}
                        </div>
                    )}

                    <button type="submit" disabled={cargando}>
                        {cargando
                            ? 'Procesando...'
                            : modoRegistro
                                ? 'Crear cuenta'
                                : 'Iniciar sesión'}
                    </button>

                </form>

                <div className="login-register">
                    <p>
                        {modoRegistro
                            ? '¿Ya tienes una cuenta?'
                            : '¿Todavía no tienes una cuenta?'}
                    </p>

                    <button
                        type="button"
                        onClick={cambiarModo}
                    >
                        {modoRegistro
                            ? 'Iniciar sesión'
                            : 'Crear una cuenta'}
                    </button>
                </div>

                <LoginFooter />

            </div>
        </section>
    );
}

export default LoginForm;
