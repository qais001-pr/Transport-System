import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

const useAddChild = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.PARENT.ADD_CHILD],

    mutationFn: async (payload, { signal } = {}) => {
      const response = await apiClient.post(apiConstant.addChild, payload, {
        signal,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.PARENT.CHILDREN]);
      toast.success(
        data?.message ?? "Child added successfully. Check your children list.",
      );
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Forgot password error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add child. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

export default useAddChild;
