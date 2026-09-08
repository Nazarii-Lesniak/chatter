import type { ComponentProps } from 'react';

type TButton = ComponentProps<'button'>;

export default function Button({ ...props }: TButton) {
  return <button {...props} />;
}
