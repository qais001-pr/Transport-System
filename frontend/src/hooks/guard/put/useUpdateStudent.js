import { useMutation, useQueryClient } from "@tanstack/react-query";
import { guardQueryKeys } from "../querykeys";
import apiConstant from "../../../api/apiConstant";
import { toast } from "react-toastify";
import apiClient from "../../../api/apiClient";

const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, signal }) => {
      const response = await apiClient.put(
        `${apiConstant.guard.verifySingleStudent}`,
        payload,
        { signal },
      );
      return response.data;
    },

    onSuccess: (data, variables) => {
      toast.success("Student updated successfully");

      queryClient.invalidateQueries({
        queryKey: guardQueryKeys.verifySingleStudent(variables.studentId),
      });

      queryClient.invalidateQueries({
        queryKey: guardQueryKeys.allStudents(),
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update student",
      );
      console.error("Update student error", error);
    },
  });
};

export default useUpdateStudent;
