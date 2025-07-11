// src/contexts/OperadorContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/services/apiService';
import { Operador } from '@/types/Operador';

interface OperadorContextType {
  operador: Operador | null;
  token: string | null;
  login: (token: string, operador: Operador) => void;
  logout: () => void;
}

const OperadorContext = createContext<OperadorContextType | undefined>(undefined);

export const OperadorProvider = ({ children }: { children: ReactNode }) => {
  const [operador, setOperador] = useState<Operador | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedOperador = localStorage.getItem('operadorData');

    if (storedToken && storedOperador) {
      try {
        const parsedOperador: Operador = JSON.parse(storedOperador);
        setToken(storedToken);
        setOperador(parsedOperador);
        apiService.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Erro ao parsear dados do operador do localStorage:", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('operadorData');
        delete apiService.defaults.headers.common['Authorization'];
      }
    }
  }, []);

  const login = (newToken: string, operadorData: Operador) => {
    setToken(newToken);
    setOperador(operadorData);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('operadorData', JSON.stringify(operadorData));
    apiService.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setOperador(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('operadorData');
    delete apiService.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
      <OperadorContext.Provider value={{ operador, token, login, logout }}>
        {children}
      </OperadorContext.Provider>
  );
};

export const useOperador = () => {
  const context = useContext(OperadorContext);
  if (context === undefined) {
    throw new Error('useOperador deve ser usado dentro de um OperadorProvider');
  }
  return context;
};