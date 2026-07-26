import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";
import { toast } from "react-toastify";

const useAddVans = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DRIVER.ADD_VAN],

    mutationFn: async (payload) => {
      const res = await apiClient.post(apiConstant.addVan, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.VANS]);
      toast.success(data?.message || "Vans added successfully");
    },
    onError: (error) => {
      console.error("Add vans error:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || error.message || "Failed to add vans",
      );
    },
  });
};

export default useAddVans;
