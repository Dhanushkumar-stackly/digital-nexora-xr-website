import { Suspense, lazy, useRef } from 'react';

import { SectionWrapper } from '../../hoc';
import { services } from '../../constants/content';
import { useNearViewport } from '../../hooks/useNearViewport';
import SectionIntro from './SectionIntro';

const SeoSceneCanvas = lazy(() => import('../canvas/SeoScene'));

const Services = () => {
  const artRef = useRef<HTMLDivElement>(null);
  const showArt = useNearViewport(artRef);

  return (
    <>
      <SectionIntro eyebrow="Our Services" title="End-to-End Digital Marketing Solutions" />

      <div className="agency-services-layout">
        <ol className="agency-services">
          {services.map((service, index) => (
            <li key={service.title} className="agency-service">
              <p className="agency-service-label">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="agency-service-title">{service.title}</h3>
              <p className="agency-service-text">{service.description}</p>
            </li>
          ))}
        </ol>

        <div ref={artRef} className="agency-services-art" aria-hidden="true">
          {showArt && (
            <Suspense fallback={null}>
              <SeoSceneCanvas />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Services, 'services');
