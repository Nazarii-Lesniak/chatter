import type { ComponentProps } from 'react';
import { renderIcon } from '@/shared/lib/render-icon';
import { buttonVariants } from './button-variants';

interface IRoot extends ComponentProps<'button'> {
  variant: 'sidebar' | 'action' | 'addon' | 'voice' | 'search' | 'auth';
  children?: React.ReactNode;
}

export function Button({
  className,
  variant,
  children,
  type = 'button',
  ...props
}: IRoot) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, className })}
      {...props}
    >
      {renderIcon(children)}
    </button>
  );
}
