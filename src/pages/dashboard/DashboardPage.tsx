import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCodesStore } from '../../stores/codesStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { Plus, Info, ArrowRight, Smartphone } from 'lucide-react';

export const DashboardPage = () => {
  const { addCodes, isAdding } = useCodesStore();

  const [singleCode, setSingleCode] = useState('');
  const [singleName, setSingleName] = useState('');
  const [bulkCodes, setBulkCodes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invalidCodes, setInvalidCodes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  const handleSingleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setInvalidCodes([]);

    if (!singleCode.trim()) {
      setError('Por favor, digite um código');
      return;
    }

    try {
      const result = await addCodes([
        { code: singleCode.trim(), name: singleName.trim() || undefined }
      ]);

      if (result.added > 0) {
        setSuccess(`Código "${singleCode}" adicionado com sucesso!`);
        setSingleCode('');
        setSingleName('');
      }

      if (result.invalid.length > 0) {
        setInvalidCodes(result.invalid);
      }
    } catch {
      setError('Erro ao adicionar código. Tente novamente.');
    }
  };

  const handleBulkSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setInvalidCodes([]);

    if (!bulkCodes.trim()) {
      setError('Por favor, digite pelo menos um código');
      return;
    }

    const lines = bulkCodes.split('\n').filter((line) => line.trim());
    const parsedCodes = lines.map((line) => {
      const parts = line.split(',').map((p) => p.trim());
      return {
        code: parts[0],
        name: parts[1] || undefined,
      };
    }).filter((item) => item.code.length > 0);

    if (parsedCodes.length === 0) {
      setError('Nenhum código válido encontrado. Verifique a formatação.');
      return;
    }

    try {
      const result = await addCodes(parsedCodes);

      if (result.added > 0) {
        setSuccess(`${result.added} código(s) adicionado(s) com sucesso!`);
        setBulkCodes('');
      }

      if (result.invalid.length > 0) {
        setInvalidCodes(result.invalid);
      }
    } catch {
      setError('Erro ao adicionar códigos. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Meus Códigos de Consulta
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Adicione e acompanhe seus códigos de consulta médica de forma simples e segura
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Alertas */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
            autoClose={false}
          />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
            autoClose
          />
        )}

        {invalidCodes.length > 0 && (
          <Alert
            type="warning"
            message={
              <div>
                <p className="font-semibold mb-1">Alguns códigos não puderam ser adicionados:</p>
                <p className="text-sm">{invalidCodes.join(', ')}</p>
              </div>
            }
            onClose={() => setInvalidCodes([])}
            autoClose={false}
          />
        )}

        {/* Tabs para Mobile */}
        <div className="md:hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-2 text-center font-medium text-lg ${
                activeTab === 'single'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('single')}
            >
              Um Código
            </button>
            <button
              className={`flex-1 py-4 px-2 text-center font-medium text-lg ${
                activeTab === 'bulk'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('bulk')}
            >
              Vários Códigos
            </button>
          </div>
        </div>

        {/* Formulários */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Single code input - sempre visível no desktop, condicional no mobile */}
          <div className={activeTab === 'single' || !activeTab ? 'block' : 'hidden md:block'}>
            <Card className="h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Adicionar um código
                </h2>
              </div>
              
              <form onSubmit={handleSingleCodeSubmit} className="space-y-5">
                <Input
                  label={
                    <span className="text-base font-medium text-gray-900">
                      Código numérico *
                    </span>
                  }
                  type="text"
                  value={singleCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setSingleCode(value);
                  }}
                  placeholder="Ex: 123456789"
                  helperText="Digite apenas números, sem letras ou símbolos"
                  required
                  inputMode="numeric"
                  className="text-lg py-3"
                />
                
                <Input
                  label={
                    <span className="text-base font-medium text-gray-900">
                      Nome/Descrição (opcional)
                    </span>
                  }
                  type="text"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  placeholder="Ex: Consulta com Cardiologista"
                  helperText="Identifique este código para facilitar"
                  className="text-lg py-3"
                />
                
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isAdding}
                  disabled={isAdding || !singleCode.trim()}
                  size="lg"
                  className="text-lg py-4"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar Código
                </Button>
              </form>
            </Card>
          </div>

          {/* Bulk codes input - sempre visível no desktop, condicional no mobile */}
          <div className={activeTab === 'bulk' || !activeTab ? 'block' : 'hidden md:block'}>
            <Card className="h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Plus className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Adicionar vários códigos
                </h2>
              </div>
              
              <form onSubmit={handleBulkSubmit} className="space-y-5">
                <TextArea
                  label={
                    <span className="text-base font-medium text-gray-900">
                      Códigos *
                    </span>
                  }
                  value={bulkCodes}
                  onChange={(e) => setBulkCodes(e.target.value)}
                  placeholder={`Exemplo:\n123456789, Consulta Cardiologista\n987654321, Exame de Sangue\n555555555`}
                  rows={8}
                  helperText={
                    <div className="space-y-1">
                      <p>• Um código por linha</p>
                      <p>• Formato: código, nome (o nome é opcional)</p>
                      <p>• Use a vírgula para separar código e nome</p>
                    </div>
                  }
                  className="text-lg py-3 min-h-[120px]"
                />
                
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isAdding}
                  disabled={isAdding || !bulkCodes.trim()}
                  size="lg"
                  className="text-lg py-4"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar Todos
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <Info className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como usar esta página
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p><strong>Para um código:</strong> Use a seção "Adicionar um código"</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p><strong>Para vários códigos:</strong> Use a seção "Adicionar vários códigos"</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p>Os códigos serão verificados automaticamente</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p>Acompanhe todos os códigos na página <strong>Meus Códigos</strong></p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Dica de Acessibilidade */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Precisa de ajuda? Clique no ícone <Info className="inline h-4 w-4" /> para mais informações
          </p>
        </div>
      </div>
    </div>
  );
};