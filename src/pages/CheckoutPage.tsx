import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  Check,
  Copy,
  ShieldCheck,
  Clock,
  Mail,
  Smartphone,
  Loader as Loader2,
  CircleAlert as AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { markOrderSubmitted, sendOrderBackupEmail } from '../services/orderService';
import { PdfQrImage } from '../components/PdfQrImage';

const VENMO_HANDLE = '@HelixAmino';
const ZELLE_EMAIL = 'payments@helixamino.com';

const VENMO_QR_PDF =
  'https://backend.helixamino.com/wp-content/uploads/2026/04/Venmo.pdf';
const ZELLE_QR_PDF =
  'https://backend.helixamino.com/wp-content/uploads/2026/04/My-Zelle-QR-code.pdf';

type PayMethod = 'venmo' | 'zelle';

export function CheckoutPage() {
  const { activeOrder, items, clearCart, setActiveOrder } = useCart();
  const { navigate } = useNavigation();
  const [method, setMethod] = useState<PayMethod>('venmo');
  const [copied, setCopied] = useState<string | null>(null);
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeOrder) {
      navigate('cart');
    }
  }, [activeOrder, navigate]);

  const venmoLink = useMemo(() => {
    if (!activeOrder) return '';
    const handle = VENMO_HANDLE.replace(/^@/, '');
    return `https://venmo.com/?txn=pay&audience=private&recipients=${encodeURIComponent(handle)}&amount=${activeOrder.total.toFixed(2)}&note=${encodeURIComponent(`Order ${activeOrder.order_number}`)}`;
  }, [activeOrder]);

  const zelleLink = useMemo(() => {
    if (!activeOrder) return '';
    return ZELLE_QR_PDF;
  }, [activeOrder]);

  if (!activeOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 text-cyan-400 mx-auto animate-spin" />
      </div>
    );
  }

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
  };

  const handleMarkPaid = async () => {
    setError(null);
    setSubmitting(true);
    console.log('[checkout] handleMarkPaid clicked', {
      orderId: activeOrder.id,
      orderNumber: activeOrder.order_number,
      method,
    });
    try {
      await markOrderSubmitted(activeOrder.id, method, reference.trim());
      console.log('[checkout] markOrderSubmitted ok');

      const backupOrder = {
        ...activeOrder,
        payment_method: method,
        notes: reference.trim(),
      };
      console.log('[checkout] invoking sendOrderBackupEmail', {
        order_number: backupOrder.order_number,
        items: backupOrder.items?.length,
        total: backupOrder.total,
      });
      try {
        await sendOrderBackupEmail(backupOrder);
        console.log('[checkout] backup email sent');
      } catch (err) {
        console.error('[checkout] backup email failed', err);
        const msg = err instanceof Error ? err.message : String(err);
        setError(`Order saved, but backup email failed: ${msg}`);
      }

      setSubmitted(true);
      clearCart();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not update the order. Try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-cyan-300" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">
          Payment details received
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
          Order{' '}
          <span className="text-cyan-300 font-bold">
            {activeOrder.order_number}
          </span>{' '}
          is now marked as <span className="text-white">submitted</span>. We will
          confirm your payment and ship within 1 business day. A receipt will be
          emailed to you.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => {
              setActiveOrder(null);
              navigate('home');
            }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm transition-all active:scale-95"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
      <button
        onClick={() => navigate('cart')}
        className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 text-sm mb-8 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Cart
      </button>

      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">
            Order{' '}
            <span className="text-cyan-300 font-mono font-bold">
              {activeOrder.order_number}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-cyan-950/30 border border-cyan-900/40 rounded-full px-3 py-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-cyan-200 font-semibold">
            Secure off-platform payment
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Payment instructions */}
        <div className="space-y-6">
          {/* Method toggle */}
          <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-1.5 grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setMethod('venmo')}
              className={`py-3 rounded-xl text-sm font-bold transition-all ${
                method === 'venmo'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-[0_0_16px_rgba(0,212,255,0.25)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Pay with Venmo
            </button>
            <button
              onClick={() => setMethod('zelle')}
              className={`py-3 rounded-xl text-sm font-bold transition-all ${
                method === 'zelle'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-[0_0_16px_rgba(0,212,255,0.25)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Pay with Zelle
            </button>
          </div>

          {/* Panel */}
          <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-6 sm:p-8">
            <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
              {/* QR code */}
              <div className="mx-auto md:mx-0 flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(0,212,255,0.18)]">
                  <PdfQrImage
                    key={method}
                    url={method === 'venmo' ? VENMO_QR_PDF : ZELLE_QR_PDF}
                    size={280}
                    zoom={method === 'zelle' ? 3.5 : 1}
                    offsetY={method === 'zelle' ? 115 : 0}
                    alt={`${method} QR code`}
                    className="rounded-lg"
                  />
                </div>
                <a
                  href={method === 'venmo' ? VENMO_QR_PDF : ZELLE_QR_PDF}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 text-center mt-3 block underline-offset-2 hover:underline"
                >
                  Scan with your phone camera · Tap to enlarge
                </a>
                {method === 'zelle' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `Zelle: ${ZELLE_EMAIL}\nAmount: $${activeOrder.total.toFixed(2)}\nMemo: Order #${activeOrder.order_number}`,
                        'zelle-details'
                      )
                    }
                    className="mt-4 w-full min-h-[56px] inline-flex items-center justify-center gap-2 px-6 py-4 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-[#041018] font-black text-base rounded-xl shadow-[0_0_24px_rgba(0,212,255,0.35)] transition-all"
                  >
                    {copied === 'zelle-details' ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Zelle Details
                      </>
                    )}
                  </button>
                )}
                {method === 'venmo' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `Venmo Username: ${VENMO_HANDLE}\nAmount: $${activeOrder.total.toFixed(2)}\nMemo: Order #${activeOrder.order_number}`,
                        'venmo-details'
                      )
                    }
                    className="mt-4 w-full min-h-[56px] inline-flex items-center justify-center gap-2 px-6 py-4 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-[#041018] font-black text-base rounded-xl shadow-[0_0_24px_rgba(0,212,255,0.35)] transition-all"
                  >
                    {copied === 'venmo-details' ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Venmo Details
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Instructions */}
              <div className="min-w-0">
                <h3 className="text-white font-bold text-lg mb-1">
                  {method === 'venmo' ? 'Send via Venmo' : 'Send via Zelle'}
                </h3>
                <p className="text-gray-500 text-xs mb-5">
                  Pay the exact total below. Include your order number in the
                  note so we can match your payment.
                </p>

                <div className="space-y-3">
                  <Row
                    label={method === 'venmo' ? 'Venmo handle' : 'Zelle email'}
                    icon={
                      method === 'venmo' ? (
                        <Smartphone className="w-3.5 h-3.5" />
                      ) : (
                        <Mail className="w-3.5 h-3.5" />
                      )
                    }
                    value={method === 'venmo' ? VENMO_HANDLE : ZELLE_EMAIL}
                    onCopy={() =>
                      handleCopy(
                        method === 'venmo' ? VENMO_HANDLE : ZELLE_EMAIL,
                        'handle'
                      )
                    }
                    copied={copied === 'handle'}
                  />
                  <Row
                    label="Amount"
                    value={`$${activeOrder.total.toFixed(2)} USD`}
                    onCopy={() =>
                      handleCopy(activeOrder.total.toFixed(2), 'amount')
                    }
                    copied={copied === 'amount'}
                  />
                  <Row
                    label="Memo / Note"
                    value={`Order ${activeOrder.order_number}`}
                    onCopy={() =>
                      handleCopy(
                        `Order ${activeOrder.order_number}`,
                        'memo'
                      )
                    }
                    copied={copied === 'memo'}
                  />
                </div>

                <a
                  href={method === 'venmo' ? venmoLink : zelleLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 bg-[#050d14] border border-cyan-900/40 hover:border-cyan-600/60 text-cyan-300 font-bold rounded-xl text-sm transition-all"
                >
                  {method === 'venmo' ? 'Open Venmo app' : 'Open Zelle QR code'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5 mt-6 pt-6 border-t border-cyan-900/20 text-xs text-gray-500">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                After sending, tap <span className="text-white font-semibold">I&apos;ve sent the payment</span> below. Your order is held until we verify the transfer.
              </p>
            </div>
          </div>

          {/* Confirmation */}
          <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-6 sm:p-8">
            <h3 className="text-white font-bold text-base mb-4">
              Confirm your payment
            </h3>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Payment reference{' '}
              <span className="text-gray-600 normal-case font-normal tracking-normal">
                (optional — last 4 of your Venmo/Zelle txn)
              </span>
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. 1234 or your Venmo username"
              className="w-full bg-[#050d14] border border-cyan-900/30 focus:border-cyan-600/60 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-colors"
            />

            {error && (
              <div className="flex items-start gap-2 mt-3 text-red-300 text-xs bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleMarkPaid}
              disabled={submitting}
              className="mt-5 w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Submitting…' : "I've sent the payment"}
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-6 lg:sticky lg:top-24">
            <h3 className="text-white font-bold text-base mb-5">
              Order Summary
            </h3>

            <div className="space-y-3 mb-5">
              {(activeOrder.items.length > 0 ? activeOrder.items : items.map((i) => ({
                productId: i.product.id,
                name: i.product.name,
                quantity: i.quantity,
                unitPrice: i.product.price,
                lineTotal: +(i.product.price * i.quantity).toFixed(2),
              }))).map((it) => (
                <div
                  key={it.productId}
                  className="flex justify-between items-start gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="text-gray-200 font-semibold truncate">
                      {it.name}
                    </div>
                    <div className="text-gray-600">
                      {it.quantity} × ${it.unitPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-white font-bold shrink-0">
                    ${it.lineTotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-cyan-900/20 pt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-200 font-semibold">
                  ${activeOrder.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Shipping (flat rate)</span>
                <span className="text-gray-200 font-semibold">
                  ${(activeOrder.total - activeOrder.subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3">
                <span className="text-gray-400 text-sm">Total due</span>
                <span className="text-white font-black text-2xl">
                  ${activeOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-gray-700 text-[10px] mt-5 leading-relaxed text-center">
              All products for laboratory research use only. Not for human
              consumption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-[#050d14] border border-cyan-900/25 rounded-xl px-3.5 py-2.5">
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
          {icon}
          {label}
        </div>
        <div className="text-white font-mono text-sm truncate">{value}</div>
      </div>
      <button
        onClick={onCopy}
        className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-900/40 rounded-lg px-2.5 py-1.5 transition-all"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" /> Copy
          </>
        )}
      </button>
    </div>
  );
}
