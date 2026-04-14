import { BookOpen, Calendar, Tag, ArrowRight, FlaskConical } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { useNavigation } from '../context/NavigationContext';

const REFERENCE_CATEGORIES = [
  {
    name: 'Peptide Pharmacology',
    count: 24,
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/30 border-cyan-900/40',
    description: 'Receptor binding studies, dose-response curves, and mechanism of action reviews.',
  },
  {
    name: 'Cellular Biology',
    count: 18,
    color: 'text-teal-400',
    bg: 'bg-teal-950/30 border-teal-900/40',
    description: 'In vitro models of cellular proliferation, migration, and signaling cascades.',
  },
  {
    name: 'Metabolic Research',
    count: 15,
    color: 'text-amber-400',
    bg: 'bg-amber-950/30 border-amber-900/40',
    description: 'GLP-1, insulin sensitivity, lipid metabolism, and adipogenesis literature.',
  },
  {
    name: 'Neurological Studies',
    count: 11,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30 border-emerald-900/40',
    description: 'Cognitive enhancement, neuroprotection, and GABAergic system research.',
  },
  {
    name: 'Longevity & Aging',
    count: 9,
    color: 'text-sky-400',
    bg: 'bg-sky-950/30 border-sky-900/40',
    description: 'Telomere biology, mitochondrial function, and senolytic compound studies.',
  },
  {
    name: 'Endocrinology',
    count: 13,
    color: 'text-rose-400',
    bg: 'bg-rose-950/30 border-rose-900/40',
    description: 'Growth hormone axis, gonadotropin signaling, and hormone receptor research.',
  },
];

const FEATURED_REFERENCES = [
  {
    title: 'Synthetic peptides as tools for biological research: a review of current literature',
    journal: 'Journal of Peptide Science',
    year: '2023',
    tags: ['Methodology', 'Synthesis', 'In Vitro'],
  },
  {
    title: 'GHRH receptor agonists: structural determinants of GH secretagogue activity',
    journal: 'Endocrinology Research',
    year: '2022',
    tags: ['GH Axis', 'GHRH', 'Pituitary'],
  },
  {
    title: 'Pentadecapeptide BPC-157 and its cytoprotective effects in cell culture models',
    journal: 'Peptides',
    year: '2023',
    tags: ['BPC-157', 'Healing', 'Angiogenesis'],
  },
  {
    title: 'Mechanisms of Epithalon-mediated telomere extension in human fibroblast models',
    journal: 'Biogerontology',
    year: '2021',
    tags: ['Epithalon', 'Telomeres', 'Aging'],
  },
  {
    title: 'GLP-1 receptor agonism and downstream metabolic signaling pathways',
    journal: 'Molecular Metabolism',
    year: '2024',
    tags: ['GLP-1', 'Metabolism', 'Receptor Binding'],
  },
  {
    title: 'Delta sleep-inducing peptide: neuromodulation and sleep architecture research',
    journal: 'Sleep Science',
    year: '2022',
    tags: ['DSIP', 'Neuropeptides', 'Sleep'],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Recovery & Healing': 'text-emerald-400 bg-emerald-950/50 border-emerald-900/40',
  'GH & Growth Axis': 'text-sky-400 bg-sky-950/50 border-sky-900/40',
  'Metabolic & GLP-1 Related': 'text-amber-400 bg-amber-950/50 border-amber-900/40',
  'Longevity and Mitochondrial': 'text-cyan-400 bg-cyan-950/50 border-cyan-900/40',
};

export function ResearchLibraryPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-[#050d14]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-cyan-900/30">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-2 bg-cyan-950/50 border border-cyan-800/40 rounded-full px-4 py-1.5 text-cyan-300 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Scientific References</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Research{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Library
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            A curated collection of peer-reviewed literature, in-house research articles, and scientific references supporting the compounds we carry.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Category overview */}
        <h2 className="text-white font-bold text-xl mb-6">Research Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {REFERENCE_CATEGORIES.map((cat) => (
            <div key={cat.name} className={`border ${cat.bg} rounded-2xl p-5 hover:scale-[1.01] transition-transform duration-200`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-sm ${cat.color}`}>{cat.name}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full bg-black/30 border ${cat.bg} ${cat.color} font-bold`}>
                  {cat.count} refs
                </span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{cat.description}</p>
            </div>
          ))}
        </div>

        {/* Featured references */}
        <h2 className="text-white font-bold text-xl mb-6">Featured References</h2>
        <div className="space-y-4 mb-14">
          {FEATURED_REFERENCES.map((ref, i) => (
            <div key={i} className="bg-[#07111d] border border-cyan-900/20 rounded-xl p-5 hover:border-cyan-800/40 transition-colors duration-200">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-900/40 flex items-center justify-center shrink-0 mt-0.5">
                  <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm mb-1 leading-snug">{ref.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-gray-500 text-xs italic">{ref.journal}</span>
                    <span className="text-gray-700 text-xs">·</span>
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Calendar className="w-3 h-3" />
                      {ref.year}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ref.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-900/30 text-cyan-400">
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blog articles */}
        <h2 className="text-white font-bold text-xl mb-6">Helix Amino Research Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {BLOG_POSTS.slice(0, 6).map((post) => {
            const colorClass = CATEGORY_COLORS[post.category] || 'text-gray-400 bg-gray-900/50 border-gray-800/40';
            return (
              <button
                key={post.id}
                onClick={() => navigate('blog-article', post.id)}
                className="bg-[#07111d] border border-cyan-900/20 rounded-xl p-5 text-left hover:border-cyan-800/40 transition-all duration-200 hover:scale-[1.01] group"
              >
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border mb-3 ${colorClass}`}>
                  {post.category}
                </span>
                <h4 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-cyan-300 transition-colors">{post.title}</h4>
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-gray-600 text-[11px]">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="flex items-center gap-1 text-cyan-500 group-hover:gap-2 transition-all">Read <ArrowRight className="w-3 h-3" /></span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigate('blog')}
          className="w-full py-3 border border-cyan-900/40 hover:border-cyan-700/60 rounded-xl text-gray-400 hover:text-white text-sm font-medium transition-all duration-200 hover:bg-cyan-950/20 mb-10"
        >
          View All Articles
        </button>

        {/* Disclaimer */}
        <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4">
          <p className="text-red-300/70 text-xs leading-relaxed text-center">
            <strong className="text-red-400">RESEARCH USE ONLY:</strong> All referenced literature and content is provided for informational and educational purposes only. References to third-party studies do not constitute endorsement or clinical claims. Products are for in-vitro research use only.
          </p>
        </div>
      </div>
    </div>
  );
}
