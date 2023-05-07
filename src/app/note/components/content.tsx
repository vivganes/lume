import ImagePreview from '@lume/app/note/components/preview/image';
import VideoPreview from '@lume/app/note/components/preview/video';
import { NoteMentionUser } from '@lume/app/note/components/user/mention';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const NoteContent = ({ content }: { content: any }) => {
  return (
    <>
      <ReactMarkdown
        remarkPlugins={[[remarkGfm]]}
        linkTarget="_blank"
        className="prose prose-zinc max-w-none select-text break-words dark:prose-invert prose-p:text-[15px] prose-p:leading-tight prose-a:text-[15px] prose-a:leading-tight prose-a:text-fuchsia-500 prose-a:no-underline hover:prose-a:text-fuchsia-600 hover:prose-a:underline prose-ol:mb-1 prose-ul:mb-1 prose-li:text-[15px] prose-li:leading-tight"
        components={{
          em: ({ ...props }) => <NoteMentionUser {...props} />,
        }}
      >
        {content.parsed}
      </ReactMarkdown>
      {Array.isArray(content.images) && content.images.length ? <ImagePreview urls={content.images} /> : <></>}
      {Array.isArray(content.videos) && content.videos.length ? <VideoPreview urls={content.videos} /> : <></>}
    </>
  );
};
