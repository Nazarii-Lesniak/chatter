import React from 'react';
import { cn } from './class-merge';

export function renderIcon(icon: React.ReactNode) {
  if (!React.isValidElement(icon)) {
    return icon;
  }

  const iconProps = icon.props as { className?: string };

  return React.cloneElement(icon, {
    className: cn('h-full w-full', iconProps.className),
  } as React.Attributes);
}
