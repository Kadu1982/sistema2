import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import configuracaoService, { Configuracao } from '@/services/ConfiguracaoService';

// Grupos de configuração
const GRUPOS_CONFIGURACAO = [
  { id: 'geral', nome: 'Configurações Gerais' },
  { id: 'email', nome: 'Configurações de E-mail' },
  { id: 'seguranca', nome: 'Configurações de Segurança' },
  { id: 'integracao', nome: 'Configurações de Integração' },
  { id: 'sistema', nome: 'Configurações do Sistema' }
];

const SystemSettings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('geral');
  const [configuracoes, setConfiguracoes] = useState<Record<string, Configuracao[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [editedConfigs, setEditedConfigs] = useState<Record<string, Configuracao>>({});

  // Carregar configurações ao montar o componente e quando o tab mudar
  useEffect(() => {
    const carregarConfiguracoes = async () => {
      setLoading(true);
      try {
        // Carregar configurações do grupo ativo
        const configs = await configuracaoService.listarConfiguracoesPorGrupo(activeTab);
        setConfiguracoes(prev => ({
          ...prev,
          [activeTab]: configs
        }));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações. Tente novamente mais tarde.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    // Se ainda não carregou as configurações deste grupo, carrega
    if (!configuracoes[activeTab]) {
      carregarConfiguracoes();
    }
  }, [activeTab, toast, configuracoes]);

  // Função para atualizar o valor de uma configuração
  const handleConfigChange = (config: Configuracao, value: string) => {
    const updatedConfig = { ...config, valor: value };
    setEditedConfigs(prev => ({
      ...prev,
      [config.chave]: updatedConfig
    }));
  };

  // Função para salvar as configurações editadas
  const handleSaveConfigs = async () => {
    setSaving(true);
    try {
      const promises = Object.values(editedConfigs).map(config => 
        configuracaoService.atualizarConfiguracao(config.chave, config)
      );
      
      await Promise.all(promises);
      
      // Atualiza o estado com as configurações salvas
      const updatedConfigs = { ...configuracoes };
      Object.values(editedConfigs).forEach(config => {
        const groupIndex = updatedConfigs[activeTab]?.findIndex(c => c.chave === config.chave) ?? -1;
        if (groupIndex !== -1 && updatedConfigs[activeTab]) {
          updatedConfigs[activeTab][groupIndex] = config;
        }
      });
      
      setConfiguracoes(updatedConfigs);
      setEditedConfigs({});
      
      toast({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso!',
        variant: 'default'
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Função para recarregar as configurações
  const handleReloadConfigs = async () => {
    setLoading(true);
    try {
      const configs = await configuracaoService.listarConfiguracoesPorGrupo(activeTab);
      setConfiguracoes(prev => ({
        ...prev,
        [activeTab]: configs
      }));
      setEditedConfigs({});
      
      toast({
        title: 'Sucesso',
        description: 'Configurações recarregadas com sucesso!',
        variant: 'default'
      });
    } catch (error) {
      console.error('Erro ao recarregar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível recarregar as configurações. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Renderiza o campo de configuração de acordo com o tipo
  const renderConfigField = (config: Configuracao) => {
    const isEdited = !!editedConfigs[config.chave];
    const currentValue = isEdited ? editedConfigs[config.chave].valor : config.valor;
    
    // Verifica se a configuração é editável
    if (config.editavel === false) {
      return (
        <div className="flex items-center space-x-2">
          <Input 
            value={currentValue} 
            disabled 
            className="bg-gray-100"
          />
          <span className="text-xs text-gray-500">(Somente leitura)</span>
        </div>
      );
    }
    
    // Renderiza campo de acordo com o tipo
    switch (config.tipo?.toLowerCase()) {
      case 'boolean':
        return (
          <Switch 
            checked={currentValue === 'true'} 
            onCheckedChange={(checked) => handleConfigChange(config, checked ? 'true' : 'false')}
          />
        );
        
      case 'select':
        const options = config.valoresPossiveis?.split(',') || [];
        return (
          <Select 
            value={currentValue} 
            onValueChange={(value) => handleConfigChange(config, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.trim()} value={option.trim()}>
                  {option.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'textarea':
      case 'text':
        return (
          <Textarea 
            value={currentValue} 
            onChange={(e) => handleConfigChange(config, e.target.value)}
            rows={4}
          />
        );
        
      default:
        return (
          <Input 
            value={currentValue} 
            onChange={(e) => handleConfigChange(config, e.target.value)}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>
          Gerencie as configurações globais do sistema. Algumas configurações podem exigir reinicialização do servidor para terem efeito.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {GRUPOS_CONFIGURACAO.map(grupo => (
              <TabsTrigger key={grupo.id} value={grupo.id}>
                {grupo.nome}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {GRUPOS_CONFIGURACAO.map(grupo => (
            <TabsContent key={grupo.id} value={grupo.id} className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Carregando configurações...</span>
                </div>
              ) : configuracoes[grupo.id]?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma configuração encontrada para este grupo.
                </div>
              ) : (
                <>
                  <div className="grid gap-6">
                    {configuracoes[grupo.id]?.map(config => (
                      <div key={config.chave} className="space-y-2">
                        <Label htmlFor={config.chave} className="font-medium">
                          {config.descricao || config.chave}
                        </Label>
                        {renderConfigField(config)}
                        <p className="text-xs text-gray-500">
                          Chave: {config.chave} | Tipo: {config.tipo || 'texto'}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={handleReloadConfigs}
                      disabled={loading || saving}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Recarregar
                    </Button>
                    <Button
                      onClick={handleSaveConfigs}
                      disabled={Object.keys(editedConfigs).length === 0 || saving || loading}
                    >
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Salvar Alterações
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;