import { motion, useReducedMotion } from 'framer-motion';

function AirplaneMark() {
  return (
    <svg viewBox="0 0 128 62" role="presentation" className="h-auto w-full drop-shadow-[0_5px_12px_rgba(0,0,0,.35)]">
      <defs>
        <linearGradient id="plane-body" x1="0" x2="1">
          <stop offset="0" stopColor="#9ba7b5" />
          <stop offset=".42" stopColor="#f4f6f8" />
          <stop offset="1" stopColor="#8fbfd9" />
        </linearGradient>
      </defs>
      <path fill="url(#plane-body)" d="M4 34.7c-.8-2.7 1.6-4.3 4.4-4.7l35.3-5.2L67.8 3.6c2.1-1.8 5.7-2.6 8.7-2.2l4.8.7-14.7 20.1 42.7-6.3c4.5-.7 12.2 1.6 15 4.3 1.6 1.6 1.4 3.2-.7 4.2L68 39.2 46.5 59.5l-8.8 1.3 10.7-18.3-25.7 6.8-10.1-2.8 15.1-9.1-19.1.8c-2.2.1-4-1.3-4.6-3.5Z" />
      <path fill="#071a33" opacity=".82" d="m103.2 17.3 6.1-1.4c4.5-.7 12.2 1.6 15 4.3.6.6 1 1.2 1 1.8l-17.1 4.5-5-9.2Z" />
      <path fill="#dceff7" d="m67.8 3.6 8.7-2.2 4.8.7-3.9 5.3-9.6-3.8Z" />
      <g fill="#071a33" opacity=".75">
        <circle cx="77" cy="28.7" r="1.25" /><circle cx="83" cy="27.8" r="1.25" /><circle cx="89" cy="26.9" r="1.25" /><circle cx="95" cy="26" r="1.25" />
      </g>
    </svg>
  );
}

export function FlightJourney() {
  const reduceMotion = useReducedMotion();
  const travel = reduceMotion ? {} : {
    x: ['-18vw', '14vw', '47vw', '78vw', '116vw'],
    y: ['5vh', '-2vh', '-7vh', '-4vh', '-12vh'],
    rotate: [-2, -6, -2, -5, -3],
    opacity: [0, .38, .5, .36, 0],
  };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <motion.div
        className="absolute left-0 top-[22%] w-20 opacity-0 sm:top-[18%] sm:w-28 lg:w-36"
        animate={reduceMotion ? { opacity: .2, x: '78vw', y: '-2vh' } : travel}
        transition={reduceMotion ? { duration: 0 } : { duration: 19, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
      >
        <div className="absolute right-[76%] top-1/2 h-px w-32 bg-gradient-to-l from-white/25 to-transparent blur-[.2px] sm:w-52" />
        <AirplaneMark />
      </motion.div>

      <svg viewBox="0 0 1440 540" preserveAspectRatio="none" className="absolute left-0 top-[9%] h-[48%] w-full opacity-20 sm:opacity-30">
        <motion.path
          d="M-80 330 C 290 140, 645 100, 970 178 S 1370 110, 1530 20"
          fill="none"
          stroke="url(#route-gradient)"
          strokeWidth="1"
          strokeDasharray="4 11"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: reduceMotion ? .25 : [.1, .65, .1] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <defs><linearGradient id="route-gradient"><stop stopColor="#dceff7" stopOpacity="0" /><stop offset=".5" stopColor="#8fbfd9" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
      </svg>

      {[{ top: '13%', left: '-8%', size: '38rem', duration: 28 }, { top: '39%', left: '64%', size: '30rem', duration: 34 }].map((cloud, index) => (
        <motion.div
          key={cloud.left}
          className="absolute rounded-full bg-white/[.045] blur-3xl"
          style={{ top: cloud.top, left: cloud.left, width: cloud.size, height: '7rem' }}
          animate={reduceMotion ? undefined : { x: index ? [-24, 24, -24] : [18, -18, 18], opacity: [.02, .07, .02] }}
          transition={reduceMotion ? undefined : { duration: cloud.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
