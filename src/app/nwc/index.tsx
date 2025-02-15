import { useEffect, useState } from 'react';

import { NWCForm } from '@app/nwc/components/form';

import { useStorage } from '@libs/storage/provider';

import { CheckCircleIcon } from '@shared/icons';

export function NWCScreen() {
  const { db } = useStorage();
  const [walletConnectURL, setWalletConnectURL] = useState<null | string>(null);

  const remove = async () => {
    await db.secureRemove('nwc');
    setWalletConnectURL(null);
  };

  useEffect(() => {
    async function getNWC() {
      const nwc = await db.secureLoad(`${db.account.pubkey}-nwc`);
      if (nwc) setWalletConnectURL(nwc);
    }
    getNWC();
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full flex-col gap-5">
        <div className="text-center">
          <h3 className="text-2xl font-bold leading-tight">Nostr Wallet Connect</h3>
          <p className="leading-tight text-neutral-600 dark:text-neutral-400">
            Sending zap easily via Bitcoin Lightning.
          </p>
        </div>
        <div className="mx-auto max-w-lg">
          {!walletConnectURL ? (
            <NWCForm setWalletConnectURL={setWalletConnectURL} />
          ) : (
            <div className="flex w-full flex-col gap-3 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
              <div className="flex items-center justify-center gap-1.5 text-sm text-teal-500">
                <CheckCircleIcon className="h-4 w-4" />
                <div>You&apos;re using nostr wallet connect</div>
              </div>
              <div className="flex flex-col gap-2">
                <textarea
                  readOnly
                  value={walletConnectURL.substring(0, 120) + '****'}
                  className="relative h-40 w-full resize-none rounded-lg bg-neutral-200 px-3 py-1 text-neutral-900 !outline-none placeholder:text-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => remove()}
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-neutral-200 px-6 font-medium text-red-500 hover:bg-red-500 hover:text-white focus:outline-none dark:bg-neutral-800 dark:text-neutral-100"
                >
                  Remove connection
                </button>
              </div>
            </div>
          )}
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h5 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Introduction
              </h5>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Nostr Wallet Connect (NWC) is a way for applications like Nostr clients to
                access a remote Lightning wallet through a standardized protocol.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                To learn more about the details have a look at{' '}
                <a
                  href="https://github.com/nostr-protocol/nips/blob/master/47.md"
                  target="_blank"
                  className="text-blue-500"
                  rel="noreferrer"
                >
                  the specs (NIP47)
                </a>
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h5 className="font-semibold text-neutral-900 dark:text-neutral-100">
                About zapping
              </h5>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Lume doesn&apos;t take any commission or platform fees when you zap
                someone.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Lume doesn&apos;t hold your Bitcoin
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h5 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Recommend wallet that support NWC
              </h5>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Mutiny Wallet:{' '}
                <a
                  href="https://www.mutinywallet.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500"
                >
                  website
                </a>
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Self hosted NWC on Umbrel :{' '}
                <a
                  href="https://apps.umbrel.com/app/alby-nostr-wallet-connect"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500"
                >
                  website
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
