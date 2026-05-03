import { Product, ProductGroup } from '../types';
import { supabase } from '../lib/supabase';
import { WOO_ID_BY_PRODUCT_ID } from './products';

import imgMaz from '../assets/HAmaz.png';
import imgSurv from '../assets/HAsurv.png';
import imgBac3 from '../assets/HAbac3.png';
import imgBac10 from '../assets/HAbac10.png';

import imgReta10 from '../assets/HAReta10.png';
import imgReta20 from '../assets/HAReta20.png';
import imgReta30 from '../assets/HAReta30.png';
import imgReta40 from '../assets/HAReta40.png';
import imgReta50 from '../assets/HAReta50.png';
import imgReta60 from '../assets/HAReta60.png';

import imgSema10 from '../assets/HAsema10.png';
import imgSema20 from '../assets/HAsema20.png';
import imgSema30 from '../assets/HAsema30.png';

import imgTirz10 from '../assets/HATriz10.png';
import imgTirz20 from '../assets/HATriz20.png';
import imgTirz30 from '../assets/HATriz30.png';
import imgTirz40 from '../assets/HATriz40.png';
import imgTirz50 from '../assets/HATriz50.png';
import imgTirz60 from '../assets/HATriz60.png';

import imgCag25 from '../assets/HACag2.5.png';
import imgCag5 from '../assets/HACag5.png';
import imgCag10 from '../assets/HACAG.png';

const IMAGE_MAP: Record<string, string> = {
  'HAmaz.png': imgMaz,
  'HAsurv.png': imgSurv,
  'HAbac3.png': imgBac3,
  'HAbac10.png': imgBac10,
  'HAReta10.png': imgReta10,
  'HAReta20.png': imgReta20,
  'HAReta30.png': imgReta30,
  'HAReta40.png': imgReta40,
  'HAReta50.png': imgReta50,
  'HAReta60.png': imgReta60,
  'HAsema10.png': imgSema10,
  'HAsema20.png': imgSema20,
  'HAsema30.png': imgSema30,
  'HATriz10.png': imgTirz10,
  'HATriz20.png': imgTirz20,
  'HATriz30.png': imgTirz30,
  'HATriz40.png': imgTirz40,
  'HATriz50.png': imgTirz50,
  'HATriz60.png': imgTirz60,
  'HACag2.5.png': imgCag25,
  'HACag5.png': imgCag5,
  'HACAG.png': imgCag10,
};

interface MembersRow {
  id: string;
  data: Product;
  group_id: string;
  group_name: string;
  group_order: number;
  variant_order: number;
}

export interface MembersData {
  products: Product[];
  groups: ProductGroup[];
}

const EMPTY: MembersData = { products: [], groups: [] };

let cache: MembersData | null = null;
let inflight: Promise<MembersData> | null = null;

export async function loadMembersProducts(): Promise<MembersData> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const { data, error } = await supabase
      .from('members_products')
      .select('id, data, group_id, group_name, group_order, variant_order')
      .order('group_order', { ascending: true })
      .order('variant_order', { ascending: true });
    if (error || !data) {
      inflight = null;
      return EMPTY;
    }
    const products: Product[] = [];
    const groupOrder: string[] = [];
    const groupMap = new Map<string, { name: string; variants: Product[] }>();
    for (const row of data as MembersRow[]) {
      const raw = row.data;
      const filename = typeof raw.image === 'string' ? raw.image : '';
      const resolved = IMAGE_MAP[filename] ?? '';
      const product: Product = { ...raw, image: resolved };
      const wooId = WOO_ID_BY_PRODUCT_ID[product.id];
      if (wooId) product.wooId = wooId;
      products.push(product);
      if (!groupMap.has(row.group_id)) {
        groupOrder.push(row.group_id);
        groupMap.set(row.group_id, { name: row.group_name, variants: [] });
      }
      groupMap.get(row.group_id)!.variants.push(product);
    }
    const groups: ProductGroup[] = groupOrder.map((gid) => {
      const g = groupMap.get(gid)!;
      const first = g.variants[0];
      return {
        groupId: gid,
        baseName: g.name,
        category: first.category,
        image: first.image,
        description: first.description,
        cas: first.cas,
        molecularWeight: first.molecularWeight,
        variants: g.variants,
      };
    });
    cache = { products, groups };
    return cache;
  })();
  return inflight;
}

export function clearMembersProductsCache() {
  cache = null;
  inflight = null;
}

export function getCachedMembersProducts(): MembersData {
  return cache ?? EMPTY;
}
