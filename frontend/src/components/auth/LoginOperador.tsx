import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useOperador } from '@/contexts/OperadorContext';
import apiService from '@/services/apiService'; // Seu serviço de API
import { Button } from '@/components/ui/button'; // Assumindo shadcn/ui
import { Input } from '@/components/ui/input';   // Assumindo shadcn/ui
import { Label } from '@/components/ui/label';   // Assumindo shadcn/ui
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Assumindo shadcn/ui
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"; // Assumindo shadcn/ui
import { Loader2 } from 'lucide-react'; // Para o ícone de carregamento

// Define o schema Zod para validação do formulário
const loginSchema = z.object({
  login: z.string().min(1, { message: "O campo login é obrigatório." }),
  senha: z.string().min(1, { message: "O campo senha é obrigatório." }),
});

// Define o tipo para os valores do formulário inferido do schema Zod
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginOperador() {
  const navigate = useNavigate();
  const { login: loginContextAction } = useOperador(); // Renomeado para evitar conflito de nome
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Configuração do react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      senha: '',
    },
  });

  // Função para lidar com a submissão do formulário
  const handleLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await apiService.post('/auth/login', {
        login: data.login, // Usa o 'login' do formulário validado
        senha: data.senha, // Usa a 'senha' do formulário validado
      });

      // Assumindo que response.data contém { token: string, operador: Operador }
      const { token, operador } = response.data;

      // Passo crítico: Garanta que a função 'login' do seu OperadorContext
      // lide corretamente com esses parâmetros e armazene o token.
      loginContextAction(token, operador);

      // Navegação baseada nos perfis do operador
      if (operador.perfis?.includes('ADMINISTRADOR_DO_SISTEMA')) {
        navigate('/dashboard');
      } else if (operador.perfis?.includes('RECEPCAO')) {
        navigate('/recepcao');
      } else {
        // Navegação padrão para outros perfis ou se nenhum perfil específico for encontrado
        navigate('/dashboard');
      }
    } catch (error: any) { // Tipagem 'any' para o erro para acessar error.response
      console.error("Erro no login:", error);
      if (error.response && error.response.data && error.response.data.message) {
        // Se o backend enviar uma mensagem de erro específica
        setServerError(error.response.data.message);
      } else if (error.response && error.response.status === 401) {
        // Erro de não autorizado (credenciais inválidas)
        setServerError('Usuário ou senha inválidos.');
      } else {
        // Outros tipos de erro (rede, servidor, etc.)
        setServerError('Falha ao tentar fazer login. Verifique sua conexão ou tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login do Operador</CardTitle>
            <CardDescription className="text-center">
              Acesse o painel de gestão do sistema.
            </CardDescription>
          </CardHeader>
          <Form {...form}> {/* Envolve o formulário com o provedor do react-hook-form */}
            <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="login"
                    render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="loginInput">Login</Label>
                          <FormControl>
                            <Input
                                id="loginInput"
                                placeholder="Seu login de usuário"
                                {...field} // Conecta o input ao react-hook-form
                                disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage /> {/* Exibe mensagens de erro de validação */}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="senha"
                    render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="senhaInput">Senha</Label>
                          <FormControl>
                            <Input
                                id="senhaInput"
                                type="password"
                                placeholder="Sua senha"
                                {...field} // Conecta o input ao react-hook-form
                                disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage /> {/* Exibe mensagens de erro de validação */}
                        </FormItem>
                    )}
                />
                {serverError && (
                    <p className="text-sm font-medium text-destructive">
                      {serverError}
                    </p>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                  ) : (
                      'Entrar'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
  );
}
