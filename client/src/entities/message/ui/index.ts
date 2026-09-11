import { Bubble } from './Bubble';
import { MessageContent } from './Content';
import { Tail } from './Tail';
import { Timestamp } from './Timestamp';

export const Message = Object.assign(MessageContent, {
  Bubble,
  Tail,
  Timestamp,
});
