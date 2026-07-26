/**
 * useVanDetail Hook
 *
 * Fetches details for a single van
 * Endpoint: GET /api/guards/get-van-details (expects id parameter)
 *
 * Usage:
 * const { data: van, isLoading, error } = useVanDetail(vanId);
 */

import { useQuery } from 'react-query';
import { apiClient } from '@/api/apiClient';
import { guardQueryKeys } from '../querykeys';

const useVanDetail = (vanId) => {
  return useQuery(
    guardQueryKeys.vanDetail(vanId),
    async () => {
      const response = await apiClient.get(`/api/guards/get-van-details/${vanId}`);
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 3,
      cacheTime: 1000 * 60 * 10,
      retry: 2,
      enabled: !!vanId,
    }
  );
};

export default useVanDetail;
