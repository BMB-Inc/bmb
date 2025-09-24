import { fetcher } from "@api/fetcher";
import { imagerightPagesSchema, type ImagerightPageParams } from "@bmb-inc/types";

export const getPages = async (params?: ImagerightPageParams) => {
  if (!params) {
    return [];
  }

  const searchParams = new URLSearchParams();
  if (params.documentId) {
    searchParams.append('documentId', params.documentId.toString());
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/pages?${queryString}` : '/pages';
  const response = await fetcher(url);
  return imagerightPagesSchema.parse(response);
};