// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';

interface User {
  id?: number;
  nombre: string;
  usuario: string;
  rol: 'ADMIN' | 'TECNICO' | 'SUPER_ADMIN';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('🔄 Usuario cargado desde localStorage:', parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Iniciando login...', { username });
      
      // ✅ PASO 1: Obtener token y datos del backend
      const userData = await authService.login({ username, password });
      console.log('✅ Datos recibidos del login:', userData);
      
      // ✅ PASO 2: Guardar token para futuras peticiones
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify({
        nombre: userData.nombre,
        usuario: userData.usuario,
        rol: userData.rol
      }));
      
      setUser({
        nombre: userData.nombre,
        usuario: userData.usuario,
        rol: userData.rol
      });
      
      console.log('✅ Login EXITOSO - Token guardado:', userData.token);
      return true;
      
    } catch (error: any) {
      console.error('❌ ERROR en login:', error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🚪 Sesión cerrada');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};