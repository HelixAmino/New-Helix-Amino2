const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const ENDPOINT = `${SUPABASE_URL}/functions/v1/woo-validate-coupon`;

export interface ValidatedCoupon {
  code: string;
  discountType: 'percent' | 'fixed_cart' | 'fixed_product';
  amount: number;
  description: string;
  minimumAmount: number;
  maximumAmount: number;
}

interface ValidateResponse {
  valid: boolean;
  code: string;
  discountType?: ValidatedCoupon['discountType'];
  amount?: number;
  description?: string;
  minimumAmount?: number;
  maximumAmount?: number;
  reason?: string;
}

export async function validateCoupon(code: string): Promise<ValidatedCoupon> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ code }),
  });
  const data = (await res.json().catch(() => ({}))) as ValidateResponse;
  if (!data.valid) {
    throw new Error(data.reason ?? 'This coupon is not valid.');
  }
  return {
    code: data.code,
    discountType: data.discountType ?? 'fixed_cart',
    amount: data.amount ?? 0,
    description: data.description ?? '',
    minimumAmount: data.minimumAmount ?? 0,
    maximumAmount: data.maximumAmount ?? 0,
  };
}

export function computeCouponDiscount(coupon: ValidatedCoupon, subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (coupon.minimumAmount > 0 && subtotal < coupon.minimumAmount) return 0;
  let discount = 0;
  if (coupon.discountType === 'percent') {
    discount = subtotal * (coupon.amount / 100);
  } else {
    discount = coupon.amount;
  }
  if (coupon.maximumAmount > 0 && subtotal > coupon.maximumAmount) {
    return 0;
  }
  return Math.min(subtotal, Math.max(0, +discount.toFixed(2)));
}
