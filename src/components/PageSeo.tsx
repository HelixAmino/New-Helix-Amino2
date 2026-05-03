import { useSeo, SITE_URL, DEFAULT_IMAGE } from '../hooks/useSeo';
import { useNavigation } from '../context/NavigationContext';
import { PRODUCTS, getGroupByProductId } from '../data/products';
import { BLOG_POSTS } from '../data/blogPosts';
import { Page } from '../types';

type SeoMeta = {
  title: string;
  description: string;
  keywords?: string;
  path: string;
};

const PAGE_META: Partial<Record<Page, SeoMeta>> = {
  home: {
    title: 'Research Peptides, Blends & Compounds for In-Vitro Lab Use',
    description:
      'Shop ≥99% purity research peptides, blends, and compounds with third-party HPLC COAs on every batch. Fast USA domestic shipping. Strictly for laboratory research use only.',
    keywords: 'research peptides, HPLC verified peptides, BPC-157, TB-500, GHK-Cu, peptide blends, USA peptides, COA verified',
    path: '/',
  },
  cart: { title: 'Your Cart', description: 'Review your selected research compounds.', path: '/?page=cart' },
  checkout: { title: 'Secure Checkout', description: 'Complete your research compound order securely.', path: '/?page=checkout' },
  blog: {
    title: 'Research Blog',
    description: 'Latest articles on peptide research, study protocols, and compound pharmacology.',
    keywords: 'peptide research blog, peptide articles, research protocols',
    path: '/?page=blog',
  },
  'lab-certifications': {
    title: 'Lab Certifications & Quality Standards',
    description: 'Third-party lab certifications, HPLC methodology, and quality standards behind every Helix Amino research compound.',
    path: '/?page=lab-certifications',
  },
  'purity-testing': {
    title: 'Purity Testing & HPLC Analysis',
    description: 'Independent HPLC purity testing, mass spec verification, and contaminant screening on every production lot.',
    keywords: 'HPLC peptide testing, peptide purity analysis, peptide mass spectrometry',
    path: '/?page=purity-testing',
  },
  'research-library': {
    title: 'Peptide Research Library',
    description: 'Curated peer-reviewed studies, mechanism-of-action references, and in-vitro research on common research peptides.',
    path: '/?page=research-library',
  },
  'compound-guide': {
    title: 'Research Compound Guide',
    description: 'Reference guide to research peptide families, categories, and in-vitro applications.',
    path: '/?page=compound-guide',
  },
  'hplc-reports': {
    title: 'HPLC Reports Archive',
    description: 'Downloadable HPLC chromatograms and analytical reports for every production batch.',
    path: '/?page=hplc-reports',
  },
  'coa-library': {
    title: 'Certificate of Analysis Library',
    description: 'Browse third-party Certificates of Analysis (COA) for all Helix Amino research compounds.',
    keywords: 'peptide COA, certificate of analysis, third-party peptide testing',
    path: '/?page=coa-library',
  },
  'sds-library': {
    title: 'Safety Data Sheet (SDS) Library',
    description: 'Safety data sheets and handling guidance for all research compounds.',
    path: '/?page=sds-library',
  },
  'lab-supplies': {
    title: 'Laboratory Supplies',
    description: 'Bacteriostatic water, sterile vials, syringes, and other laboratory supplies for research use.',
    keywords: 'bacteriostatic water, sterile vials, lab supplies, research syringes',
    path: '/?page=lab-supplies',
  },
  about: {
    title: 'About Helix Amino',
    description: 'How Helix Amino sources, tests, and verifies every research compound before shipment.',
    path: '/?page=about',
  },
  shipping: {
    title: 'Shipping Information',
    description: 'USA domestic shipping policies, turnaround times, and flat-rate pricing for Helix Amino orders.',
    path: '/?page=shipping',
  },
  returns: {
    title: 'Returns & Refund Policy',
    description: 'Read the Helix Amino returns policy for research compound orders.',
    path: '/?page=returns',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'How Helix Amino handles personal information and research customer data.',
    path: '/?page=privacy',
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms of service and in-vitro research-use-only agreement for Helix Amino customers.',
    path: '/?page=terms',
  },
  members: {
    title: 'Members Area',
    description: 'Private members area.',
    path: '/?page=members',
  },
};

type ComputedSeo = {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function computeSeo(page: Page, currentProductId: string | null): ComputedSeo {
  if (page === 'product') {
    const isMembersProduct = (currentProductId ?? '').startsWith('members-');
    if (isMembersProduct) {
      return {
        title: 'Members Research Compound',
        description: 'Private members research compound.',
        canonical: `${SITE_URL}/?page=members`,
        noindex: true,
      };
    }
    const product = PRODUCTS.find((p) => p.id === currentProductId);
    const group = currentProductId ? getGroupByProductId(currentProductId) : undefined;
    const displayName = group?.baseName ?? product?.name ?? 'Research Compound';
    const url = `${SITE_URL}/?page=product&id=${currentProductId ?? ''}`;
    const imageAbs = product?.image?.startsWith('http') ? product.image : DEFAULT_IMAGE;

    const productJsonLd = product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          category: product.category,
          image: imageAbs,
          sku: product.id,
          brand: { '@type': 'Brand', name: 'Helix Amino' },
          additionalProperty: [
            { '@type': 'PropertyValue', name: 'Purity', value: product.purity },
            { '@type': 'PropertyValue', name: 'Form', value: product.form },
            { '@type': 'PropertyValue', name: 'Storage', value: product.storage },
            ...(product.cas ? [{ '@type': 'PropertyValue', name: 'CAS', value: product.cas }] : []),
            ...(product.molecularWeight
              ? [{ '@type': 'PropertyValue', name: 'Molecular Weight', value: product.molecularWeight }]
              : []),
          ],
          offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'USD',
            price: product.price.toFixed(2),
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: 'Helix Amino' },
          },
        }
      : undefined;

    const breadcrumbJsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        ...(product?.category
          ? [{ '@type': 'ListItem', position: 2, name: product.category, item: SITE_URL }]
          : []),
        { '@type': 'ListItem', position: product?.category ? 3 : 2, name: displayName, item: url },
      ],
    };

    return {
      title: `${displayName} — ${product?.purity ?? '99% Purity'} Research Compound`,
      description: product
        ? `${displayName} — ${product.purity} purity, ${product.form}. ${product.description.slice(0, 140)}`
        : `Research compound available at Helix Amino.`,
      canonical: url,
      image: imageAbs,
      type: 'product',
      keywords: [displayName, product?.category, product?.cas, 'research peptide', 'HPLC verified', 'Helix Amino']
        .filter(Boolean)
        .join(', '),
      jsonLd: productJsonLd ? [productJsonLd, breadcrumbJsonLd] : [breadcrumbJsonLd],
    };
  }

  if (page === 'blog-article') {
    const post = BLOG_POSTS[0];
    return {
      title: post?.title ?? 'Research Article',
      description: post?.excerpt ?? 'Research article from the Helix Amino lab blog.',
      canonical: `${SITE_URL}/?page=blog-article`,
      type: 'article',
    };
  }

  if (page === 'admin-chat') {
    return {
      title: 'Admin Chat',
      description: 'Internal admin panel.',
      canonical: `${SITE_URL}/?page=admin-chat`,
      noindex: true,
    };
  }

  const meta = PAGE_META[page] ?? PAGE_META.home!;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    canonical: `${SITE_URL}${meta.path}`,
    noindex: page === 'members' || page === 'cart' || page === 'checkout',
  };
}

export function PageSeo() {
  const { page, currentProductId } = useNavigation();
  const seo = computeSeo(page, currentProductId);
  useSeo(seo);
  return null;
}
