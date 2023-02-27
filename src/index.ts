import { getPageFromCache, storePageOnCache } from './services';
export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  cf_cache_db: KVNamespace;

  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request) {
  const url = new URL(request.url);
  const init = {
    method: request.method,
    headers: request.headers,
  };

  const targetUrl = 'https://site-teste.pages.dev' + url.pathname + url.search;

  let cachedPage = await getPageFromCache({ pageKey: url.pathname });
  if (cachedPage) {
    return new Response(cachedPage, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }

  let response = await fetch(targetUrl, init);
  response = new Response(response.body, response);

  if (url.pathname === '/' && response.status !== 304) {
    await storePageOnCache({ pageKey: url.pathname, pageResponse: response });
  }
  return response;
}
