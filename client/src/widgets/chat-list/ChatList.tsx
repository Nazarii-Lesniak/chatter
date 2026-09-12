import SearchInput from '@/features/search-by-name/ui/SearchInput';
import { PeopleList } from '../people-list/PeopleList';

export function ChatList() {
  return (
    <div className="flex flex-col w-full gap-8">
      <SearchInput />
      <PeopleList />
    </div>
  );
}
