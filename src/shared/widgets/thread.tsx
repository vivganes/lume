import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useCallback } from 'react';
import { WVList } from 'virtua';

import { LoaderIcon } from '@shared/icons';
import {
  ChildNote,
  MemoizedArticleKind,
  MemoizedFileKind,
  MemoizedTextKind,
  NoteActions,
  NoteReplyForm,
} from '@shared/notes';
import { ReplyList } from '@shared/notes/replies/list';
import { TitleBar } from '@shared/titleBar';
import { User } from '@shared/user';
import { WidgetWrapper } from '@shared/widgets';

import { useEvent } from '@utils/hooks/useEvent';
import { useNostr } from '@utils/hooks/useNostr';
import { Widget } from '@utils/types';

export function ThreadWidget({ widget }: { widget: Widget }) {
  const { status, data } = useEvent(widget.content);
  const { getEventThread } = useNostr();

  const renderKind = useCallback(
    (event: NDKEvent) => {
      const thread = getEventThread(event.tags);
      switch (event.kind) {
        case NDKKind.Text:
          return (
            <>
              {thread ? (
                <div className="mb-2 w-full px-3">
                  <div className="flex h-min w-full flex-col gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
                    {thread.rootEventId ? (
                      <ChildNote id={thread.rootEventId} isRoot />
                    ) : null}
                    {thread.replyEventId ? <ChildNote id={thread.replyEventId} /> : null}
                  </div>
                </div>
              ) : null}
              <MemoizedTextKind content={event.content} />
            </>
          );
        case NDKKind.Article:
          return <MemoizedArticleKind id={event.id} tags={event.tags} />;
        case 1063:
          return <MemoizedFileKind tags={event.tags} />;
        default:
          return null;
      }
    },
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={widget.id} title={widget.title} />
      <WVList className="flex-1 overflow-y-auto px-3 pb-5">
        {status === 'pending' ? (
          <div className="flex h-16 items-center justify-center rounded-xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950">
            <LoaderIcon className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex flex-col rounded-xl bg-neutral-50 dark:bg-neutral-950">
              <User pubkey={data.pubkey} time={data.created_at} variant="thread" />
              {renderKind(data)}
              <NoteActions event={data} />
            </div>
            <NoteReplyForm rootEvent={data} />
            <ReplyList eventId={data.id} />
          </>
        )}
      </WVList>
    </WidgetWrapper>
  );
}
