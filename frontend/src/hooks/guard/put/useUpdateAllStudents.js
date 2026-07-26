import { useMutation, useQueryClient } from "@tanstack/react-query";
import { guardQueryKeys } from "../querykeys";
import apiConstant from "../../../api/apiConstant";
import { toast } from "react-toastify";
import apiClient from "../../../api/apiClient";

const useUpdateAllStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, signal }) => {
      const response = await apiClient.put(
        apiConstant.guard.verifyAllStudents,
        payload,
        { signal }
      );
      return response.data;
    },

    onSuccess: () => {
      toast.success("All students updated successfully");

      queryClient.invalidateQueries({
        queryKey: guardQueryKeys.verifyAllStudents(),
      });

      queryClient.invalidateQueries({
        queryKey: guardQueryKeys.allStudents(),
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update students"
      );
      console.error("Update all students error", error);
    },
  });
};

export default useUpdateAllStudents;
