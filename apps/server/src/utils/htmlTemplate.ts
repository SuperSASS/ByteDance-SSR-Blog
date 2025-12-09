/**
 * 生成 HTML 模板
 * @param appHtml - SSR 渲染的应用 HTML
 * @param styles - CSS 文件路径数组（仅生产模式）
 * @param scripts - JS 文件路径数组（仅生产模式）
 */
export function htmlTemplate(
  appHtml: string,
  styles: string[] = [],
  scripts: string[] = []
) {
  const styleTags = styles
    .map((style) => `<link rel="stylesheet" href="${style}" />`)
    .join('\n    ');

  const scriptTags = scripts
    .map(
      (script) => `<script type="module" crossorigin src="${script}"></script>`
    )
    .join('\n    ');

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>SSR Blog</title>
    ${styleTags}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    ${scriptTags}
  </body>
</html>`;
}
