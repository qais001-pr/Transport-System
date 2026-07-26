import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import { toast } from "react-toastify";

const useUpdateRouteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DRIVER.UPDATE_ROUTE],
    mutationFn: async (payload) => {
      // payload should contain { id, data }
      const { id, data } = payload || {};
      if (id) {
        const res = await apiClient.put(`${apiConstant.updateRoute}/${id}`, data);
        return res.data;
      }
      const res = await apiClient.put(apiConstant.updateRoute, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.MY_ROUTES]);
      toast.success(data?.message || "Route updated");
    },
    onError: (error) => {
      console.error("Update route error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || error.message || "Failed to update route");
    },
  });
};

export default useUpdateRouteLocation;
