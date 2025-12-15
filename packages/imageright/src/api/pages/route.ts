import { fetcher } from "@api/fetcher";
import { type ImagerightPageParams } from "@bmb-inc/types";

export const getPages = async (params?: ImagerightPageParams, baseUrl?: string) => {
  if (!params) {
    return [];
  }

  const searchParams = new URLSearchParams();
  if (params.documentId) {
    searchParams.append('documentId', params.documentId.toString());
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/pages?${queryString}` : '/pages';
  const response = await fetcher(url, baseUrl);
  return response;
};
