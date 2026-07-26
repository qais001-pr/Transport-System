import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

const useVerifyOtp = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.VERIFY_OTP],

    mutationFn: async (payload, { signal }) => {
      const response = await apiClient.post(apiConstant.verifyOtp, payload, {
        signal,
      });
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data?.message ?? "Registration successful.");
      window.location.href = "/login";
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

export default useVerifyOtp;
