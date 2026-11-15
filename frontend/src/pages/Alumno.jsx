
import '../styles/Alumno.css';
import '../styles/Modales.css';

import Sidebar from '../components/common/Sidebar';
import Toast from '../components/common/Toast';
import ConfirmModal from '../components/common/ConfirmModal';

import AlumnoHeader from '../components/alumno/AlumnoHeader';
import AlumnoBanner from '../components/alumno/AlumnoBanner';
import AlumnoStats from '../components/alumno/AlumnoStats';
import AlumnoTabs from '../components/alumno/AlumnoTabs';
import AlumnoReports from '../components/alumno/AlumnoReports';

import useAlumno from '../hooks/useAlumno';

function Alumno() {
    const {
        cargando,
        error,
        cerrandoSesion,
        errorSesion,
        eliminandoId,
        mensaje,
        reportePendiente,
        setReportePendiente,
        seccionActual,
        setSeccionActual,
        evidenciaVisible,
        menuAbierto,
        setMenuAbierto,
        incidenciasActivas,
        incidenciasHistorial,
        incidenciasMostradas,
        enProceso,
        arregladas,
        cerrarSesion,
        eliminarReporte,
        toggleEvidencia
    } = useAlumno();

    return (
        <div className="dashboard">

            <Sidebar
                menuAbierto={menuAbierto}
                setMenuAbierto={setMenuAbierto}
                seccionActual={seccionActual}
                setSeccionActual={setSeccionActual}
                totalActivas={incidenciasActivas.length}
                totalHistorial={incidenciasHistorial.length}
                cerrandoSesion={cerrandoSesion}
                cerrarSesion={cerrarSesion}
            />

            <main className="dashboard-main" id="inicio">

                <AlumnoHeader />

                {errorSesion && (
                    <div className="logout-error">
                        {errorSesion}
                    </div>
                )}

                <Toast mensaje={mensaje} />

                {error && (
                    <div className="logout-error">
                        {error}
                    </div>
                )}

                <AlumnoBanner />

                <AlumnoStats
                    totalActivas={incidenciasActivas.length}
                    enProceso={enProceso}
                    arregladas={arregladas}
                />

                <AlumnoTabs
                    seccionActual={seccionActual}
                    setSeccionActual={setSeccionActual}
                    totalActivas={incidenciasActivas.length}
                    totalHistorial={incidenciasHistorial.length}
                />

                <AlumnoReports
                    cargando={cargando}
                    seccionActual={seccionActual}
                    incidenciasMostradas={incidenciasMostradas}
                    evidenciaVisible={evidenciaVisible}
                    toggleEvidencia={toggleEvidencia}
                    setReportePendiente={setReportePendiente}
                />

                <footer className="dashboard-footer">
                    CU2 GO · Sistema de gestión de incidencias · BUAP
                </footer>

                <ConfirmModal
                    reporte={reportePendiente}
                    eliminando={eliminandoId !== null}
                    onCancelar={() => setReportePendiente(null)}
                    onConfirmar={eliminarReporte}
                />

            </main>
        </div>
    );
}

export default Alumno;
