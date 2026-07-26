import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useVanFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.PARENT.VAN_FEEDBACK],

    mutationFn: async (payload, { signal } = {}) => {
      const response = await apiClient.post(apiConstant.vanFeedback, payload, {
        signal,
      });
      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.PARENT.FEEDBACK_HISTORY]);
      toast.success(data?.message ?? "Feedback submitted successfully.");
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Forgot password error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit feedback. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

export default useVanFeedback;
