import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Pencil, Trash2, Key, Check, X, Search, RefreshCw } from 'lucide-react';
import configuracaoService, { Operador } from '@/services/ConfiguracaoService';

const OperatorManagement: React.FC = () => {
  const { toast } = useToast();
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [perfis, setPerfis] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Estados para o formulário de operador
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [selectedOperador, setSelectedOperador] = useState<Operador | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  
  // Estado do formulário
  const [formData, setFormData] = useState<Operador>({
    nome: '',
    login: '',
    email: '',
    senha: '',
    ativo: true,
    isMaster: false,
    perfis: []
  });

  // Carregar operadores e perfis ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carregar operadores
        const operadoresData = await configuracaoService.listarOperadores();
        setOperadores(operadoresData);
        
        // Carregar perfis
        const perfisData = await configuracaoService.listarPerfis();
        setPerfis(perfisData.map(p => p.nome));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados. Tente novamente mais tarde.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Filtrar operadores pelo termo de busca
  const filteredOperadores = operadores.filter(operador => 
    operador.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    operador.login?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operador.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir formulário para criar novo operador
  const handleOpenCreateForm = () => {
    setFormData({
      nome: '',
      login: '',
      email: '',
      senha: '',
      ativo: true,
      isMaster: false,
      perfis: []
    });
    setFormMode('create');
    setIsDialogOpen(true);
  };

  // Abrir formulário para editar operador
  const handleOpenEditForm = (operador: Operador) => {
    setFormData({
      ...operador,
      senha: '' // Não exibir senha atual
    });
    setFormMode('edit');
    setIsDialogOpen(true);
  };

  // Abrir diálogo para alterar senha
  const handleOpenPasswordDialog = (operador: Operador) => {
    setSelectedOperador(operador);
    setNewPassword('');
    setIsPasswordDialogOpen(true);
  };

  // Abrir diálogo para confirmar exclusão
  const handleOpenDeleteDialog = (operador: Operador) => {
    setSelectedOperador(operador);
    setIsDeleteDialogOpen(true);
  };

  // Atualizar campo do formulário
  const handleFormChange = (field: keyof Operador, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Alternar perfil na lista de perfis do operador
  const handleTogglePerfil = (perfil: string) => {
    setFormData(prev => {
      const perfis = [...(prev.perfis || [])];
      if (perfis.includes(perfil)) {
        return { ...prev, perfis: perfis.filter(p => p !== perfil) };
      } else {
        return { ...prev, perfis: [...perfis, perfil] };
      }
    });
  };

  // Salvar operador (criar ou atualizar)
  const handleSaveOperador = async () => {
    // Validar formulário
    if (!formData.nome || !formData.login) {
      toast({
        title: 'Erro',
        description: 'Nome e login são campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }
    
    if (formMode === 'create' && !formData.senha) {
      toast({
        title: 'Erro',
        description: 'Senha é obrigatória para novos operadores.',
        variant: 'destructive'
      });
      return;
    }
    
    setFormLoading(true);
    try {
      let result;
      if (formMode === 'create') {
        result = await configuracaoService.criarOperador(formData);
      } else {
        result = await configuracaoService.atualizarOperador(formData.id!, formData);
      }
      
      if (result) {
        // Atualizar lista de operadores
        if (formMode === 'create') {
          setOperadores(prev => [...prev, result!]);
        } else {
          setOperadores(prev => prev.map(op => op.id === result!.id ? result! : op));
        }
        
        setIsDialogOpen(false);
        toast({
          title: 'Sucesso',
          description: formMode === 'create' 
            ? 'Operador criado com sucesso!' 
            : 'Operador atualizado com sucesso!',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Erro ao salvar operador:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o operador. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Alterar senha do operador
  const handleChangePassword = async () => {
    if (!selectedOperador || !newPassword) {
      toast({
        title: 'Erro',
        description: 'Senha não pode ser vazia.',
        variant: 'destructive'
      });
      return;
    }
    
    setFormLoading(true);
    try {
      const success = await configuracaoService.alterarSenhaOperador(selectedOperador.id!, newPassword);
      
      if (success) {
        setIsPasswordDialogOpen(false);
        toast({
          title: 'Sucesso',
          description: 'Senha alterada com sucesso!',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar a senha. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Excluir operador
  const handleDeleteOperador = async () => {
    if (!selectedOperador) return;
    
    setFormLoading(true);
    try {
      const success = await configuracaoService.excluirOperador(selectedOperador.id!);
      
      if (success) {
        setOperadores(prev => prev.filter(op => op.id !== selectedOperador.id));
        setIsDeleteDialogOpen(false);
        toast({
          title: 'Sucesso',
          description: 'Operador excluído com sucesso!',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Erro ao excluir operador:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o operador. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Alternar status do operador (ativo/inativo)
  const handleToggleStatus = async (operador: Operador) => {
    try {
      const updatedOperador = await configuracaoService.alterarStatusOperador(
        operador.id!, 
        !operador.ativo
      );
      
      if (updatedOperador) {
        setOperadores(prev => prev.map(op => 
          op.id === updatedOperador.id ? updatedOperador : op
        ));
        
        toast({
          title: 'Sucesso',
          description: updatedOperador.ativo 
            ? 'Operador ativado com sucesso!' 
            : 'Operador desativado com sucesso!',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Erro ao alterar status do operador:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do operador. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    }
  };

  // Recarregar lista de operadores
  const handleReloadOperadores = async () => {
    setLoading(true);
    try {
      const operadoresData = await configuracaoService.listarOperadores();
      setOperadores(operadoresData);
      toast({
        title: 'Sucesso',
        description: 'Lista de operadores atualizada com sucesso!',
        variant: 'default'
      });
    } catch (error) {
      console.error('Erro ao recarregar operadores:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível recarregar a lista de operadores. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Operadores</CardTitle>
        <CardDescription>
          Crie, edite e gerencie os operadores do sistema. Operadores são os usuários que têm acesso ao sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar operadores..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReloadOperadores} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Atualizar</span>
            </Button>
            <Button onClick={handleOpenCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Operador
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando operadores...</span>
          </div>
        ) : filteredOperadores.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Nenhum operador encontrado para a busca.' : 'Nenhum operador cadastrado.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperadores.map((operador) => (
                <TableRow key={operador.id}>
                  <TableCell className="font-medium">{operador.nome}</TableCell>
                  <TableCell>{operador.login}</TableCell>
                  <TableCell>{operador.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {operador.perfis?.map(perfil => (
                        <span 
                          key={perfil} 
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {perfil}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {operador.ativo ? (
                        <span className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" />
                          Ativo
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <X className="h-4 w-4 mr-1" />
                          Inativo
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleStatus(operador)}
                        title={operador.ativo ? "Desativar operador" : "Ativar operador"}
                      >
                        {operador.ativo ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenPasswordDialog(operador)}
                        title="Alterar senha"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenEditForm(operador)}
                        title="Editar operador"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(operador)}
                        title="Excluir operador"
                        disabled={operador.login === 'admin.master'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Diálogo de Criar/Editar Operador */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {formMode === 'create' ? 'Criar Novo Operador' : 'Editar Operador'}
              </DialogTitle>
              <DialogDescription>
                {formMode === 'create' 
                  ? 'Preencha os dados para criar um novo operador.' 
                  : 'Edite os dados do operador.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleFormChange('nome', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  value={formData.login}
                  onChange={(e) => handleFormChange('login', e.target.value)}
                  placeholder="Login de acesso"
                  disabled={formMode === 'edit'} // Não permitir alterar login
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="Email do operador"
                />
              </div>
              {formMode === 'create' && (
                <div className="grid gap-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha || ''}
                    onChange={(e) => handleFormChange('senha', e.target.value)}
                    placeholder="Senha de acesso"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label>Perfis de Acesso</Label>
                <div className="border rounded-md p-3 space-y-2">
                  {perfis.map(perfil => (
                    <div key={perfil} className="flex items-center space-x-2">
                      <Checkbox
                        id={`perfil-${perfil}`}
                        checked={formData.perfis?.includes(perfil) || false}
                        onCheckedChange={() => handleTogglePerfil(perfil)}
                      />
                      <Label htmlFor={`perfil-${perfil}`} className="cursor-pointer">
                        {perfil}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo || false}
                  onCheckedChange={(checked) => handleFormChange('ativo', checked)}
                />
                <Label htmlFor="ativo">Ativo</Label>
              </div>
              {formData.login !== 'admin.master' && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isMaster"
                    checked={formData.isMaster || false}
                    onCheckedChange={(checked) => handleFormChange('isMaster', checked)}
                  />
                  <Label htmlFor="isMaster">Administrador Master</Label>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveOperador} disabled={formLoading}>
                {formLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {formMode === 'create' ? 'Criar Operador' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Alterar Senha */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Alterar Senha</DialogTitle>
              <DialogDescription>
                Digite a nova senha para o operador {selectedOperador?.nome}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nova senha"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleChangePassword} disabled={formLoading}>
                {formLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Alterar Senha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Confirmar Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o operador {selectedOperador?.nome}?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteOperador} 
                disabled={formLoading}
              >
                {formLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Excluir Operador
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default OperatorManagement;