import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import { useNavigate } from "react-router-dom";

const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.RESET_PASSWORD],

    mutationFn: async (payload, { signal } = {}) => {
      const response = await apiClient.post(
        apiConstant.resetPassword,
        payload,
        {
          signal,
        }
      );
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(
        data?.message ?? "Password reset successfully. Redirecting to login..."
      );

      // Redirect to login after 1 second
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    },

    onError: (error) => {
      // Only show error if it's not an abort (cancellation)
      if (error?.name !== "AbortError") {
        console.error("Reset password error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to reset password. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

export default useResetPassword;
