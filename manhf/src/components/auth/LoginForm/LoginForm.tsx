// src/components/auth/LoginForm/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/auth.service';
import './LoginForm.css';

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
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔄 LoginForm: Iniciando submit...');
      
      const springCredentials = {
        username: formData.usuario,
        password: formData.contrasena
      };
      
      console.log('📤 Credenciales enviadas:', springCredentials);
      
      // ✅ PASO 1: Probar authService directamente
      console.log('🔐 Probando authService directamente...');
      const userData = await authService.login(springCredentials);
      console.log('✅ authService respuesta:', userData);
      
      // ✅ PASO 2: Usar AuthContext para guardar token
      console.log('🔄 Llamando a login() del AuthContext...');
      const success = await login(formData.usuario, formData.contrasena);
      console.log('✅ Resultado de AuthContext login():', success);
      
      if (success) {
        console.log('🎯 Login EXITOSO, redirigiendo...');
        console.log('🔍 Token en localStorage:', localStorage.getItem('token'));
        console.log('🔍 User en localStorage:', localStorage.getItem('user'));
        
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
      } else {
        console.log('❌ AuthContext login() devolvió false');
        setError('Error en autenticación - AuthContext falló');
      }
    } catch (err: any) {
      console.error('💥 ERROR capturado en LoginForm:', err);
      setError(err.message || 'Credenciales inválidas. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Hidrohigiene</h1>
          <br></br>
          <p>Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={formData.usuario}
              onChange={(e) => handleChange('usuario', e.target.value)}
              placeholder="Ingresa tu usuario"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              value={formData.contrasena}
              onChange={(e) => handleChange('contrasena', e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !formData.usuario || !formData.contrasena}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;