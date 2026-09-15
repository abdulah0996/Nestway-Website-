import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import panorama from '../assets/destinations-panorama.jpg';
import { ErrorState } from '../components/feedback/ErrorState.jsx';
import { LoadingState } from '../components/feedback/LoadingState.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { PublicHero } from '../components/public/PublicHero.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { useBlogs } from '../hooks/queries/useBlogs.js';
import { useSeo } from '../hooks/useSeo.js';

export const fallbackBlogs = [
  { _id: 'b1', slug: 'how-to-build-a-strong-study-visa-plan', title: 'How to build a stronger study visa plan', excerpt: 'A clear course rationale, credible finances and consistent evidence can turn a collection of documents into one persuasive story.', category: 'Study', readingTimeMinutes: 6, publishedAt: '2026-08-18', coverImageUrl: panorama, content: '## Begin with the outcome\nA strong study plan starts with more than a university offer. It connects your previous education, the course you selected and the future you intend to build.\n\n## Build one consistent story\nYour academic history, financial evidence and written statements should support the same clear purpose. Inconsistency creates avoidable questions.\n\n- Choose a course with a credible progression\n- Prepare financial evidence early\n- Explain gaps directly and accurately\n- Review every document for consistency\n\n## Prepare before pressure arrives\nEarly preparation gives you time to correct evidence, compare options and make informed choices rather than rushed ones.' },
  { _id: 'b2', slug: 'choosing-a-destination-beyond-rankings', title: 'Choosing a destination beyond the rankings', excerpt: 'The right country should fit your education, career, finances and preferred way of living—not only a league table.', category: 'Destinations', readingTimeMinutes: 5, publishedAt: '2026-07-29', coverImageUrl: panorama, content: '## Look at the complete experience\nRankings can be useful, but they are only one input. Consider graduate opportunities, living costs, location, support networks and the conditions attached to your visa.\n\n## Compare what affects your daily life\nCreate a shortlist based on factors you can evaluate honestly. Climate, transport, part-time work rules and proximity to community can matter as much as reputation.\n\n## Keep the pathway realistic\nA destination is only suitable when its admission and immigration pathways align with your actual profile.' },
  { _id: 'b3', slug: 'documents-that-create-confidence', title: 'Documents that create confidence', excerpt: 'Good documentation does not simply exist. It is current, relevant, readable and consistent with the application around it.', category: 'Application strategy', readingTimeMinutes: 7, publishedAt: '2026-07-10', coverImageUrl: heroPlaceholder(), content: '## Evidence should answer questions\nEach document should help establish identity, eligibility, funds, experience or intent. Extra material without a clear purpose can make a file harder to understand.\n\n## Make consistency a priority\nNames, dates, roles and financial figures should align across forms and supporting records. Review translations and scans before submission.\n\n- Use clear, complete scans\n- Keep filenames understandable\n- Confirm dates across documents\n- Retain originals and submission copies' },
  { _id: 'b4', slug: 'what-to-expect-from-an-immigration-consultation', title: 'What to expect from an immigration consultation', excerpt: 'The most useful first meeting should clarify goals, surface risks and define what information is still needed.', category: 'Guidance', readingTimeMinutes: 4, publishedAt: '2026-06-22', coverImageUrl: panorama, content: '## Come ready to be specific\nBring your education, employment, travel and family background. Share previous refusals or complex circumstances at the beginning.\n\n## Expect questions, not promises\nResponsible advice explores both fit and risk. The result should be a clearer set of options and practical next steps.\n\n## Leave with direction\nA good consultation separates immediate actions from decisions that need more evidence.' },
];

function heroPlaceholder() {
  return panorama;
}

function formatDate(value) {
  if (!value) return 'Nestway insights';
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function BlogsPage() {
  const blogsQuery = useBlogs();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  useSeo({ title: 'Insights and resources', description: 'Practical immigration, study and destination insights from the Nestway team.' });

  const blogs = useMemo(() => Array.isArray(blogsQuery.data) && blogsQuery.data.length ? blogsQuery.data : fallbackBlogs, [blogsQuery.data]);
  const categories = ['All', ...new Set(blogs.map((blog) => blog.category).filter(Boolean))];
  const filtered = blogs.filter((blog) => {
    const haystack = `${blog.title} ${blog.excerpt} ${blog.category}`.toLowerCase();
    return (category === 'All' || blog.category === category) && haystack.includes(search.trim().toLowerCase());
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const featured = blogs.find((blog) => blog.isFeatured) || blogs[0];
  useEffect(() => setPage(1), [search, category]);

  return (
    <article>
      <PublicHero eyebrow="Resources" title="Useful perspective for" accent="important decisions." description="Immigration updates, destination thinking and practical preparation—written to make your next move easier to understand." backgroundImage={panorama} compact />
      <section className="bg-cream py-20 sm:py-28"><PageContainer>
        {blogsQuery.isPending ? <LoadingState label="Loading insights" /> : blogsQuery.isError && !blogs.length ? <ErrorState message={blogsQuery.error?.message} onRetry={() => blogsQuery.refetch()} /> : <>
          {featured && <Reveal><Link to={`/blogs/${featured.slug}`} className="group grid overflow-hidden rounded-2xl bg-brand text-white lg:grid-cols-[1.15fr_.85fr]"><div className="relative min-h-72 overflow-hidden lg:min-h-[30rem]"><img src={featured.coverImageUrl || panorama} alt={`${featured.title} article`} className="absolute inset-0 size-full object-cover opacity-75 transition duration-700 group-hover:scale-105" loading="eager" onError={(event) => { event.currentTarget.src = panorama; }} /><div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/15 to-transparent" /><span className="absolute left-6 top-6 rounded-full bg-gold px-4 py-2 text-xs font-bold uppercase tracking-[.13em] text-brand">Featured</span></div><div className="flex flex-col p-7 sm:p-10"><div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[.13em] text-gold-light"><span>{featured.category}</span><span>{featured.readingTimeMinutes || 5} min read</span></div><h2 className="mt-7 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">{featured.title}</h2><p className="mt-5 leading-7 text-white/60">{featured.excerpt}</p><p className="mt-auto pt-10 text-sm font-bold">Read the article <span className="ml-3 text-gold" aria-hidden="true">&rarr;</span></p></div></Link></Reveal>}

          <div className="mt-16 grid gap-4 rounded-3xl border border-brand/10 bg-white p-5 md:grid-cols-[1fr_auto] md:items-end"><label><span className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-gold-dark">Search resources</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by topic or keyword" className="form-control" /></label><div className="flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="Blog categories">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`whitespace-nowrap rounded-full px-4 py-3 text-xs font-bold transition ${category === item ? 'bg-brand text-white' : 'bg-cream text-brand hover:bg-brand/10'}`}>{item}</button>)}</div></div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map((blog, index) => <motion.article layout key={blog._id || blog.slug} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }} className="group overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-card"><Link to={`/blogs/${blog.slug}`} className="flex h-full flex-col"><div className="relative aspect-[16/10] overflow-hidden bg-brand"><img src={blog.coverImageUrl || panorama} alt={`${blog.title} article`} className="size-full object-cover opacity-80 transition duration-500 group-hover:scale-105" loading="lazy" onError={(event) => { event.currentTarget.src = panorama; }} /><span className="absolute bottom-4 left-4 rounded-full bg-cream/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-brand">{blog.category}</span></div><div className="flex flex-1 flex-col p-7"><p className="text-xs text-ink-muted">{formatDate(blog.publishedAt)} &middot; {blog.readingTimeMinutes || 5} min</p><h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-brand">{blog.title}</h2><p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-muted">{blog.excerpt}</p><p className="mt-auto pt-8 text-sm font-bold text-brand">Read insight <span className="ml-2 text-gold-dark" aria-hidden="true">&rarr;</span></p></div></Link></motion.article>)}</div>
          {!visible.length && <div className="mt-10 rounded-3xl border border-brand/10 bg-white p-12 text-center"><h2 className="font-display text-4xl font-semibold text-brand">No articles found.</h2><p className="mt-3 text-ink-muted">Try a broader keyword or a different category.</p></div>}
          {totalPages > 1 && <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Blog pagination"><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-full border border-brand/15 px-5 py-3 text-sm font-bold text-brand disabled:opacity-35">Previous</button><span className="px-4 text-sm text-ink-muted">Page {page} of {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-full border border-brand/15 px-5 py-3 text-sm font-bold text-brand disabled:opacity-35">Next</button></nav>}
          {blogsQuery.isError && blogs.length > 0 && <p className="mt-6 text-center text-sm text-ink-muted">Live resources are temporarily unavailable; showing selected guidance.</p>}
        </>}
      </PageContainer></section>
    </article>
  );
}
