import { Avatar } from './Avatar';
import { UserContent } from './Content';
import { LastSeen } from './LastSeen';
import { Username } from './Username';

export const User = Object.assign(UserContent, {
  Avatar,
  Username,
  LastSeen,
});
