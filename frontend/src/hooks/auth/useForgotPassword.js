import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

const useForgotPassword = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.FORGET_PASSWORD],

    mutationFn: async (payload, { signal } = {}) => {
      const response = await apiClient.post(
        apiConstant.forgotPassword,
        payload,
        {
          signal,
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(
        data?.message ??
          "Password reset email sent successfully. Check your inbox.",
      );
    //   navigate("/login", {
    //     replace: true,
    //   });
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Forgot password error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send reset email. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

export default useForgotPassword;
