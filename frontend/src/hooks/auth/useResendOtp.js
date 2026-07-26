import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

const useResendOtp = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.RESEND_OTP],

    mutationFn: async (payload, { signal }) => {
      const response = await apiClient.post(apiConstant.resendOtp, payload, {
        signal,
      });
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data?.message ?? "Otp resent successfully.");
    },

    onError: (error) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Otp failed. Please try again.";

      toast.error(errorMessage);
    },
  });
};

export default useResendOtp;
