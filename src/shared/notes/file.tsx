import { NDKEvent } from '@nostr-dev-kit/ndk';
import { downloadDir } from '@tauri-apps/api/path';
import { download } from '@tauri-apps/plugin-upload';
import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeRange,
} from 'media-chrome/dist/react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { DownloadIcon } from '@shared/icons';
import { NoteActions } from '@shared/notes';
import { User } from '@shared/user';

import { fileType } from '@utils/nip94';

export function FileNote({ event }: { event: NDKEvent }) {
  const downloadImage = async (url: string) => {
    const downloadDirPath = await downloadDir();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return await download(url, downloadDirPath + `/${filename}`);
  };

  const renderFileType = () => {
    const url = event.tags.find((el) => el[0] === 'url')[1];
    const type = fileType(url);

    switch (type) {
      case 'image':
        return (
          <div key={url} className="group relative">
            <img
              src={url}
              alt={url}
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: 'auto' }}
              className="h-auto w-full object-cover"
            />
            <button
              type="button"
              onClick={() => downloadImage(url)}
              className="absolute right-2 top-2 hidden h-10 w-10 items-center justify-center rounded-lg bg-black/50 backdrop-blur-xl group-hover:inline-flex hover:bg-blue-500"
            >
              <DownloadIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        );
      case 'video':
        return (
          <MediaController
            key={url}
            className="aspect-video w-full overflow-hidden rounded-lg"
          >
            <video slot="media" src={url} preload="metadata" muted />
            <MediaControlBar>
              <MediaPlayButton></MediaPlayButton>
              <MediaTimeRange></MediaTimeRange>
              <MediaMuteButton></MediaMuteButton>
              <MediaFullscreenButton></MediaFullscreenButton>
            </MediaControlBar>
          </MediaController>
        );
      default:
        return (
          <Link
            to={url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            {url}
          </Link>
        );
    }
  };

  return (
    <div className="mb-3 h-min w-full px-3">
      <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl bg-neutral-50 pt-3 dark:bg-neutral-950">
        <User pubkey={event.pubkey} time={event.created_at} eventId={event.id} />
        <div className="relative mt-2">{renderFileType()}</div>
        <NoteActions event={event} />
      </div>
    </div>
  );
}

export const MemoizedFileNote = memo(FileNote);
