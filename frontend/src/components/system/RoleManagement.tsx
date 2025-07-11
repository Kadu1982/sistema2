import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Pencil, Trash2, Search, RefreshCw, Shield } from 'lucide-react';
import configuracaoService, { Perfil } from '@/services/ConfiguracaoService';

const RoleManagement: React.FC = () => {
  const { toast } = useToast();
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [permissoes, setPermissoes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Estados para o formulário de perfil
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [selectedPerfil, setSelectedPerfil] = useState<Perfil | null>(null);
  
  // Estado do formulário
  const [formData, setFormData] = useState<Perfil>({
    nome: '',
    descricao: '',
    permissoes: []
  });

  // Carregar perfis e permissões ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carregar perfis
        const perfisData = await configuracaoService.listarPerfis();
        setPerfis(perfisData);
        
        // Carregar permissões
        const permissoesData = await configuracaoService.listarPermissoes();
        setPermissoes(permissoesData);
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

  // Filtrar perfis pelo termo de busca
  const filteredPerfis = perfis.filter(perfil => 
    perfil.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    perfil.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir formulário para criar novo perfil
  const handleOpenCreateForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      permissoes: []
    });
    setFormMode('create');
    setIsDialogOpen(true);
  };

  // Abrir formulário para editar perfil
  const handleOpenEditForm = (perfil: Perfil) => {
    setFormData({
      ...perfil
    });
    setFormMode('edit');
    setIsDialogOpen(true);
  };

  // Abrir diálogo para gerenciar permissões
  const handleOpenPermissionsDialog = (perfil: Perfil) => {
    setSelectedPerfil(perfil);
    setFormData({
      ...perfil
    });
    setIsPermissionsDialogOpen(true);
  };

  // Abrir diálogo para confirmar exclusão
  const handleOpenDeleteDialog = (perfil: Perfil) => {
    setSelectedPerfil(perfil);
    setIsDeleteDialogOpen(true);
  };

  // Atualizar campo do formulário
  const handleFormChange = (field: keyof Perfil, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Alternar permissão na lista de permissões do perfil
  const handleTogglePermissao = (permissao: string) => {
    setFormData(prev => {
      const permissoes = [...(prev.permissoes || [])];
      if (permissoes.includes(permissao)) {
        return { ...prev, permissoes: permissoes.filter(p => p !== permissao) };
      } else {
        return { ...prev, permissoes: [...permissoes, permissao] };
      }
    });
  };

  // Salvar perfil (criar ou atualizar)
  const handleSavePerfil = async () => {
    // Validar formulário
    if (!formData.nome) {
      toast({
        title: 'Erro',
        description: 'Nome é um campo obrigatório.',
        variant: 'destructive'
      });
      return;
    }
    
    setFormLoading(true);
    try {
      let result;
      if (formMode === 'create') {
        result = await configuracaoService.criarPerfil(formData);
      } else {
        result = await configuracaoService.atualizarPerfil(formData.id!, formData);
      }
      
      if (result) {
        // Atualizar lista de perfis
        if (formMode === 'create') {
          setPerfis(prev => [...prev, result!]);
        } else {
          setPerfis(prev => prev.map(p => p.id === result!.id ? result! : p));
        }
        
        setIsDialogOpen(false);
        toast({
          title: 'Sucesso',
          description: formMode === 'create' 
            ? 'Perfil criado com sucesso!' 
            : 'Perfil atualizado com sucesso!',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o perfil. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Salvar permissões do perfil
  const handleSavePermissions = async () => {
    if (!selectedPerfil) return;
    
    setFormLoading(true);
    try {
      const result = await configuracaoService.atribuirPermissoes(
        selectedPerfil.id!, 
        formData.permissoes || []
      );
      
      if (result) {
        // Atualizar lista de perfis
        setPerfis(prev => prev.map(p => p.id === result.id ? result : p));
        
        setIsPermissionsDialogOpen(false);
        toast({
          title: 'Sucesso',
          description: 'Permissões atualizadas com sucesso!',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as permissões. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Excluir perfil
  const handleDeletePerfil = async () => {
    if (!selectedPerfil) return;
    
    setFormLoading(true);
    try {
      const success = await configuracaoService.excluirPerfil(selectedPerfil.id!);
      
      if (success) {
        setPerfis(prev => prev.filter(p => p.id !== selectedPerfil.id));
        setIsDeleteDialogOpen(false);
        toast({
          title: 'Sucesso',
          description: 'Perfil excluído com sucesso!',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o perfil. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Recarregar lista de perfis
  const handleReloadPerfis = async () => {
    setLoading(true);
    try {
      const perfisData = await configuracaoService.listarPerfis();
      setPerfis(perfisData);
      toast({
        title: 'Sucesso',
        description: 'Lista de perfis atualizada com sucesso!',
        variant: 'default'
      });
    } catch (error) {
      console.error('Erro ao recarregar perfis:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível recarregar a lista de perfis. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Agrupar permissões por categoria
  const groupedPermissions = permissoes.reduce((acc, permissao) => {
    const parts = permissao.split('_');
    const category = parts.length > 1 ? parts[0] : 'OUTROS';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(permissao);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Perfis e Permissões</CardTitle>
        <CardDescription>
          Crie, edite e gerencie os perfis de acesso e suas permissões. Perfis são conjuntos de permissões que podem ser atribuídos aos operadores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar perfis..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReloadPerfis} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Atualizar</span>
            </Button>
            <Button onClick={handleOpenCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Perfil
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando perfis...</span>
          </div>
        ) : filteredPerfis.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Nenhum perfil encontrado para a busca.' : 'Nenhum perfil cadastrado.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPerfis.map((perfil) => (
                <TableRow key={perfil.id}>
                  <TableCell className="font-medium">{perfil.nome}</TableCell>
                  <TableCell>{perfil.descricao}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-sm">
                        {perfil.permissoes?.length || 0} permissões
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {perfil.sistemaPerfil ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Sistema
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Personalizado
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenPermissionsDialog(perfil)}
                        title="Gerenciar permissões"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenEditForm(perfil)}
                        title="Editar perfil"
                        disabled={perfil.sistemaPerfil}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(perfil)}
                        title="Excluir perfil"
                        disabled={perfil.sistemaPerfil}
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

        {/* Diálogo de Criar/Editar Perfil */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {formMode === 'create' ? 'Criar Novo Perfil' : 'Editar Perfil'}
              </DialogTitle>
              <DialogDescription>
                {formMode === 'create' 
                  ? 'Preencha os dados para criar um novo perfil.' 
                  : 'Edite os dados do perfil.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleFormChange('nome', e.target.value)}
                  placeholder="Nome do perfil"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao || ''}
                  onChange={(e) => handleFormChange('descricao', e.target.value)}
                  placeholder="Descrição do perfil"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePerfil} disabled={formLoading}>
                {formLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {formMode === 'create' ? 'Criar Perfil' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Gerenciar Permissões */}
        <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerenciar Permissões</DialogTitle>
              <DialogDescription>
                Selecione as permissões para o perfil {selectedPerfil?.nome}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-semibold mb-2 text-primary">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-3">
                    {permissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission}`}
                          checked={formData.permissoes?.includes(permission) || false}
                          onCheckedChange={() => handleTogglePermissao(permission)}
                        />
                        <Label htmlFor={`permission-${permission}`} className="cursor-pointer text-sm">
                          {permission}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePermissions} disabled={formLoading}>
                {formLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Salvar Permissões
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
                Tem certeza que deseja excluir o perfil {selectedPerfil?.nome}?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeletePerfil} 
                disabled={formLoading}
              >
                {formLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Excluir Perfil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RoleManagement;