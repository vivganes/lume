import { Link } from 'react-router-dom';

import { useOpenGraph } from '@utils/hooks/useOpenGraph';

function isImage(url: string) {
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif)$/.test(url);
}

export function LinkPreview({ url }: { url: string }) {
  const domain = new URL(url);
  const { status, data } = useOpenGraph(url);

  if (status === 'pending') {
    return (
      <div className="my-2 flex w-full flex-col rounded-lg bg-neutral-100 dark:bg-neutral-900">
        <div className="h-48 w-full animate-pulse bg-neutral-300 dark:bg-neutral-700" />
        <div className="flex flex-col gap-2 px-3 py-3">
          <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
          <span className="mt-2.5 text-sm leading-none text-neutral-600 dark:text-neutral-400">
            {domain.hostname}
          </span>
        </div>
      </div>
    );
  }

  if (!data.title && !data.image) {
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

  return (
    <Link
      to={url}
      target="_blank"
      rel="noreferrer"
      className="my-2 flex w-full flex-col rounded-lg bg-neutral-100 dark:bg-neutral-900"
    >
      {isImage(data.image) ? (
        <img
          src={data.image}
          alt={url}
          className="h-48 w-full rounded-t-lg bg-white object-cover"
        />
      ) : null}
      <div className="flex flex-col items-start px-3 py-3">
        <div className="flex flex-col items-start gap-1 text-left">
          {data.title ? (
            <div className="break-all text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {data.title}
            </div>
          ) : null}
          {data.description ? (
            <div className="mb-2 line-clamp-3 break-all text-sm text-neutral-700 dark:text-neutral-400">
              {data.description}
            </div>
          ) : null}
        </div>
        <div className="break-all text-sm text-neutral-600 dark:text-neutral-400">
          {domain.hostname}
        </div>
      </div>
    </Link>
  );
}
