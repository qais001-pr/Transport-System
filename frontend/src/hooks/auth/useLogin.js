import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import { useContext } from "react";
import userContext from "../../context/userContext";

const useLogin = () => {
  const { setUserToken } = useContext(userContext);
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.LOGIN],

    mutationFn: async (payload, { signal }) => {
      const response = await apiClient.post(apiConstant.login, payload, {
        signal,
      });
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data?.message ?? "Login successful.");
      console.log("login..",data.token)
      setUserToken(data?.token);

      setTimeout(() => {
        if (data?.role === "ADMIN") {
          window.location.href = "/dashboard/admin";
        }
        else if (data?.role === "PARENT") {
          window.location.href = "/dashboard/parent";
        }
        else if (data?.role === "DRIVER") {
          window.location.href = "/dashboard/driver";
        }
        else if (data?.role === "GUARD") {
          window.location.href = "/dashboard/guard";
        }
        else if (data?.role === "SCHOOL") {
          window.location.href = "/dashboard/school";
        }
        else if (data?.role === "POLICE") {
          window.location.href = "/dashboard/police";
        }
      }, 500);
    },

    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";

      toast.error(errorMessage);
    },
  });
};

export default useLogin;
