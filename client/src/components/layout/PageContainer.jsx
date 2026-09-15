import { cn } from '../../utils/cn.js';

export function PageContainer({ as: Component = 'div', className, children }) {
  return <Component className={cn('mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-10', className)}>{children}</Component>;
}
