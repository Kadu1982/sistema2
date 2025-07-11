// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useOperador } from '@/contexts/OperadorContext';

/**
 * Rota protegida — garante que o operador esteja autenticado.
 * O acesso por perfis será controlado individualmente em cada componente.
 */
export const ProtectedRoute: React.FC = () => {
  const { operador, token } = useOperador();

  // Se não houver operador ou token, redireciona para login
  if (!operador || !token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Permite acesso a qualquer rota protegida — permissões serão tratadas nos componentes
  return <Outlet />;
};
