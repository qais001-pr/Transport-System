import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import { toast } from "react-toastify";

const useRestoreDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DRIVER.RESTORE_DRIVER],
    mutationFn: async (payload) => {
      const res = await apiClient.put(apiConstant.restoteDriver, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.MY_ROUTES]);
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.NEW_DRIVERS]);
      toast.success(data?.message || "Driver restored");
    },
    onError: (error) => {
      console.error("Restore driver error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || error.message || "Failed to restore driver");
    },
  });
};

export default useRestoreDriver;
