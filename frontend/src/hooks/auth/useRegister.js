import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import { useNavigate } from "react-router-dom";

const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.REGISTER],

    mutationFn: async (payload, { signal } = {}) => {
      for (let pair of payload.entries()) {
        console.log(pair[0], pair[1]);
      }
      const response = await apiClient.post(apiConstant.register, payload, {
        signal,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    onSuccess: (data, variables) => {
      const email = variables.get("email");
      toast.success(
        data?.message ?? "Registration successful. Please verify OTP.",
      );

      // Delay navigation slightly to ensure toast is visible
      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email },
          replace: true,
        });
      }, 800);
    },

    onError: (error) => {
      // Only show error if it's not an abort (cancellation)
      if (error?.name !== "AbortError") {
        console.error("Registration error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Registration failed. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

export default useRegister;
