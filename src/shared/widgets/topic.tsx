import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FetchFilter } from 'nostr-fetch';
import { useCallback, useMemo } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import {
  MemoizedRepost,
  MemoizedTextNote,
  NoteSkeleton,
  UnknownNote,
} from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { FETCH_LIMIT } from '@stores/constants';

import { Widget } from '@utils/types';

export function TopicWidget({ widget }: { widget: Widget }) {
  const { relayUrls, ndk, fetcher } = useNDK();
  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['topic', widget.id],
      initialPageParam: 0,
      queryFn: async ({
        signal,
        pageParam,
      }: {
        signal: AbortSignal;
        pageParam: number;
      }) => {
        const hashtags: string[] = JSON.parse(widget.content as string);
        const filter: FetchFilter = {
          kinds: [NDKKind.Text, NDKKind.Repost],
          '#t': hashtags.map((tag) => tag.replace('#', '')),
        };

        const rootIds = new Set();
        const dedupQueue = new Set();

        const events = await fetcher.fetchLatestEvents(relayUrls, filter, FETCH_LIMIT, {
          asOf: pageParam === 0 ? undefined : pageParam,
          abortSignal: signal,
        });

        const ndkEvents = events.map((event) => {
          return new NDKEvent(ndk, event);
        });

        ndkEvents.forEach((event) => {
          const tags = event.tags.filter((el) => el[0] === 'e');
          if (tags && tags.length > 0) {
            const rootId = tags.filter((el) => el[3] === 'root')[1] ?? tags[0][1];
            if (rootIds.has(rootId)) return dedupQueue.add(event.id);
            rootIds.add(rootId);
          }
        });

        return ndkEvents
          .filter((event) => !dedupQueue.has(event.id))
          .sort((a, b) => b.created_at - a.created_at);
      },
      getNextPageParam: (lastPage) => {
        const lastEvent = lastPage.at(-1);
        if (!lastEvent) return;
        return lastEvent.created_at - 1;
      },
      refetchOnWindowFocus: false,
    });

  const allEvents = useMemo(
    () => (data ? data.pages.flatMap((page) => page) : []),
    [data]
  );

  const renderItem = useCallback(
    (event: NDKEvent) => {
      switch (event.kind) {
        case NDKKind.Text:
          return <MemoizedTextNote key={event.id} event={event} />;
        case NDKKind.Repost:
          return <MemoizedRepost key={event.id} event={event} />;
        default:
          return <UnknownNote key={event.id} event={event} />;
      }
    },
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={widget.id} title={widget.title} />
      <VList className="flex-1" overscan={2}>
        {status === 'pending' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-neutral-100 px-3 py-3 dark:bg-neutral-900">
              <NoteSkeleton />
            </div>
          </div>
        ) : (
          allEvents.map((item) => renderItem(item))
        )}
        <div className="flex h-16 items-center justify-center px-3 pb-3">
          {hasNextPage ? (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className="inline-flex h-10 w-max items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-medium text-white hover:bg-blue-600 focus:outline-none"
            >
              {isFetchingNextPage ? (
                <LoaderIcon className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ArrowRightCircleIcon className="h-5 w-5" />
                  Load more
                </>
              )}
            </button>
          ) : null}
        </div>
      </VList>
    </WidgetWrapper>
  );
}
