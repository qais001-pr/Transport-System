import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import { toast } from "react-toastify";

const useLeaveDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DRIVER.LEAVE_DRIVER],
    mutationFn: async (payload) => {
      const res = await apiClient.post(apiConstant.leaveDriver, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.MY_ROUTES]);
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.NEW_DRIVERS]);
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.ASSIGNED_DRIVERS]);
      toast.success(data?.message || "Driver leave processed");
    },
    onError: (error) => {
      console.error("Leave driver error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || error.message || "Failed to process leave");
    },
  });
};

export default useLeaveDriver;
