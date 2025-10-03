import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/globals.css';
import '../../assets/styles/variables.css';
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <header>
        <div>
          <div>
            <div>
              <h1>Dashboard Principal</h1>
              <p>
                Bienvenido, {user?.nombre} ({user?.rol})
              </p>
            </div>
            <button onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main>
        <div>
          <div>
            <div>
              <h2>Panel de Control Principal</h2>
              <p>
                Esta es una vista común para todos los usuarios autenticados
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;