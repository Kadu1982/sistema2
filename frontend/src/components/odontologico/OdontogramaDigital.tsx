// src/components/odontologico/OdontogramaDigital.tsx

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// ANOTAÇÃO: Este é um componente "placeholder" para o Odontograma.
// Ele representa a área onde a interface gráfica dos dentes seria renderizada.
// Por enquanto, ele apenas exibe um texto para marcar o local.
const OdontogramaDigital = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Odontograma Digital</CardTitle>
                <CardDescription>
                    Interface para registro de procedimentos dentários.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                <p className="text-gray-500">
                    (Componente de Odontograma Digital Interativo)
                </p>
            </CardContent>
        </Card>
    );
};

export default OdontogramaDigital;