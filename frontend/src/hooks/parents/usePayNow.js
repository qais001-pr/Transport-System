import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

export const usePayNow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.PARENT.PAY_NOW],

    mutationFn: async (payload, { signal } = {}) => {
      const { id, data } = payload;
      const response = await apiClient.put(
        `${apiConstant.payment}/${id}`,
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
      queryClient.invalidateQueries([QUERY_KEYS.PARENT.PAYMENT]);
      toast.success(data?.message ?? "Payment successful.");
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Payment error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to make payment. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

