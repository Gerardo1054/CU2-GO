
function Toast({ mensaje }) {
    if (!mensaje) return null;

    return (
        <div className="mensaje-eliminacion" role="status">
            {mensaje}
        </div>
    );
}

export default Toast;
