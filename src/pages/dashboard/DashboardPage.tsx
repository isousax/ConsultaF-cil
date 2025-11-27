import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useCodesStore } from '../../stores/codesStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { Plus, Smartphone, MapPin, X  } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { SEO_CONFIG } from '../../config/seo';

export const DashboardPage = () => {
  const { addCodes, isAdding } = useCodesStore();

  const [singleCode, setSingleCode] = useState('');
  const [singleName, setSingleName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invalidCodes, setInvalidCodes] = useState<string[]>([]);
  const [showLocationNotice, setShowLocationNotice] = useState(false);

  useEffect(() => {
    // Verifica se é o primeiro acesso
    const hasSeenNotice = localStorage.getItem('location_notice_seen');
    if (!hasSeenNotice) {
      setShowLocationNotice(true);
    }
  }, []);

  const handleCloseNotice = () => {
    localStorage.setItem('location_notice_seen', 'true');
    setShowLocationNotice(false);
  };

  const handleSingleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setInvalidCodes([]);

    if (!singleCode.trim()) {
      setError('Por favor, digite um código');
      return;
    }

    if (singleCode.length < 8 || singleCode.length > 11) {
      setError('O código deve ter entre 8 e 11 dígitos');
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

  return (
    <>
      <SEO
        title={SEO_CONFIG.dashboard.title}
        description={SEO_CONFIG.dashboard.description}
        keywords={SEO_CONFIG.dashboard.keywords}
      />
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Aviso de Localidade */}
        {showLocationNotice && (
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-blue-900">
                    Cobertura Atual: Jaboatão dos Guararapes
                  </h3>
                  <button
                    onClick={handleCloseNotice}
                    className="text-blue-600 hover:text-blue-800 transition-colors shrink-0"
                    aria-label="Fechar aviso"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-blue-800 mt-2">
                  Atualmente, nosso sistema está disponível apenas para consultas de <strong>Jaboatão dos Guararapes - PE</strong>.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Quer que adicionemos sua cidade? Entre em contato conosco! Só recebemos pedidos para criar para Jaboatão, mas podemos expandir para outras localidades mediante solicitação.
                </p>
                <div className="mt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCloseNotice}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Entendi
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Adicionar Código
              </h1>
              <p className="text-sm text-gray-600">
                Cadastre e monitore seus códigos de consulta
              </p>
            </div>
          </div>
        </div>

      <div className="space-y-4">
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

        {/* Formulário de código único */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
          <form onSubmit={handleSingleCodeSubmit} className="space-y-5">
            <Input
              label={
                <span className="text-base font-medium text-gray-900">
                  Código *
                </span>
              }
              type="text"
              value={singleCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                  setSingleCode(value);
                }
              }}
              placeholder="Ex: 123456789"
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
              className="bg-linear-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 text-lg py-4"
            >
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Código
            </Button>
          </form>
        </Card>
      </div>
    </div>
    </>
  );
};