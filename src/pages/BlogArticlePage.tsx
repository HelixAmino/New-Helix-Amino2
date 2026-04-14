import { ArrowLeft, Calendar, Clock, FlaskConical, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { useNavigation } from '../context/NavigationContext';

const CATEGORY_COLORS: Record<string, string> = {
  'Recovery & Healing': 'text-emerald-400 bg-emerald-950/50 border-emerald-900/40',
  'GH & Growth Axis': 'text-sky-400 bg-sky-950/50 border-sky-900/40',
  'Metabolic & GLP-1 Related': 'text-amber-400 bg-amber-950/50 border-amber-900/40',
  'Longevity and Mitochondrial': 'text-cyan-400 bg-cyan-950/50 border-cyan-900/40',
};

export function BlogArticlePage() {
  const { currentProductId, navigate } = useNavigation();
  const post = BLOG_POSTS.find((p) => p.id === currentProductId);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050d14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Article not found.</p>
          <button
            onClick={() => navigate('blog')}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050d14]">
      <div className="relative overflow-hidden border-b border-cyan-900/20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
          <button
            onClick={() => navigate('blog')}
            className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors duration-200 text-sm mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to Research Articles
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className={`inline-flex items-center text-[10px] font-semibold tracking-widest uppercase border rounded-full px-3 py-1 ${
                CATEGORY_COLORS[post.category] ?? 'text-cyan-400 bg-cyan-950/50 border-cyan-900/40'
              }`}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-gray-600 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1.5 text-gray-600 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FlaskConical className="w-4 h-4 text-cyan-700" />
            <span>Helix Applied Sciences — Research Library</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {post.content && post.content.length > 0 ? (
          <div className="space-y-8">
            {post.content.map((section, i) => (
              <section key={i}>
                {section.heading && (
                  <h2 className="text-lg sm:text-xl font-semibold text-cyan-200 mb-3 tracking-tight">
                    {section.heading}
                  </h2>
                )}
                <p className="text-gray-300 leading-relaxed text-base sm:text-[17px]">
                  {section.body}
                </p>
              </section>
            ))}

            <div className="mt-12 pt-8 border-t border-cyan-900/20">
              <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <FlaskConical className="w-5 h-5 text-cyan-600 mt-0.5 shrink-0" />
                  <p className="text-gray-500 text-sm leading-relaxed">
                    <span className="text-gray-400 font-medium">Research Disclaimer: </span>
                    All content on this page is intended for informational and educational purposes only. The compounds discussed are research chemicals intended exclusively for in vitro and laboratory use. None of the information presented constitutes medical advice, and these compounds are not approved for human consumption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-900/30 flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6 text-cyan-700" />
            </div>
            <h2 className="text-white font-semibold text-lg mb-2">Full Article Coming Soon</h2>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              The complete research article for this topic is currently being prepared. Check back soon for the full in-depth analysis.
            </p>
            <button
              onClick={() => navigate('blog')}
              className="mt-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              View all articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
