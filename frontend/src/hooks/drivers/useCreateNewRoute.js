import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import { toast } from "react-toastify";

const useCreateNewRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DRIVER.CREATE_ROUTE],
    mutationFn: async (payload) => {
      const res = await apiClient.post(apiConstant.createNewRoute, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.MY_ROUTES]);
      toast.success(data?.message || "Route created successfully");
    },
    onError: (error) => {
      console.error("Create route error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || error.message || "Failed to create route");
    },
  });
};

export default useCreateNewRoute;
