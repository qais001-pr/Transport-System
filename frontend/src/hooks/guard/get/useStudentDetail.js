/**
 * useStudentDetail Hook
 *
 * Fetches details for a single student
 * Endpoint: GET /api/guards/student-details (expects id as query param or body depending on backend)
 *
 * Usage:
 * const { data: student, isLoading, error } = useStudentDetail(studentId);
 */

import { useQuery } from 'react-query';
import { apiClient } from '@/api/apiClient';
import { guardQueryKeys } from '../querykeys';

const useStudentDetail = (studentId) => {
  return useQuery(
    guardQueryKeys.studentDetail(studentId),
    async () => {
      const response = await apiClient.get(`/api/guards/student-details/${studentId}`);
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 3,
      cacheTime: 1000 * 60 * 10,
      retry: 2,
      enabled: !!studentId,
    }
  );
};

export default useStudentDetail;
