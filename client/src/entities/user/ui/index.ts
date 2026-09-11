import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { UserContent } from './Content';
import { CreatedAt } from './CreatedAt';
import { Info } from './Info';
import { LastSeen } from './LastSeen';
import { Meta } from './Meta';
import { Username } from './Username';

export const User = Object.assign(UserContent, {
  Avatar,
  Info,
  Meta,
  Username,
  LastSeen,
  CreatedAt,
  Badge,
});
