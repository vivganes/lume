import { useQuery } from '@tanstack/react-query';

import { Profile } from '@app/trending/components/profile';

import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

interface Response {
  profiles: Array<{ pubkey: string }>;
}

export function TrendingProfiles() {
  const { status, data } = useQuery(
    ['trending-profiles'],
    async () => {
      const res = await fetch('https://api.nostr.band/v0/trending/profiles');
      if (!res.ok) {
        throw new Error('Error');
      }
      const json: Response = await res.json();
      if (!json.profiles) return null;
      return json.profiles;
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  return (
    <div className="scrollbar-hide relative h-full w-[400px] shrink-0 overflow-y-auto bg-white/10 pb-20">
      <TitleBar title="Trending Profiles" />
      <div className="h-full">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : status === 'error' ? (
          <p>Failed to fetch</p>
        ) : (
          <div className="relative flex w-full flex-col gap-3 px-3 pt-1.5">
            {data.map((item) => (
              <Profile key={item.pubkey} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
