import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useOperador } from '@/contexts/OperadorContext';
import { Button } from '@/components/ui/button';
import {
    LogOut, LayoutDashboard, Users, Calendar, Stethoscope, Smile, Boxes,
    ClipboardCheck, Pill, DollarSign, MessageSquare, Truck, Syringe,
    Leaf, ShieldCheck, Biohazard, Filter, Settings
} from 'lucide-react';

// Define the interface for menu items
interface MenuItem {
    path: string;
    label: string;
    icon: React.ElementType;
    adminOnly?: boolean;
}

const Layout: React.FC = () => {
    const { operador, logout } = useOperador();

    const menuItems: MenuItem[] = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/recepcao', label: 'Recepção', icon: Users },
        { path: '/triagem', label: 'Triagem', icon: Filter },
        // { path: '/recepcao', label: 'Agendamento', icon: Calendar },
        { path: '/atendimentover-medico', label: 'Atendimento', icon: Stethoscope },
        { path: '/atendimentover-odontologico', label: 'Odontológico', icon: Smile },
        { path: '/exames', label: 'Exames', icon: ClipboardCheck },
        { path: '/vacinas', label: 'Vacinas', icon: Syringe },
        { path: '/farmacia', label: 'Farmácia', icon: Pill },
        { path: '/estoque', label: 'Estoque', icon: Boxes },
        { path: '/transporte', label: 'Transporte', icon: Truck },
        { path: '/faturamento', label: 'Faturamento', icon: DollarSign },
        { path: '/epidemiologia', label: 'Epidemiologia', icon: Biohazard },
        { path: '/vigilancia-sanitaria', label: 'Vig. Sanitária', icon: ShieldCheck },
        { path: '/vigilancia-ambiental', label: 'Vig. Ambiental', icon: Leaf },
        { path: '/ouvidoria', label: 'Ouvidoria', icon: MessageSquare },
        { path: '/assistencia-social', label: 'Assistência Social', icon: ShieldCheck },
        { path: '/configuracoes', label: 'Configuração do Sistema', icon: Settings, adminOnly: true }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 text-white">
                <h2 className="mb-6 text-2xl font-semibold">Conexão Saúde</h2>
                <nav>
                    <ul>
                        {menuItems.map((item) => {
                            const Icon = item.icon; // Corrigir renderização do ícone
                            const perfilNecessario = item.label.toUpperCase().replace(/ /g, '_');

                            // Se o item for apenas para admin, verificar se o usuário é admin.master
                            if (item.adminOnly && operador?.login !== 'admin.master') {
                                return null;
                            }

                            // Para outros itens, verificar perfis normalmente
                            if (operador?.isMaster || operador?.perfis.includes(perfilNecessario)) {
                                return (
                                    <li key={item.path} className="mb-2">
                                        <Link 
                                            to={item.path} 
                                            className={`flex items-center gap-2 hover:underline ${item.adminOnly ? 'text-yellow-300 font-semibold' : ''}`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            }

                            return null;
                        })}
                    </ul>
                </nav>

                <Button onClick={logout} variant="ghost" className="mt-4 w-full flex justify-start gap-2">
                    <LogOut className="w-4 h-4" /> Sair
                </Button>
            </aside>

            <main className="flex-1 p-6 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
