import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, User, Lock, Trash } from 'lucide-react';
import { useOperador } from '@/contexts/OperadorContext';
import { login as authLogin } from '@/services/authService';

const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: loginOperador, logout } = useOperador();
  const navigate = useNavigate(); // ✅ Hook para navegação

  // ✅ FORÇA LIMPEZA TOTAL AO ABRIR A PÁGINA
  useEffect(() => {
    const limpezaTotal = () => {
      // Remove TODOS os itens do localStorage
      localStorage.clear();

      // Remove cookies (se houver)
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      console.log('🧹 LIMPEZA TOTAL REALIZADA - Tokens e dados removidos');
    };

    limpezaTotal();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔐 Fazendo login com credenciais:', { login });

      // ✅ FORÇA LIMPEZA ANTES DO LOGIN
      localStorage.clear();

      // Usa o serviço de autenticação em vez de chamada direta ao axios
      const response = await authLogin({
        login,
        senha
      });

      console.log('✅ Resposta do servidor:', response);

      const { token, operador } = response;

      // ✅ VALIDAÇÃO DO TOKEN
      if (!token || token.length < 10) {
        throw new Error('Token inválido recebido do servidor');
      }

      // Salvar dados (o token já é salvo pelo authService)
      localStorage.setItem('operadorData', JSON.stringify(operador));

      // Salvar no contexto
      loginOperador(token, operador);

      console.log('🎯 NOVO TOKEN SALVO:', token.substring(0, 20) + '...');
      console.log('👤 OPERADOR:', operador.nome);

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${operador.nome}!`,
        className: "bg-green-100 text-green-800",
      });

      // ✅ REDIRECIONAMENTO FORÇADO APÓS LOGIN
      console.log('🚀 Redirecionando para dashboard...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000); // 1 segundo para ver o toast

    } catch (error: any) {
      console.error('❌ ERRO COMPLETO:', error);
      console.error('❌ Status:', error?.response?.status);
      console.error('❌ Dados:', error?.response?.data);

      const errorMessage = error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Erro ao fazer login. Verifique suas credenciais.';

      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const limpezaCompleta = () => {
    localStorage.clear();
    logout();
    setLogin('');
    setSenha('');

    toast({
      title: "Limpeza completa",
      description: "Todos os dados foram removidos.",
    });
  };

  const preencherMaster = () => {
    setLogin('admin.master');
    setSenha('Admin@123');
  };

  // Função de teste removida por questões de segurança

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Sistema de Saúde
            </CardTitle>
            <p className="text-center text-gray-600">
              Faça login para acessar o sistema
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                      id="login"
                      type="text"
                      placeholder="Digite seu login"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      className="pl-10"
                      required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="pl-10 pr-10"
                      required
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={limpezaCompleta}
                    className="px-3"
                    title="Limpeza completa"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Botões de utilidade */}
            <div className="mt-4 space-y-2">
              <Button
                  type="button"
                  variant="secondary"
                  onClick={preencherMaster}
                  className="w-full"
              >
                Preencher Credenciais Master
              </Button>

              {/* Botão de teste removido por questões de segurança */}
            </div>

            {/* Credenciais de teste */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
              <p className="font-medium text-gray-700">Credenciais Master:</p>
              <p className="text-gray-600">Login: admin.master</p>
              <p className="text-gray-600">Senha: Admin@123</p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Login;
