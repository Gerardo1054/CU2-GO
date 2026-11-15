import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Alumno from './pages/Alumno';
import NuevaIncidencia from './pages/NuevaIncidencia';
import NuevaIncidenciaDocente from './pages/NuevaIncidenciaDocente';
import Admin from './pages/Admin';
import SeleccionarEMA from './pages/SeleccionarEMA';
import Docente from './pages/Docente';
import NotFound from './pages/NotFound';
import ServicioNoDisponible from './pages/ServicioNoDisponible';
import ErrorServidor from './pages/ErrorServidor';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/alumno" element={<Alumno />} />
                <Route
                    path="/nueva-incidencia"
                    element={<NuevaIncidencia />}
                />

                <Route path="/admin" element={<Admin />} />

                <Route
                    path="/docente/seleccionar-ema"
                    element={<SeleccionarEMA />}
                />
                <Route path="/docente" element={<Docente />} />
                <Route
                    path="/docente/nueva-incidencia"
                    element={<NuevaIncidenciaDocente />}
                />

                <Route
                    path="/servicio-no-disponible"
                    element={<ServicioNoDisponible />}
                />

                <Route
                    path="/error-servidor"
                    element={<ErrorServidor />}
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;