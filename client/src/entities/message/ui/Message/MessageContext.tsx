'use client';

import { createContext, useContext } from 'react';

type TMessageVariant = 'companion' | 'own';

interface IMessagContextType {
  variant: TMessageVariant;
}

export const MessageContext = createContext<IMessagContextType | null>(null);

export function useMessageContext() {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error(
      'Message subcomponents must be used within <MessageBubble>',
    );
  }

  return context;
}
