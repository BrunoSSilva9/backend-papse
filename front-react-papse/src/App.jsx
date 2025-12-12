import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Form from './pages/Form';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Bolsista from './pages/Bolsista';
import PatientList from './pages/PatientList';
import Report from './pages/Report';
import './styles/globals.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/formulario" element={<Form />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bolsista"
            element={
              <ProtectedRoute>
                <Bolsista />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lista-espera"
            element={
              <ProtectedRoute>
                <PatientList
                  status="lista_de_espera"
                  title="Lista de Espera"
                  nextStatus="atendimento_protocolo"
                  canEncerrar={true}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lista-espera-regulares"
            element={
              <ProtectedRoute>
                <PatientList
                  status="espera_regulares"
                  title="Lista de Espera para Atendimentos Regulares"
                  nextStatus="atendimento_regular"
                  canEncerrar={true}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/atendimentos-protocolo"
            element={
              <ProtectedRoute>
                <PatientList
                  status="atendimento_protocolo"
                  title="Lista de Atendimentos de Protocolo"
                  nextStatus="espera_regulares"
                  canEncerrar={true}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/atendimento-regulares"
            element={
              <ProtectedRoute>
                <PatientList
                  status="atendimento_regular"
                  title="Lista de Atendimentos Regulares"
                  nextStatus={null}
                  canEncerrar={true}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/relatorio"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
