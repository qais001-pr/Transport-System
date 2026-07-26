import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";
import { toast } from "react-toastify";

const useDeleteVan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DRIVER.DELETE_VAN],
    mutationFn: async (vanId) => {
      const res = await apiClient.delete(`${apiConstant.deleteVan}/${vanId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.VANS]);
      toast.success(data?.message || "Van deleted successfully");
    },
    onError: (error) => {
      console.error("Delete van error:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to delete van",
      );
    },
  });
};

export default useDeleteVan;
