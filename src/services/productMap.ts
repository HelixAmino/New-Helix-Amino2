import { supabase } from '../lib/supabase';

interface ProductMap {
  skuToId: Map<string, number>;
  idToSku: Map<number, string>;
}

let cached: ProductMap | null = null;
let loadingPromise: Promise<ProductMap> | null = null;

export async function loadProductMap(): Promise<ProductMap> {
  if (cached) return cached;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async (): Promise<ProductMap> => {
    const { data, error } = await supabase
      .from('woo_product_map')
      .select('sku, woo_id');
    if (error) throw error;
    const skuToId = new Map<string, number>();
    const idToSku = new Map<number, string>();
    for (const row of data ?? []) {
      skuToId.set(row.sku, row.woo_id);
      idToSku.set(row.woo_id, row.sku);
    }
    const result: ProductMap = { skuToId, idToSku };
    cached = result;
    return result;
  })();

  try {
    return await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

export function getSkuForWooId(wooId: number): string | undefined {
  return cached?.idToSku.get(wooId);
}

export function getWooIdForSku(sku: string): number | undefined {
  return cached?.skuToId.get(sku);
}
