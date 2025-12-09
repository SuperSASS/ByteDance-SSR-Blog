import React, { useEffect, useState } from 'react';
import rehypeSanitize from 'rehype-sanitize';
import type { MDEditorProps } from '@uiw/react-md-editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (value?: string) => void;
  height?: number;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  height = 400,
}) => {
  const [Editor, setEditor] =
    useState<React.ComponentType<MDEditorProps> | null>(null);

  useEffect(() => {
    import('@uiw/react-md-editor').then((mod) => {
      setEditor(() => mod.default);
    });
  }, []);

  if (!Editor) {
    return (
      <div
        style={{ height }}
        className="w-full border rounded-md bg-muted/20 animate-pulse"
      />
    );
  }

  return (
    <div className="w-full" data-color-mode="light">
      <Editor
        value={value}
        onChange={onChange}
        height={height}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
};
