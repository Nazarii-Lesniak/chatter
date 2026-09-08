import { SearchIcon } from 'lucide-react';
import { Input } from '@/shared/ui/input/Input';

export default function SearchInput() {
  return (
    <Input variant="search">
      <Input.Icon>
        <button
          type="button"
          className="text-chat-text-muted hover:text-chat-text-muted/80 transition-colors cursor-pointer"
        >
          <SearchIcon
            aria-label="Search"
            className="size-6 md:size-8 lg:size-10"
          />
        </button>
      </Input.Icon>
      <Input.Field type="text" placeholder="Search" />
    </Input>
  );
}
