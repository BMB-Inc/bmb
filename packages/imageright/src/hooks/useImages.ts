import { getImages } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export const useImages = (pageId?: number, imageId?: number, version?: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["images", pageId, imageId, version],
    queryFn: () => getImages(pageId, imageId, version),
  });
  return { data, isLoading, error };
}