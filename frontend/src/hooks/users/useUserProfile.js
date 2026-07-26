import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import Cookies from "js-cookie";

const useUserProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTH.ME],
    queryFn: async ({ signal }) => {
      try {
        const response = await apiClient.get(apiConstant.me, { signal });
        return response.data;
      } catch (error) {
        console.error("Profile fetch error:", error?.response?.data);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) {
        // Don't retry on 401 errors
        return false;
      }
      return failureCount < 2;
    },
    enabled: typeof window !== 'undefined' && !!Cookies.get('token'), // Only run query if token exists
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when tab is refocused
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });
};

export default useUserProfile;
