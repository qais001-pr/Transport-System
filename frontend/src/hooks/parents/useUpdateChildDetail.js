import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

const useUpdateChildDetail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.PARENT.UPDATE_CHILD_DETAIL],

    mutationFn: async (payload, { signal } = {}) => {
      const { id, data } = payload;
      const response = await apiClient.put(
        `${apiConstant.children}/${id}`,
        data,
        {
          signal,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.PARENT.CHILDREN]);
      toast.success(data?.message ?? "Child updated successfully.");
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Child update error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update child. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

export default useUpdateChildDetail;
