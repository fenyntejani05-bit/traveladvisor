import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, getErrorMessage } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Validate session on app initialization
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await authService.getProfile();
          if (response.data && response.data.data && response.data.data.user) {
            setUser(response.data.data.user);
            setToken(storedToken);
          } else {
            // Unexpected profile schema, clear token
            logout();
          }
        } catch (err) {
          console.error('Session restoration failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(credentials);
      const { user: userData, token: jwtToken } = response.data.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(jwtToken);
      setUser(userData);
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      const errMsg = getErrorMessage(err);
      setError(errMsg);
      setLoading(false);
      return { success: false, error: errMsg };
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.register(userData);
      const { user: newUser, token: jwtToken } = response.data.data;

      if (jwtToken) {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(jwtToken);
        setUser(newUser);
      }

      setLoading(false);
      return { success: true, user: newUser };
    } catch (err) {
      const errMsg = getErrorMessage(err);
      setError(errMsg);
      setLoading(false);
      return { success: false, error: errMsg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError('');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    loading,
    error,
    login,
    register,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
