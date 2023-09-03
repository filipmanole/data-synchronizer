export const htmlTextEditor = (file: string) => `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file}</title>
  </head>
  <body>
    <h1>${file}</h1>
    <textarea rows="5" cols="40" placeholder="Enter your text here..."></textarea>
  </body>
</html>
`;