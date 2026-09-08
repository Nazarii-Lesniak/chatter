import type { ComponentProps } from 'react';

type TIconWrapper = ComponentProps<'div'>;

export default function IconWrapper({
  children,
  className,
  ...props
}: TIconWrapper) {
  return <div className={className} {...props} />;
}
