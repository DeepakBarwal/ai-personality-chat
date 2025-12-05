export async function GET() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Documentation - AI Personality Chat</title>
  <meta name="description" content="Interactive API documentation for AI Personality Chat" />
</head>
<body>
  <script
    id="api-reference"
    data-url="/openapi.json"
    data-configuration='${JSON.stringify({
        theme: 'purple',
        layout: 'modern',
        darkMode: true,
        hideDarkModeToggle: false,
        searchHotKey: 'k',
        metaData: {
            title: 'AI Personality Chat API',
            description: 'API for an AI chatbot that learns from conversations',
        },
    })}'
  ></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest"></script>
</body>
</html>`

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html',
        },
    })
}
