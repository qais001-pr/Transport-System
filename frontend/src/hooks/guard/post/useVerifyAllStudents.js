/**
 * useVerifyAllStudents Hook
 *
 * Verifies multiple students in bulk (guard action)
 * Endpoint: POST /api/guards/verify-all-students
 *
 * Usage:
 * const { mutate: verifyAll, isLoading, error } = useVerifyAllStudents();
 * verifyAll({ studentIds: [1,2,3], verifiedBy: 'Guard A' })
 */

import { useMutation, useQueryClient } from 'react-query';
import { apiClient } from '@/api/apiClient';
import { guardQueryKeys } from '../querykeys';

const useVerifyAllStudents = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      const response = await apiClient.post('/api/guards/verify-all-students', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(guardQueryKeys.pendingStudents());
        queryClient.invalidateQueries(guardQueryKeys.allStudents());
      },
      onError: (error) => console.error('Bulk verify error', error),
    }
  );
};

export default useVerifyAllStudents;
