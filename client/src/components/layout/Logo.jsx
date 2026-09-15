import { Link } from 'react-router-dom';
import { brandAssets } from '../../assets/editorialImages.js';

export function Logo() {
  return (
    <Link to="/" aria-label="Nestway Immigration home" className="inline-flex shrink-0 items-center rounded-md bg-white p-1 shadow-[0_2px_10px_rgba(7,26,51,.08)]">
      <img
        src={brandAssets.logo}
        alt="Nestway Immigration"
        width="1024"
        height="1024"
        className="size-14 object-contain sm:size-16"
        fetchPriority="high"
      />
    </Link>
  );
}
