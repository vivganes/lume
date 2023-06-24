import { getLastLogin } from "@libs/storage";
import { Image } from "@shared/image";
import { NetworkStatusIndicator } from "@shared/networkStatusIndicator";
import { RelayContext } from "@shared/relayProvider";
import { useChannels } from "@stores/channels";
import { useChats } from "@stores/chats";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { sendNativeNotification } from "@utils/notification";
import { useContext, useEffect } from "react";

const lastLogin = await getLastLogin();

export function ActiveAccount({ data }: { data: any }) {
	const ndk = useContext(RelayContext);

	const notifyChat = useChats((state: any) => state.add);
	const notifyChannel = useChannels((state: any) => state.add);

	const { status, user } = useProfile(data.pubkey);

	useEffect(() => {
		const since = lastLogin > 0 ? lastLogin : Math.floor(Date.now() / 1000);
		// subscribe to channel
		const sub = ndk.subscribe(
			{
				kinds: [1, 4, 42],
				"#p": [data.pubkey],
				since: since,
			},
			{
				closeOnEose: false,
			},
		);

		sub.addListener("event", (event) => {
			switch (event.kind) {
				case 1:
					// send native notifiation
					sendNativeNotification("Someone mention you");
					break;
				case 4:
					// update state
					notifyChat(event.pubkey);
					// send native notifiation
					sendNativeNotification("You've received new message");
					break;
				case 42:
					// update state
					notifyChannel(event);
					// send native notifiation
					sendNativeNotification(event.content);
					break;
				default:
					break;
			}
		});

		return () => {
			sub.stop();
		};
	}, []);

	return (
		<button type="button" className="relative inline-block h-9 w-9">
			{status === "loading" ? (
				<div className="w-9 h-9 rounded bg-zinc-800 animate-pulse" />
			) : (
				<Image
					src={user.image}
					fallback={DEFAULT_AVATAR}
					alt={data.npub}
					className="h-9 w-9 rounded object-cover"
				/>
			)}
			<NetworkStatusIndicator />
		</button>
	);
}
