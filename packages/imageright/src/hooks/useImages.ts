import { useQuery } from '@tanstack/react-query';
import { getImages } from '@api/index';

export const useImages = (pageId: number, imageId: number, version?: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['images', pageId, imageId, version],
    queryFn: () => getImages(pageId, imageId, version),
    enabled: !!pageId && !!imageId,
  });
  return { data, isLoading, error };
}