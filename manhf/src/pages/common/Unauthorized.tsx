import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-yellow-500 mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Acceso No Autorizado
        </h1>
        <p className="text-gray-600 mb-4">
          Tu rol actual (<strong>{user?.rol}</strong>) no tiene permisos para acceder a esta página.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Contacta al administrador si necesitas acceso.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;