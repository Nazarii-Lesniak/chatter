import { SearchIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button/Button';
import * as Input from '@/shared/ui/input/Input';

export default function SearchInput() {
  return (
    <Input.Root variant="search">
      <Input.Icon>
        <Button variant="search">
          <SearchIcon aria-label="Search" />
        </Button>
      </Input.Icon>
      <Input.Field type="text" placeholder="Search" />
    </Input.Root>
  );
}
