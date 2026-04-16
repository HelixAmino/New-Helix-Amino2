export type Category =
  | 'Recovery & Healing'
  | 'GH & Growth Axis'
  | 'Metabolic & GLP-1 Related'
  | 'Nootropics and Cognition'
  | 'Longevity and Mitochondrial'
  | 'Hormones & Reproductive'
  | 'Blends & Specialty'
  | 'Misc / Rare';

export interface BlendComponent {
  name: string;
  cas: string;
  mw: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  quantityLabel: string;
  description: string;
  form: string;
  purity: string;
  storage: string;
  image: string;
  cas?: string;
  molecularWeight?: string;
  blendComponents?: BlendComponent[];
  coaUrl?: string;
  sdsUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Page = 'home' | 'product' | 'cart' | 'blog' | 'blog-article' | 'admin-chat' | 'lab-certifications' | 'purity-testing' | 'research-library' | 'compound-guide' | 'hplc-reports' | 'about' | 'shipping' | 'returns' | 'privacy' | 'terms' | 'coa-library' | 'members' | 'lab-supplies' | 'sds-library';

export type ChatSessionStatus = 'waiting' | 'open' | 'closed';

export interface ChatSession {
  id: string;
  visitor_id: string;
  visitor_name: string;
  status: ChatSessionStatus;
  agent_id: string | null;
  unread_by_agent: number;
  created_at: string;
  updated_at: string;
}

export interface LiveChatMessage {
  id: string;
  session_id: string;
  sender_role: 'visitor' | 'agent';
  sender_id: string;
  text: string;
  created_at: string;
}

export interface ProductGroup {
  groupId: string;
  baseName: string;
  category: Category;
  image: string;
  description: string;
  cas?: string;
  molecularWeight?: string;
  blendComponents?: BlendComponent[];
  sdsUrl?: string;
  variants: Product[];
}
