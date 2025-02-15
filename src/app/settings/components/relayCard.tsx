import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { EditIcon, LoaderIcon } from '@shared/icons';

import { compactNumber } from '@utils/number';

export function RelayCard() {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data } = useQuery({
    queryKey: ['relays'],
    queryFn: async () => {
      const user = ndk.getUser({ pubkey: db.account.pubkey });
      const relays = await user.relayList();

      if (!relays) return Promise.reject(new Error("user's relay set not found"));
      return relays;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="col-span-1 h-44 rounded-2xl bg-neutral-100 transition-all duration-150 ease-smooth hover:scale-105 dark:bg-neutral-900">
      {status === 'pending' ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoaderIcon className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col justify-between p-4">
          <h3 className="pt-1 text-5xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
            {compactNumber.format(data?.relays?.length || 0)}
          </h3>
          <div className="mt-auto flex h-6 w-full items-center justify-between">
            <p className="text-xl font-medium leading-none text-neutral-600 dark:text-neutral-400">
              Relays
            </p>
            <Link
              to="/relays"
              className="inline-flex h-6 w-max items-center gap-1 rounded-full bg-neutral-200 px-2.5 text-sm font-medium hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              <EditIcon className="h-3 w-3" />
              Edit
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
