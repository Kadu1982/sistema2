import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Layout from '../Layout';

// Importação de todas as páginas
import Login from '@/pages/Login';
import Dashboard from '@/pages/dashboard/Dashboard';
import Recepcao from '@/pages/recepcao/Recepcao';
import Triagem from '@/pages/triagem/Triagem';
import AtendimentoMedico from '@/pages/AtendimentoMedico'; // ✅ CORRIGIDO: import direto da pasta pages
import AtendimentoOdontologico from '@/pages/AtendimentoOdontologico'; // ✅ CORRIGIDO: import direto da pasta pages
import Exames from '@/pages/Exames';
import Vacinas from '@/pages/Vacinas';
import Farmacia from '@/pages/Farmacia';
import Estoque from '@/pages/Estoque';
import Transporte from '@/pages/Transporte';
import Faturamento from '@/pages/Faturamento';
import Epidemiologia from '@/pages/Epidemiologia';
import VigilanciaSanitaria from '@/pages/VigilanciaSanitaria';
import VigilanciaAmbiental from '@/pages/VigilanciaAmbiental';
import Ouvidoria from '@/pages/Ouvidoria';
import NotFound from '@/pages/NotFound';
import Pacientes from '@/pages/Pacientes';
import NovoPacientePage from '@/pages/pacientes/NovoPacientePage';
import EditarPacientePage from '@/pages/pacientes/EditarPacientePage';
import AssistenciaSocial from '@/pages/AssistenciaSocial';
import SystemConfig from '@/pages/SystemConfig';
import Agendamento from '@/pages/Agendamento'; // ✅ ADICIONADO: página de agendamento

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* ✅ Recepção com parâmetro de aba opcional */}
                    <Route path="/recepcao/:tab?" element={<Recepcao />} />

                    {/* ✅ Agendamento */}
                    <Route path="/agendamento" element={<Agendamento />} />

                    <Route path="/triagem" element={<Triagem />} />
                    <Route path="/atendimento-medico" element={<AtendimentoMedico />} />
                    <Route path="/atendimento-odontologico" element={<AtendimentoOdontologico />} />
                    <Route path="/exames" element={<Exames />} />
                    <Route path="/vacinas" element={<Vacinas />} />
                    <Route path="/farmacia" element={<Farmacia />} />
                    <Route path="/estoque" element={<Estoque />} />
                    <Route path="/transporte" element={<Transporte />} />
                    <Route path="/faturamento" element={<Faturamento />} />
                    <Route path="/epidemiologia" element={<Epidemiologia />} />
                    <Route path="/vigilancia-sanitaria" element={<VigilanciaSanitaria />} />
                    <Route path="/vigilancia-ambiental" element={<VigilanciaAmbiental />} />
                    <Route path="/ouvidoria" element={<Ouvidoria />} />
                    <Route path="/assistencia-social" element={<AssistenciaSocial />} />

                    {/* CRUD de Pacientes */}
                    <Route path="/pacientes" element={<Pacientes />} />
                    <Route path="/pacientes/novo" element={<NovoPacientePage />} />
                    <Route path="/pacientes/:id/editar" element={<EditarPacientePage />} />

                    {/* Configuração do Sistema (apenas admin.master) */}
                    <Route path="/configuracao" element={<SystemConfig />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};