import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import panorama from '../../assets/destinations-panorama.jpg';
import { resourceImages } from '../../assets/editorialImages.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';

const fallbacks = [
  { _id: 'home-blog-1', slug: 'how-to-build-a-strong-study-visa-plan', title: 'How to build a stronger study visa plan', excerpt: 'Connect your course, finances and future goals into one clear, credible application story.', category: 'Study', readingTimeMinutes: 6, coverImageUrl: resourceImages.study },
  { _id: 'home-blog-2', slug: 'choosing-a-destination-beyond-rankings', title: 'Choosing a destination beyond the rankings', excerpt: 'Compare education, opportunity, cost and lifestyle—not only a place on a league table.', category: 'Destinations', readingTimeMinutes: 5, coverImageUrl: resourceImages.destinations },
  { _id: 'home-blog-3', slug: 'documents-that-create-confidence', title: 'Documents that create confidence', excerpt: 'Build evidence that is current, relevant, readable and consistent with the wider application.', category: 'Application strategy', readingTimeMinutes: 7, coverImageUrl: resourceImages.documents },
];

export function BlogPreviewSection({ query }) {
  const live = Array.isArray(query.data) ? query.data : [];
  const blogs = (live.length ? live : fallbacks).slice(0, 3);

  return (
    <section className="bg-white py-24 sm:py-32">
      <PageContainer>
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><Reveal><p className="eyebrow">Resources</p><h2 className="display-title max-w-3xl">Perspective for <em className="text-gold-dark">important decisions.</em></h2></Reveal><Reveal delay={.08}><Link to="/blogs" className="inline-flex items-center gap-3 text-sm font-bold text-brand">Explore all resources <span className="text-gold-dark" aria-hidden="true">&rarr;</span></Link></Reveal></div>
        {query.isPending ? <div className="mt-14 grid gap-5 lg:grid-cols-3" role="status" aria-label="Loading resources">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-[28rem] animate-pulse rounded-2xl bg-cream" />)}</div> : <div className="mt-14 grid gap-5 lg:grid-cols-3">{blogs.map((blog, index) => <motion.article key={blog._id || blog.slug} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .05, duration: .45 }} className="group overflow-hidden rounded-2xl border border-brand/10 bg-cream shadow-card transition-shadow hover:shadow-card-hover"><Link to={`/blogs/${blog.slug}`} className="flex h-full flex-col"><div className="relative aspect-[16/10] overflow-hidden bg-brand"><img src={blog.coverImageUrl || panorama} alt={`${blog.title} article`} className="size-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.025]" loading="lazy" onError={(event) => { event.currentTarget.src = panorama; }} /><span className="absolute bottom-4 left-4 rounded-full bg-cream/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-brand">{blog.category || 'Guidance'}</span></div><div className="flex flex-1 flex-col p-7"><p className="text-xs font-bold uppercase tracking-[.12em] text-gold-dark">{blog.readingTimeMinutes || 5} min read</p><h3 className="mt-5 font-display text-3xl font-semibold leading-tight text-brand">{blog.title}</h3><p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-muted">{blog.excerpt}</p><p className="mt-auto pt-8 text-sm font-bold text-brand">Read insight <span className="ml-2 text-gold-dark" aria-hidden="true">&rarr;</span></p></div></Link></motion.article>)}</div>}
        {query.isError && <p className="mt-6 text-sm text-ink-muted">Live resources are temporarily unavailable; showing selected guidance.</p>}
      </PageContainer>
    </section>
  );
}
