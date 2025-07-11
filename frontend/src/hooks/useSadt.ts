import { useState } from 'react';
import { gerarSadt } from '@/services/sadtService'; // Importa a função
import { GerarSadtRequest } from '@/types/Sadt'; // Importa o tipo diretamente do seu arquivo de origem
import { toast } from '@/components/ui/use-toast';

export const useSadt = () => {
    const [loading, setLoading] = useState(false);
    const [sadtGerada, setSadtGerada] = useState<{
        pdfBase64: string;
        numeroSadt: string;
    } | null>(null);
    const [mostrarPreview, setMostrarPreview] = useState(false);

    const gerarSadtPdf = async (request: GerarSadtRequest) => {
        setLoading(true);
        try {
            console.log('📋 Iniciando geração de SADT...', request);

            const resultado = await gerarSadt(request);

            setSadtGerada({
                pdfBase64: resultado.pdfBase64,
                numeroSadt: resultado.numeroSadt
            });

            toast({
                title: "✅ SADT Gerada com Sucesso!",
                description: `SADT nº ${resultado.numeroSadt} foi criada e salva no prontuário.`,
                className: "bg-green-100 text-green-800",
            });

            return resultado;
        } catch (error: any) {
            console.error('Erro ao gerar SADT:', error);

            toast({
                title: "❌ Erro ao Gerar SADT",
                description: error.response?.data?.message || error.message || "Erro interno do servidor",
                variant: "destructive",
            });

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const visualizarPdf = () => {
        if (sadtGerada) {
            setMostrarPreview(true);
        }
    };

    const fecharPreview = () => {
        setMostrarPreview(false);
    };

    const downloadPdf = (pdfBase64: string, numeroSadt: string) => {
        try {
            const byteCharacters = atob(pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `SADT_${numeroSadt}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: "📥 Download Concluído",
                description: `SADT_${numeroSadt}.pdf foi baixado com sucesso.`,
                className: "bg-blue-100 text-blue-800",
            });
        } catch (error) {
            toast({
                title: "❌ Erro no Download",
                description: "Não foi possível fazer o download do PDF.",
                variant: "destructive",
            });
        }
    };

    const imprimirPdf = (pdfBase64: string) => {
        try {
            const byteCharacters = atob(pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const printWindow = window.open(url);

            if (printWindow) {
                printWindow.addEventListener('load', () => {
                    printWindow.print();
                });
            }
        } catch (error) {
            toast({
                title: "❌ Erro na Impressão",
                description: "Não foi possível imprimir o PDF.",
                variant: "destructive",
            });
        }
    };

    return {
        loading,
        sadtGerada,
        mostrarPreview,
        gerarSadtPdf,
        visualizarPdf,
        fecharPreview,
        downloadPdf,
        imprimirPdf,
        setSadtGerada
    };
};