import { Avatar } from './Avatar';
import { UserContent } from './Content';
import { Info } from './Info';
import { LastMessage } from './LastMessage';
import { Meta } from './Meta';
import { Status } from './Status';
import { Timestamp } from './Timestamp';
import { Username } from './Username';

export const User = Object.assign(UserContent, {
  Avatar,
  Info,
  Meta,
  Username,
  Status,
  LastMessage,
  Timestamp,
});
