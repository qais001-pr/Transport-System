import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import { toast } from "react-toastify";

const useDeleteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DRIVER.DELETE_ROUTE],
    mutationFn: async ({ routeId }) => {
      const res = await apiClient.delete(
        `${apiConstant.deleteRoute}/${routeId}`,
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.MY_ROUTES]);
      toast.success(data?.message || "Route deleted");
    },
    onError: (error) => {
      console.error("Delete route error:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to delete route",
      );
    },
  });
};

export default useDeleteRoute;
