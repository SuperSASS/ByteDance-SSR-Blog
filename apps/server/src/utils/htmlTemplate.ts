export function htmlTemplate(appHtml: string, initialData: any) {
  const initialDataJson = JSON.stringify(initialData).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>SSR Blog</title>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script>window.__INITIAL_DATA__ = ${initialDataJson};</script>
    <script type="module" src="http://localhost:5173/src/entry-client.tsx"></script>
  </body>
</html>`;
}
