import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import panorama from '../assets/destinations-panorama.jpg';
import { ErrorState } from '../components/feedback/ErrorState.jsx';
import { LoadingState } from '../components/feedback/LoadingState.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { ConsultationCta } from '../components/public/ConsultationCta.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { useBlog, useBlogs } from '../hooks/queries/useBlogs.js';
import { useSeo } from '../hooks/useSeo.js';
import { fallbackBlogs } from './BlogsPage.jsx';

function ArticleContent({ content }) {
  const blocks = String(content || '').split(/\n\s*\n/).filter(Boolean);
  return <div className="space-y-7">{blocks.map((block, index) => {
    if (block.startsWith('## ')) return <h2 key={index} className="pt-5 font-display text-4xl font-semibold leading-tight text-brand sm:text-5xl">{block.slice(3)}</h2>;
    if (block.startsWith('# ')) return <h2 key={index} className="pt-5 font-display text-5xl font-semibold leading-tight text-brand">{block.slice(2)}</h2>;
    if (block.split('\n').every((line) => line.startsWith('- '))) return <ul key={index} className="space-y-3 rounded-3xl bg-cream p-7">{block.split('\n').map((line) => <li key={line} className="flex gap-4 leading-7 text-ink-muted"><span className="mt-3 size-1.5 shrink-0 rounded-full bg-gold" />{line.slice(2)}</li>)}</ul>;
    return <p key={index} className="text-lg leading-8 text-ink-muted">{block}</p>;
  })}</div>;
}

function authorName(author) {
  if (!author) return 'Nestway Editorial';
  if (typeof author === 'string') return 'Nestway Editorial';
  return author.name || [author.firstName, author.lastName].filter(Boolean).join(' ') || 'Nestway Editorial';
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const blogQuery = useBlog(slug);
  const blogsQuery = useBlogs();
  const fallback = fallbackBlogs.find((item) => item.slug === slug);
  const blog = blogQuery.data || fallback;
  const allBlogs = Array.isArray(blogsQuery.data) && blogsQuery.data.length ? blogsQuery.data : fallbackBlogs;
  const related = allBlogs.filter((item) => item.slug !== slug && (!blog?.category || item.category === blog.category)).slice(0, 3);
  const structuredData = useMemo(() => blog ? ({ '@context': 'https://schema.org', '@type': 'Article', headline: blog.title, description: blog.excerpt, image: blog.coverImageUrl, datePublished: blog.publishedAt, author: { '@type': 'Organization', name: authorName(blog.author) }, publisher: { '@type': 'Organization', name: 'Nestway Immigration' } }) : undefined, [blog]);
  useSeo({ title: blog?.seo?.metaTitle || blog?.title, description: blog?.seo?.metaDescription || blog?.excerpt, image: blog?.coverImageUrl, type: 'article', canonical: window.location.href, structuredData });

  if (blogQuery.isPending && !fallback) return <LoadingState label="Loading article" />;
  if (!blog) return <PageContainer className="py-32"><ErrorState title="Article not found" message={blogQuery.error?.message || 'This resource is not available.'} onRetry={() => blogQuery.refetch()} /></PageContainer>;

  return (
    <article className="bg-cream">
      <header className="relative isolate overflow-hidden bg-brand pb-20 pt-36 text-white sm:pb-28">
        <div className="absolute inset-0 -z-20"><img src={blog.coverImageUrl || panorama} alt="" className="size-full object-cover opacity-35" fetchPriority="high" onError={(event) => { event.currentTarget.src = panorama; }} /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,14,29,.97),rgba(7,26,51,.7))]" /></div>
        <PageContainer><Link to="/blogs" className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">&larr; All resources</Link><p className="mt-10 text-xs font-bold uppercase tracking-[.18em] text-gold-light">{blog.category} &middot; {blog.readingTimeMinutes || 5} min read</p><h1 className="mt-5 max-w-5xl font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.03] tracking-[-.028em]">{blog.title}</h1><p className="mt-7 max-w-3xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">{blog.excerpt}</p><div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/15 pt-6 text-sm text-white/55"><span>By {authorName(blog.author)}</span><span aria-hidden="true">&middot;</span><time dateTime={blog.publishedAt}>{blog.publishedAt ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(blog.publishedAt)) : 'Nestway insights'}</time></div></PageContainer>
      </header>

      <section className="py-20 sm:py-28"><PageContainer><div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]"><aside><Reveal><div className="sticky top-28 rounded-3xl border border-brand/10 bg-white p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-gold-dark">A useful reminder</p><p className="mt-5 font-display text-3xl font-semibold leading-tight text-brand">Immigration rules and criteria can change.</p><p className="mt-4 text-sm leading-6 text-ink-muted">Use this article as general guidance and confirm current requirements for your individual situation.</p><Link to="/appointment" className="mt-6 inline-flex text-sm font-bold text-brand">Discuss your case <span className="ml-2 text-gold-dark">&rarr;</span></Link></div></Reveal></aside><div><ArticleContent content={blog.content} /></div></div></PageContainer></section>

      {related.length > 0 && <section className="bg-white py-20 sm:py-28"><PageContainer><Reveal><p className="eyebrow">Continue exploring</p><h2 className="display-title">Related <em className="text-gold-dark">insights.</em></h2></Reveal><div className="mt-12 grid gap-5 md:grid-cols-3">{related.map((item, index) => <Reveal key={item.slug} delay={index * .05}><Link to={`/blogs/${item.slug}`} className="group flex min-h-72 flex-col rounded-3xl border border-brand/10 bg-cream p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-card-hover"><span className="text-xs font-bold uppercase tracking-[.15em] text-gold-dark">{item.category}</span><h3 className="mt-10 font-display text-3xl font-semibold leading-tight text-brand">{item.title}</h3><span className="mt-auto pt-8 text-sm font-bold text-brand">Read article <span className="ml-2 text-gold-dark">&rarr;</span></span></Link></Reveal>)}</div></PageContainer></section>}
      <ConsultationCta eyebrow="Need advice for your circumstances?" title="Turn information into an individual plan." />
    </article>
  );
}
