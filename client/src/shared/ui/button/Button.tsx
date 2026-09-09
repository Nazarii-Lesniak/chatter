import type { ComponentProps } from 'react';
import { renderIcon } from '@/shared/lib/render-icon';
import { buttonVariants } from './button-variants';

interface IRoot extends ComponentProps<'button'> {
  variant: 'sidebar' | 'action' | 'addon' | 'voice' | 'search';
  children?: React.ReactNode;
}

export function Button({ className, variant, children, ...props }: IRoot) {
  return (
    <button
      type="button"
      className={buttonVariants({ variant, className })}
      {...props}
    >
      {renderIcon(children)}
    </button>
  );
}
