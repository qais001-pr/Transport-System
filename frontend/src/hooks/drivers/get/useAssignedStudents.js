import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useAssignedStudents = (routeId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.ASSIGNED_STUDENTS, routeId],
    queryFn: async ({ signal }) => {
      const endpoint = routeId ? `${apiConstant.assignedStudents}/${routeId}` : apiConstant.assignedStudents;
      const res = await apiClient.get(endpoint, { signal });
      return res.data;
    },
    enabled: !!routeId,
  });
};

export default useAssignedStudents;
