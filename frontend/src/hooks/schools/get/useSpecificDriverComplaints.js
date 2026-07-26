import { useQuery } from "@tanstack/react-query";
import { schoolQueryKeys } from "../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
const useSpecificDriverComplaints = (driverId) => {
  console.log("ddddddddddd", driverId);
  return useQuery({
    queryKey: schoolQueryKeys.specificDriverComplaints(),
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(
        `${apiConstant.school.viewSpecificDriverComplaints}/${driverId}`,
        {
          signal,
        },
      );
      return response.data;
    },
    keepPreviousData: true,
  });
};

export default useSpecificDriverComplaints;
