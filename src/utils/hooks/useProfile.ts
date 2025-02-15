import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

export function useProfile(pubkey: string, embed?: string) {
  const { ndk } = useNDK();
  const {
    status,
    data: user,
    error,
  } = useQuery({
    queryKey: ['user', pubkey],
    queryFn: async () => {
      if (embed) {
        const profile: NDKUserProfile = JSON.parse(embed);
        return profile;
      }

      const cleanPubkey = pubkey.replace(/[^a-zA-Z0-9]/g, '');
      const user = ndk.getUser({ pubkey: cleanPubkey });

      if (!user) return Promise.reject(new Error("user's profile not found"));
      return await user.fetchProfile();
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { status, user, error };
}
