import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../ui/Input/Input';
import Button from '../../ui/Button/Button';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../../services/auth.service';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await authService.login(formData);
      login(userData);
      
      // Redirigir según el rol
      switch (userData.rol) {
        case 'SUPER_ADMIN':
          navigate('/super-admin');
          break;
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'TECNICO':
          navigate('/tecnico');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err: any) {
      setError('Credenciales inválidas. Por favor intenta nuevamente.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (usuario: string, contrasena: string) => {
    setFormData({ usuario, contrasena });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔧</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sistema de Mantenciones
          </h1>
          <p className="text-gray-600 mt-2">
            Ingresa a tu cuenta
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Usuario"
            type="text"
            placeholder="Ingresa tu usuario"
            value={formData.usuario}
            onChange={(value) => handleChange('usuario', value)}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={formData.contrasena}
            onChange={(value) => handleChange('contrasena', value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!formData.usuario || !formData.contrasena}
            className="w-full"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3 text-center">
            Cuentas de Demo
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => fillDemoCredentials('superadmin', 'password')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
            >
              <strong>Super Admin:</strong> superadmin / password
            </button>
            <button
              onClick={() => fillDemoCredentials('admin', 'password')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
            >
              <strong>Admin:</strong> admin / password
            </button>
            <button
              onClick={() => fillDemoCredentials('tecnico', 'password')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
            >
              <strong>Técnico:</strong> tecnico / password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;