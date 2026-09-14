import SearchInput from '@/features/search-by-name/ui/SearchInput';
import { PeopleList } from '../people-list/PeopleList';

export function ChatList() {
  return (
    <div className="hidden md:hidden lg:flex lg:flex-col lg:w-80 xl:w-96 lg:gap-5 lg:shrink-0">
      <SearchInput />
      <PeopleList />
    </div>
  );
}
