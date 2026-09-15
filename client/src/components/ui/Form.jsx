import { FormProvider, useForm } from 'react-hook-form';
import { cn } from '../../utils/cn.js';

export function Form({ onSubmit, defaultValues, options, className, children }) {
  const methods = useForm({ defaultValues, ...options });
  return (
    <FormProvider {...methods}>
      <form className={cn('space-y-5', className)} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  );
}
