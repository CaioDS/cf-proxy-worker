import { PagesEnum } from '../../types';

interface IStorePageOnCacheInput {
  pageKey: string;
  pageResponse: Response;
}

async function storePageOnCache({
  pageKey,
  pageResponse,
}: IStorePageOnCacheInput) {
  await cf_cache_db.put(pageKey, await pageResponse.text(), {
    expirationTtl: 1209600,
  });
}

interface IGetPageFromCacheInput {
  pageKey: string;
}

async function getPageFromCache({ pageKey }: IGetPageFromCacheInput) {
  const cachedPage = await cf_cache_db.get(pageKey);

  return cachedPage;
}

export { getPageFromCache, storePageOnCache };
