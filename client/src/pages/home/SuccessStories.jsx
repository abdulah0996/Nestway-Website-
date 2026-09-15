import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';
import { JourneyIcon } from './JourneyIcon.jsx';

const journey = [
  { icon: 'compass', label: 'Discover', title: 'Start with your story.', description: 'Share your goals, experience and circumstances. We help you understand the pathways worth exploring.', outcome: 'A clearer sense of direction' },
  { icon: 'route', label: 'Plan', title: 'Make an informed choice.', description: 'Compare destinations and requirements, then shape a practical plan around your priorities.', outcome: 'Your personalised next steps' },
  { icon: 'file', label: 'Prepare', title: 'Bring every detail together.', description: 'Work through the documents and application requirements with guidance on what to prepare and why.', outcome: 'A carefully prepared application' },
  { icon: 'plane', label: 'Move forward', title: 'Be ready for what comes next.', description: 'Understand the next stage, from application updates to practical preparations if your visa is granted.', outcome: 'Confidence for your next chapter' },
];

export function SuccessStories() {
  return (
    <section id="success-stories" className="journey-section">
      <PageContainer>
        <Reveal className="journey-heading">
          <div><p className="eyebrow">A clear way forward</p><h2 className="display-title">Big life decisions.<br /><em className="text-gold-dark">Four thoughtful steps.</em></h2></div>
          <p className="journey-intro">You bring the ambition. We help turn the questions, choices and paperwork into a journey you can understand.</p>
        </Reveal>
        <div className="journey-route" aria-hidden="true"><span>Your ambition</span><div><i /><i /><i /><JourneyIcon name="plane" /></div><span>Your next chapter</span></div>
        <ol className="journey-grid">
          {journey.map((stage, index) => <li key={stage.label}><Reveal delay={index * .05} className="journey-step"><div className="journey-step-top"><span className="journey-icon"><JourneyIcon name={stage.icon} /></span><span className="journey-number">0{index + 1}</span></div><p className="journey-label">{stage.label}</p><h3>{stage.title}</h3><p className="journey-description">{stage.description}</p><div className="journey-outcome"><span aria-hidden="true">↗</span>{stage.outcome}</div></Reveal></li>)}
        </ol>
        <div className="journey-footer"><p>Your pathway starts with a conversation.</p><Link to="/appointment">Let’s talk about your plans <JourneyIcon name="arrow" /></Link></div>
      </PageContainer>
    </section>
  );
}
