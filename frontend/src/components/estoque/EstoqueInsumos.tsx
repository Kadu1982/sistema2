import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ✅ CORRIGIDO: Define a interface para as props do componente
interface EstoqueInsumosProps {
    unidadeId: string;
}

// ✅ CORRIGIDO: Usa a interface de props para tipar o componente
// Note que 'React.FC' funciona sem a importação explícita de 'React'
// devido à configuração "jsx": "react-jsx" no tsconfig.
export const EstoqueInsumos: React.FC<EstoqueInsumosProps> = ({ unidadeId }) => {
    // Lógica para buscar e exibir os insumos com base no unidadeId.
    return (
        <Card className="mt-2">
            <CardHeader>
                <CardTitle>Controle de Insumos</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Exibindo estoque de insumos para a unidade: {unidadeId}</p>
                {/* Futuramente, aqui entrará a lista de insumos */}
            </CardContent>
        </Card>
    );
};