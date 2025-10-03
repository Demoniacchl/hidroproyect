// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: number;
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

// 👇 Cambia ReactNode por React.ReactNode
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
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
      const users = {
        'admin': { id: 1, nombre: 'Administrador', rol: 'ADMIN' as const },
        'tecnico': { id: 2, nombre: 'Técnico', rol: 'TECNICO' as const },
        'superadmin': { id: 3, nombre: 'Super Admin', rol: 'SUPER_ADMIN' as const }
      };

      if (users[username as keyof typeof users] && password === 'password') {
        const userData = users[username as keyof typeof users];
        const user = { ...userData, usuario: username };
        
        setUser(user);
        localStorage.setItem('token', 'fake-jwt-token');
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
export default AuthContext;