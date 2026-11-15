
import AdminHeader from '../components/admin/AdminHeader';
import AdminSummary from '../components/admin/AdminSummary';
import AdminFilters from '../components/admin/AdminFilters';
import AdminIncidencias from '../components/admin/AdminIncidencias';
import AdminConfirmModal from '../components/admin/AdminConfirmModal';

import useAdmin from '../hooks/useAdmin';

import '../styles/Admin.css';
import '../styles/Modales.css';

function Admin() {
    const {
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
    } = useAdmin();

    return (
        <main className="admin-container">

            <AdminHeader
                onRefresh={cargarIncidencias}
                onLogout={cerrarSesion}
                cerrandoSesion={cerrandoSesion}
            />

            {errorSesion && (
                <div className="admin-alerta admin-alerta-error">
                    {errorSesion}
                </div>
            )}

            <AdminSummary
                incidencias={incidencias}
            />

            <AdminFilters
                pestañaActual={pestañaActual}
                setPestañaActual={setPestañaActual}
                incidenciasActivas={incidenciasActivas}
                incidenciasHistorial={incidenciasHistorial}
                edificiosDisponibles={edificiosDisponibles}
                edificioSeleccionado={edificioSeleccionado}
                setEdificioSeleccionado={setEdificioSeleccionado}
            />

            <AdminIncidencias
                pestañaActual={pestañaActual}
                edificioSeleccionado={edificioSeleccionado}
                incidenciasMostradas={incidenciasMostradas}
                cargando={cargando}
                error={error}
                estados={estados}
                setEstados={setEstados}
                observaciones={observaciones}
                setObservaciones={setObservaciones}
                guardando={guardando}
                guardarCambios={guardarCambios}
                mensajes={mensajes}
                evidenciaVisible={evidenciaVisible}
                setEvidenciaVisible={setEvidenciaVisible}
                historiales={historiales}
                historialVisible={historialVisible}
                setHistorialVisible={setHistorialVisible}
                cargandoHistorial={cargandoHistorial}
                cargarHistorial={cargarHistorial}
                formatoEstado={formatoEstado}
                formatoTipo={formatoTipo}
                formatoFecha={formatoFecha}
                setReportePendiente={setReportePendiente}
            />

            <AdminConfirmModal
                reportePendiente={reportePendiente}
                eliminando={eliminando}
                onCancelar={() => setReportePendiente(null)}
                onConfirmar={eliminarReporte}
            />

        </main>
    );
}

export default Admin;
