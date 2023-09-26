import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function MentionItem({ pubkey, embed }: { pubkey: string; embed?: string }) {
  const { status, user } = useProfile(pubkey, embed);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2.5 px-2">
        <div className="relative h-8 w-8 shrink-0 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
        <div className="flex w-full flex-1 flex-col items-start gap-1 text-start">
          <span className="h-4 w-1/2 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
          <span className="h-3 w-1/3 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-11 items-center justify-start gap-2.5 px-2 hover:bg-white/10">
      <Image
        src={user.picture || user.image}
        alt={pubkey}
        className="shirnk-0 h-8 w-8 rounded-md object-cover"
      />
      <div className="flex flex-col items-start gap-px">
        <h5 className="max-w-[10rem] truncate text-sm font-medium leading-none text-white">
          {user.display_name || user.displayName || user.name}
        </h5>
        <span className="text-sm leading-none text-white/50">
          {displayNpub(pubkey, 16)}
        </span>
      </div>
    </div>
  );
}
