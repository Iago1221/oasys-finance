import { useCallback, useState } from 'react';
import { MOCK_ACTIVITIES } from '../data/mock/sales';
import type { ActivityItem } from '../types/sales';

/** Atividades pendentes (CRM / tarefas). */
export function useActivities() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setActivities(MOCK_ACTIVITIES);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar atividades'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { activities, setActivities, isLoading, error, refetch };
}
