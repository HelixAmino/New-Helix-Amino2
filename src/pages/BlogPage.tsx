import { Calendar, Clock, ArrowRight, FlaskConical } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { useNavigation } from '../context/NavigationContext';

const CATEGORY_COLORS: Record<string, string> = {
  'Recovery & Healing': 'text-emerald-400 bg-emerald-950/50 border-emerald-900/40',
  'GH & Growth Axis': 'text-sky-400 bg-sky-950/50 border-sky-900/40',
  'Metabolic & GLP-1 Related': 'text-amber-400 bg-amber-950/50 border-amber-900/40',
  'Longevity and Mitochondrial': 'text-cyan-400 bg-cyan-950/50 border-cyan-900/40',
};

export function BlogPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-[#050d14]">
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
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Research Library</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Scientific{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Research Articles
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            Peer-reviewed summaries and laboratory findings on research peptides, their mechanisms, and the latest findings in cellular biology.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate('blog-article', post.id)}
              className="group flex flex-col bg-[#07111d] border border-cyan-900/20 rounded-2xl overflow-hidden hover:border-cyan-700/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.07)] transition-all duration-300 cursor-pointer"
            >
              <div className="h-1 w-full bg-gradient-to-r from-cyan-600/60 to-teal-600/60" />

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <span
                    className={`inline-flex items-center text-[10px] font-semibold tracking-widest uppercase border rounded-full px-2.5 py-1 ${
                      CATEGORY_COLORS[post.category] ?? 'text-cyan-400 bg-cyan-950/50 border-cyan-900/40'
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600 text-xs whitespace-nowrap shrink-0">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-cyan-100 transition-colors duration-200 line-clamp-3">
                  {post.title}
                </h2>

                <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-4">
                  {post.excerpt}
                </p>

                <div className="mt-5 pt-5 border-t border-cyan-900/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>

                  <button className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold tracking-wide hover:text-cyan-300 transition-colors duration-200 group/btn">
                    Read More
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
