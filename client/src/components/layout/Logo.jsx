import { Link } from 'react-router-dom';
import { brandAssets } from '../../assets/editorialImages.js';

export function Logo() {
  return (
    <Link to="/" aria-label="Nestway Immigration home" className="inline-flex shrink-0 items-center rounded-sm bg-white px-1.5 py-1 shadow-[0_1px_3px_rgba(7,26,51,.08)]">
      <img src={brandAssets.logo} alt="Nestway Immigration" className="h-14 w-[4.75rem] object-contain sm:h-16 sm:w-[5.5rem]" fetchPriority="high" />
    </Link>
  );
}
