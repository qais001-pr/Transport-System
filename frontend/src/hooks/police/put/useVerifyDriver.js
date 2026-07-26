import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { policeQueryKeys } from "../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

const useVerifyDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: policeQueryKeys.verifyDriver(),
    mutationFn: async ({ driver_id, is_approved }, { signal }) => {
      const res = await apiClient.put(
        `${apiConstant.police.verifyDriver}/${driver_id}`,
        { is_approved, signal },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(policeQueryKeys.verifyDriver());
      queryClient.invalidateQueries(policeQueryKeys.driverApplications());
      toast.success(data?.message || "Driver verified successfully");
    },
    onError: (error) => {
      console.error("Verify driver error:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to verify driver",
      );
    },
  });
};

export default useVerifyDriver;
