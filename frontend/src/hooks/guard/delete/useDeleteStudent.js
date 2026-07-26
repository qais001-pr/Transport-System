/**
 * useDeleteStudent Hook (Placeholder)
 *
 * Deletes a student record (if backend supports it).
 * This endpoint was not provided in apiConstant.js, but a delete hook
 * is created here for completeness.
 *
 * Usage:
 * const { mutate: deleteStudent, isLoading, error } = useDeleteStudent();
 * deleteStudent(studentId)
 */

import { useMutation, useQueryClient } from 'react-query';
import { apiClient } from '@/api/apiClient';
import { guardQueryKeys } from '../querykeys';

const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (studentId) => {
      const response = await apiClient.delete(`/api/guards/students/${studentId}`);
      return response.data;
    },
    {
      onSuccess: (data, studentId) => {
        queryClient.invalidateQueries(guardQueryKeys.allStudents());
        queryClient.invalidateQueries(guardQueryKeys.pendingStudents());
      },
      onError: (error) => console.error('Delete student error', error),
    }
  );
};

export default useDeleteStudent;
