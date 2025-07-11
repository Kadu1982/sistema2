import React, { useState, useRef, useEffect } from 'react';
import { Search, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cid, formatarCid } from '@/types/Cid';
import { useCidBusca } from '@/hooks/useCidBusca';

interface CidBuscaProps {
    onCidSelecionado: (cid: Cid | null) => void;
    cidSelecionado?: Cid | null;
    placeholder?: string;
    label?: string;
    required?: boolean;
}

const CidBusca: React.FC<CidBuscaProps> = ({
    onCidSelecionado,
    cidSelecionado,
    placeholder = "Digite o código ou descrição do CID...",
    label = "Hipótese Diagnóstica / CID",
    required = true
}) => {
    const [termo, setTermo] = useState('');
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultadosRef = useRef<HTMLDivElement>(null);

    const { cids, loading } = useCidBusca(termo);

    // Fecha dropdown quando clica fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                resultadosRef.current &&
                !resultadosRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setMostrarResultados(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Atualiza o campo quando um CID é selecionado externamente
    useEffect(() => {
        if (cidSelecionado) {
            setTermo(formatarCid(cidSelecionado));
            setMostrarResultados(false);
        }
    }, [cidSelecionado]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setTermo(valor);
        setMostrarResultados(valor.length >= 2);

        // Limpa a seleção se o usuário mudou o termo
        if (cidSelecionado && valor !== formatarCid(cidSelecionado)) {
            onCidSelecionado(null);
        }
    };

    const handleCidClick = (cid: Cid) => {
        setTermo(formatarCid(cid));
        setMostrarResultados(false);
        onCidSelecionado(cid);
    };

    const limparSelecao = () => {
        setTermo('');
        setMostrarResultados(false);
        onCidSelecionado(null);
        inputRef.current?.focus();
    };

    return (
        <div className="space-y-2">
            <Label>{label} {required && '*'}</Label>
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        value={termo}
                        onChange={handleInputChange}
                        onFocus={() => termo.length >= 2 && setMostrarResultados(true)}
                        className={`pl-10 ${
                            cidSelecionado
                                ? 'border-green-500 bg-green-50'
                                : ''
                        }`}
                    />
                    {cidSelecionado && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-green-600" />
                    )}
                    {loading && (
                        <div className="absolute right-3 top-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </div>

                {/* Dropdown com resultados */}
                {mostrarResultados && (
                    <div
                        ref={resultadosRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                        {loading && (
                            <div className="p-3 text-center text-gray-500">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    Buscando CIDs...
                                </div>
                            </div>
                        )}

                        {!loading && cids.length === 0 && termo.length >= 2 && (
                            <div className="p-3 text-center text-gray-500">
                                Nenhum CID encontrado para "{termo}"
                            </div>
                        )}

                        {!loading && cids.length > 0 && (
                            <div className="py-1">
                                {cids.map((cid) => (
                                    <Button
                                        key={cid.codigo}
                                        variant="ghost"
                                        className="w-full justify-start p-3 h-auto hover:bg-blue-50"
                                        onClick={() => handleCidClick(cid)}
                                        type="button"
                                    >
                                        <div className="flex flex-col items-start w-full">
                                            <div className="flex items-center gap-2 w-full">
                                                <FileText className="h-4 w-4 text-blue-600" />
                                                <span className="font-medium text-left flex-1">
                                                    {cid.codigo} - {cid.descricao}
                                                </span>
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Informações do CID selecionado */}
            {cidSelecionado && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-800">
                            <FileText className="h-5 w-5" />
                            <span className="font-semibold">
                                {cidSelecionado.codigo} - {cidSelecionado.descricao}
                            </span>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={limparSelecao}
                            className="text-green-700 hover:text-green-900"
                        >
                            Alterar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CidBusca;