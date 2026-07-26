/**
 * useVerifySingleStudent Hook
 *
 * Verifies a single student (guard action)
 * Endpoint: POST /api/guards/verify-student
 *
 * Usage:
 * const { mutate: verifyStudent, isLoading, error } = useVerifySingleStudent();
 * verifyStudent({ studentId, verifiedBy })
 */

import { useMutation, useQueryClient } from 'react-query';
import { apiClient } from '@/api/apiClient';
import { guardQueryKeys } from '../querykeys';

const useVerifySingleStudent = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      const { studentId, ...payload } = data;
      const response = await apiClient.post(`/api/guards/verify-student`, {
        studentId,
        ...payload,
      });
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        // Invalidate pending students and student detail caches
        queryClient.invalidateQueries(guardQueryKeys.pendingStudents());
        queryClient.invalidateQueries(guardQueryKeys.studentDetail(variables.studentId));
      },
      onError: (error) => console.error('Verify student error', error),
    }
  );
};

export default useVerifySingleStudent;
