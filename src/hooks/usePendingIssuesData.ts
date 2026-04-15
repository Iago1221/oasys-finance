import { useCallback, useMemo, useState } from 'react';
import type { PendingIssue } from '../types/pending';

const MOCK_RECEBER: PendingIssue[] = [
  {
    id: 8842,
    client: 'Acme Corp',
    type: 'Fatura Venda',
    value: 'R$ 1.250,00',
    numValue: 1250,
    status: 'Atrasado',
    color: 'red',
    date: 'Venceu em 01/03',
    details:
      'Fatura referente ao serviço de consultoria mensal. Pagamento em atraso há 4 dias.',
  },
  {
    id: 8859,
    client: 'Global Tech',
    type: 'Serviço Mensal',
    value: 'R$ 3.400,00',
    numValue: 3400,
    status: 'Pendente',
    color: 'yellow',
    date: 'Vence em 10/03',
    details: 'Compra de equipamentos de rede. Aguardando processamento bancário.',
  },
  {
    id: 8860,
    client: 'Inova Soft',
    type: 'Vencimento Hoje',
    value: 'R$ 890,00',
    numValue: 890,
    status: 'Pendente',
    color: 'yellow',
    date: 'Vence em 05/03',
    details: 'Assinatura de software anual. Lembrete de vencimento enviado.',
  },
];

const MOCK_PAGAR: PendingIssue[] = [
  {
    id: 1021,
    client: 'Fornecedor Alpha',
    type: 'Matéria Prima',
    value: 'R$ 4.500,00',
    numValue: 4500,
    status: 'Atrasado',
    color: 'red',
    date: 'Vencido em 02/03',
    details:
      'Compra de componentes eletrônicos para produção. Sujeito a multa por atraso.',
  },
  {
    id: 1022,
    client: 'Aluguel Galpão',
    type: 'Custo Fixo',
    value: 'R$ 12.000,00',
    numValue: 12000,
    status: 'Pendente',
    color: 'yellow',
    date: 'Vence em 10/03',
    details: 'Aluguel mensal da unidade principal de estoque.',
  },
  {
    id: 1023,
    client: 'Amazon AWS',
    type: 'Hospedagem',
    value: 'R$ 890,00',
    numValue: 890,
    status: 'Pendente',
    color: 'yellow',
    date: 'Vence em 15/03',
    details: 'Serviços de infraestrutura em nuvem.',
  },
];

type View = 'receber' | 'pagar';

/**
 * Pendências financeiras (contas a pagar / receber).
 */
export function usePendingIssuesData(view: View) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [receber, setReceber] = useState<PendingIssue[]>(MOCK_RECEBER);
  const [pagar, setPagar] = useState<PendingIssue[]>(MOCK_PAGAR);

  const data = useMemo(() => (view === 'pagar' ? pagar : receber), [view, pagar, receber]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const [r, p] = await Promise.all([api.finance.pending('receber'), ...])
      setReceber(MOCK_RECEBER);
      setPagar(MOCK_PAGAR);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar pendências'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    receber,
    pagar,
    setReceber,
    setPagar,
    isLoading,
    error,
    refetch,
  };
}
