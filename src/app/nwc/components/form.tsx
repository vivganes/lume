import { useState } from 'react';
import { toast } from 'sonner';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';

export function NWCForm({ setWalletConnectURL }) {
  const { db } = useStorage();

  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      if (!uri.startsWith('nostr+walletconnect:')) {
        toast.error(
          'Connect URI is required and must start with format nostr+walletconnect:, please check again'
        );
        setLoading(false);
        return;
      }

      const uriObj = new URL(uri);
      const params = new URLSearchParams(uriObj.search);

      if (params.has('relay') && params.has('secret')) {
        await db.secureSave(`${db.account.pubkey}-nwc`, uri);
        setWalletConnectURL(uri);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error('Connect URI is not valid, please check again');
        return;
      }
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
      <div className="flex flex-col gap-1.5">
        <textarea
          name="walletConnectURL"
          value={uri}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={false}
          onChange={(e) => setUri(e.target.value)}
          placeholder="nostr+walletconnect://"
          className="h-40 w-full resize-none rounded-lg bg-neutral-200 px-3 py-3 text-neutral-900 !outline-none placeholder:text-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400"
        />
      </div>
      <button
        type="button"
        onClick={submit}
        className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600"
      >
        {loading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : 'Connect'}
      </button>
    </div>
  );
}
