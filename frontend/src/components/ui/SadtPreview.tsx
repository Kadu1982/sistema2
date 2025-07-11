import React from 'react';
import { X, Download, Printer, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SadtPreviewProps {
    pdfBase64: string;
    numeroSadt: string;
    onClose: () => void;
    onDownload: () => void;
    onPrint: () => void;
}

const SadtPreview: React.FC<SadtPreviewProps> = ({
                                                     pdfBase64,
                                                     numeroSadt,
                                                     onClose,
                                                     onDownload,
                                                     onPrint
                                                 }) => {
    const pdfUrl = React.useMemo(() => {
        try {
            const byteCharacters = atob(pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Erro ao processar PDF:', error);
            return null;
        }
    }, [pdfBase64]);

    React.useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    if (!pdfUrl) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="w-96 max-w-md">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-600">❌ Erro ao carregar o PDF</p>
                        <Button variant="outline" onClick={onClose} className="mt-4">
                            Fechar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            📄 Visualizar SADT
                        </h2>
                        <p className="text-sm text-gray-500">SADT Nº {numeroSadt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={onDownload}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={onPrint}>
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimir
                        </Button>
                        <Button variant="outline" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 p-4">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border-0 rounded-lg shadow-inner"
                        title={`SADT ${numeroSadt}`}
                    />
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            💡 <strong>Dica:</strong> Use as opções acima para baixar ou imprimir a SADT
                        </p>
                        <Button variant="outline" onClick={onClose}>
                            Fechar Visualização
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SadtPreview;