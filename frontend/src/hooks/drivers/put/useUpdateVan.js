import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";
import { toast } from "react-toastify";

const useUpdateVan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DRIVER.UPDATE_VAN],
    mutationFn: async (payload) => {
      const { vanId, data } = payload || {};
      const res = await apiClient.put(
        `${apiConstant.updateVan}/${vanId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.VANS]);
      toast.success(data?.message || "Van updated successfully");
    },
    onError: (error) => {
      console.error("Update van error:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update van",
      );
    },
  });
};

export default useUpdateVan;
