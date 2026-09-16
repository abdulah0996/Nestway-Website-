import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { countryImages } from '../../assets/editorialImages.js';
import panorama from '../../assets/destinations-panorama.jpg';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';
import { JourneyIcon } from './JourneyIcon.jsx';

const fallbacks = [
  { _id: 'home-story-1', name: 'Ayesha R.', role: 'Master’s student', country: 'Australia', rating: 5, content: 'Nestway turned a confusing set of choices into a clear university and visa plan. I always knew what came next.' },
  { _id: 'home-story-2', name: 'Hamza K.', role: 'Skilled professional', country: 'Canada', rating: 5, content: 'The honest assessment was the most valuable part. We strengthened the right evidence and moved forward with confidence.' },
  { _id: 'home-story-3', name: 'Sara & family', role: 'Family visitors', country: 'United Kingdom', rating: 5, content: 'Every detail was explained calmly, and the final application reflected our circumstances clearly.' },
];

export function TestimonialsSection({ query }) {
  const live = Array.isArray(query.data) ? query.data.filter((item) => item.isPublished !== false) : [];
  const testimonials = (live.length ? live : fallbacks).slice(0, 3);
  const track = useRef(null);
  const [active, setActive] = useState(0);

  function updateActive() {
    const firstCard = track.current?.firstElementChild;
    if (!firstCard) return;
    const maximumScroll = track.current.scrollWidth - track.current.clientWidth;
    const atEnd = maximumScroll > 1 && track.current.scrollLeft >= maximumScroll - 2;
    setActive(atEnd ? testimonials.length - 1 : Math.max(0, Math.min(testimonials.length - 1, Math.round(track.current.scrollLeft / (firstCard.offsetWidth + 16)))));
  }

  function moveStory(direction) {
    const firstCard = track.current?.firstElementChild;
    if (!firstCard) return;
    track.current.scrollBy({ left: direction * (firstCard.offsetWidth + 16), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return (
    <section className="stories-section" aria-labelledby="client-stories-title">
      <PageContainer>
        <Reveal className="stories-heading"><div><p className="eyebrow">The people behind the plans</p><h2 id="client-stories-title" className="display-title">A new chapter.<br /><em>In their words.</em></h2><p className="stories-intro">Different ambitions. Different destinations. Personal guidance that makes the journey feel clearer.</p></div><Link to="/success-stories" className="stories-link">Explore client stories <JourneyIcon name="arrow" /></Link></Reveal>
        {query.isPending ? <div className="stories-loading" role="status" aria-label="Loading client stories">{Array.from({ length: 3 }, (_, index) => <div key={index} className="animate-pulse" />)}</div> : <>
          <div ref={track} onScroll={updateActive} className="stories-track mobile-snap-row" role="region" aria-label="Client stories" tabIndex={0}>
            {testimonials.map((story) => {
              const countryKey = (story.country || '').toLowerCase().replaceAll(' ', '-');
              const rating = Math.max(1, Math.min(5, Number(story.rating) || 5));
              return <figure key={story._id || story.name} className="story-card"><div className="story-destination"><img src={countryImages[countryKey] || panorama} alt="" loading="lazy" /><div /><span><JourneyIcon name="pin" />{story.country || 'A world of possibilities'}</span><span className="story-quote-mark" aria-hidden="true">“</span></div><div className="story-body"><div className="story-stars" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(rating)}</div><blockquote>“{story.content}”</blockquote><figcaption><div className="story-avatar">{story.photoUrl ? <img src={story.photoUrl} alt="" loading="lazy" /> : (story.name || 'N').charAt(0)}</div><div><p>{story.name}</p><span>{story.role || 'Nestway client'}</span></div><span className="story-signature" aria-hidden="true">↗</span></figcaption></div></figure>;
            })}
          </div>
          {testimonials.length > 1 && <div className="stories-controls"><div className="stories-position" aria-live="polite"><strong>{String(active + 1).padStart(2, '0')}</strong><span>/ {String(testimonials.length).padStart(2, '0')}</span><span className="stories-progress">{testimonials.map((story, index) => <i key={story._id || story.name} className={index === active ? 'is-active' : ''} />)}</span></div><div className="stories-buttons"><button type="button" onClick={() => moveStory(-1)} disabled={active === 0} aria-label="Previous client story"><JourneyIcon name="arrow" /></button><button type="button" onClick={() => moveStory(1)} disabled={active === testimonials.length - 1} aria-label="Next client story"><JourneyIcon name="arrow" /></button></div></div>}
        </>}
        {query.isError && <p className="stories-status">Selected client perspectives from Nestway.</p>}
      </PageContainer>
    </section>
  );
}
