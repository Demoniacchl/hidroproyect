import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          La página que estás buscando no existe o no tienes permisos para acceder.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;