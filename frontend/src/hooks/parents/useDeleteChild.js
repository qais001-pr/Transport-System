import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

const useDeleteChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.PARENT.DELETE_CHILD],

    mutationFn: async (payload, { signal } = {}) => {
      const response = await apiClient.delete(
        `${apiConstant.children}/${payload.bookingId}`,
        {
          signal,
        }
      );
      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.PARENT.CHILDREN]);
      toast.success(data?.message ?? "Child deleted successfully.");
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Child delete error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete child. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

export default useDeleteChild;
