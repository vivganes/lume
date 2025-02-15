import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { getPublicKey, nip19 } from 'nostr-tools';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

export function NewPrivkeyScreen() {
  const { db } = useStorage();
  const { ndk } = useNDK();

  const [nsec, setNsec] = useState('');
  const navigate = useNavigate();

  const save = async (content: string) => {
    return await db.secureSave(db.account.pubkey, content);
  };

  const submit = async (isSave?: boolean) => {
    try {
      if (!nsec.startsWith('nsec1'))
        return toast.info('You must enter a private key starts with nsec');

      const decoded = nip19.decode(nsec);

      if (decoded.type !== 'nsec') return toast.info('You must enter a valid nsec');

      const privkey = decoded.data;
      const pubkey = getPublicKey(privkey);

      if (pubkey !== db.account.pubkey)
        return toast.info(
          'Your nsec is not match your current public key, please make sure you enter right nsec'
        );

      const signer = new NDKPrivateKeySigner(privkey);
      ndk.signer = signer;

      if (isSave) await save(privkey);

      navigate(-1);
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mb-16 flex flex-col gap-3">
        <h1 className="text-center font-semibold text-neutral-900 dark:text-neutral-100">
          You need to provide private key to sign nostr event.
        </h1>
        <input
          name="privkey"
          placeholder="nsec..."
          type="password"
          value={nsec}
          onChange={(e) => setNsec(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="h-11 w-full rounded-lg bg-neutral-100 px-3 py-2 placeholder:text-neutral-500 dark:bg-neutral-900 dark:placeholder:text-neutral-400"
        />
        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => submit()}
            className="inline-flex h-9 w-full shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => submit(true)}
            className="inline-flex h-9 w-full shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-medium text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            Submit and Save
          </button>
        </div>
      </div>
    </div>
  );
}
