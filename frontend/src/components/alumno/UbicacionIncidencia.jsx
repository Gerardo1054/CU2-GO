
function UbicacionIncidencia({
    edificio,
    salonId,
    edificios,
    salones,
    cargandoEspacios,
    espacioSeleccionado,
    setEdificio,
    setSalon,
    setSalonId,
    setRecursos,
    setRecursoId,
    setError,
    edificioFijo = ''
}) {
    return (
        <>
            <div className="form-location">
                <div className="form-group">
                    <label htmlFor="edificio">Edificio</label>

                    {edificioFijo ? (
                        <input
                            id="edificio"
                            type="text"
                            value={edificioFijo}
                            readOnly
                        />
                    ) : (
                        <select
                            id="edificio"
                            value={edificio}
                            onChange={(e) => {
                                setEdificio(e.target.value);
                                setSalon('');
                                setSalonId('');
                                setRecursos([]);
                                setRecursoId('');
                                setError('');
                            }}
                            disabled={cargandoEspacios}
                            required
                        >
                            <option value="">
                                {cargandoEspacios
                                    ? 'Cargando edificios...'
                                    : 'Selecciona el edificio'}
                            </option>

                            {edificios.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="salon">Salón</label>

                    <select
                        id="salon"
                        value={salonId}
                        onChange={(e) => {
                            const seleccionado = salones.find(
                                (item) =>
                                    String(item.salon_id) === e.target.value
                            );

                            setSalonId(e.target.value);
                            setSalon(seleccionado?.salon || '');
                            setRecursoId('');
                            setError('');
                        }}
                        disabled={!edificio || cargandoEspacios}
                        required
                    >
                        <option value="">Selecciona el salón</option>

                        {salones.map((item) => (
                            <option
                                key={item.salon_id}
                                value={item.salon_id}
                            >
                                {item.salon}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {salonId && (
                <div className="tipo-espacio">
                    <strong>Tipo de espacio:</strong>{' '}
                    {espacioSeleccionado?.tipo_espacio || 'No especificado'}
                </div>
            )}
        </>
    );
}

export default UbicacionIncidencia;
