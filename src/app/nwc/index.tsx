import { NWCAlby } from '@app/nwc/components/alby';
import { NWCOther } from '@app/nwc/components/other';

import { useStorage } from '@libs/storage/provider';

import { CheckCircleIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

export function NWCScreen() {
  const { db } = useStorage();

  const [walletConnectURL, setWalletConnectURL] = useStronghold((state) => [
    state.walletConnectURL,
    state.setWalletConnectURL,
  ]);

  const remove = async () => {
    setWalletConnectURL('');
    await db.secureSave('walletConnectURL', '', 'nwc');
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full flex-col gap-5">
        <div className="text-center">
          <h3 className="text-2xl font-bold leading-tight">
            Nostr Wallet Connect (Beta)
          </h3>
          <p className="leading-tight text-white/50">
            Sending tips easily via Bitcoin Lightning.
          </p>
        </div>
        <div className="mx-auto max-w-lg">
          {!walletConnectURL ? (
            <div className="flex w-full flex-col gap-4 divide-y divide-white/5 rounded-xl bg-white/10 p-3">
              <NWCAlby />
              <NWCOther />
            </div>
          ) : (
            <div className="flex w-full flex-col rounded-xl bg-white/10 p-3">
              <div className="mb-1 inline-flex items-center gap-1.5 text-sm text-green-500">
                <CheckCircleIcon className="h-4 w-4" />
                <p>You&apos;re using nostr wallet connect</p>
              </div>
              <div className="flex flex-col gap-2">
                <textarea
                  readOnly
                  value={walletConnectURL}
                  className="relative h-40 w-full resize-none rounded-lg bg-white/10 px-3 py-1 text-white !outline-none backdrop-blur-xl placeholder:text-white/50"
                />
                <button
                  type="button"
                  onClick={() => remove()}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white/5 px-6 font-medium leading-none text-red-500 hover:bg-white/10 focus:outline-none disabled:opacity-50"
                >
                  Remove connection
                </button>
              </div>
            </div>
          )}
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h5 className="text-sm font-bold text-white/80">Introduction</h5>
              <p className="text-sm text-white/50">
                Nostr Wallet Connect (NWC) is a way for applications like Nostr clients to
                access a remote Lightning wallet through a standardized protocol.
              </p>
              <p className="text-sm text-white/50">
                To learn more about the details have a look at{' '}
                <a
                  href="https://github.com/getAlby/nips/blob/7-wallet-connect-patch/47.md"
                  target="_blank"
                  className="text-fuchsia-200"
                  rel="noreferrer"
                >
                  the specs (NIP47)
                </a>
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h5 className="text-sm font-bold text-white/80">About tipping</h5>
              <p className="text-sm text-white/50">
                Also known as Zap in other Nostr client.
              </p>
              <p className="text-sm text-white/50">
                Lume doesn&apos;t take any commission or platform fees when you tip
                someone.
              </p>
              <p className="text-sm text-white/50">Lume doesn&apos;t hold your Bitcoin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
