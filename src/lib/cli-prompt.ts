interface CliPromptParams {
  token: string;
  chapterId: string;
  eventId: string;
  baseUrl: string;
}

export function buildCliPrompt({ token, chapterId, eventId, baseUrl }: CliPromptParams): string {
  return `Submit my project to Shiphaus.

Token: ${token}
API: ${baseUrl}/api/cli/submit
Upload: ${baseUrl}/api/cli/upload
Chapter: ${chapterId}
Event: ${eventId}

Ask me for:
1. Project name (required, 3-100 chars)
2. Short description of what I built (required, 10-500 chars)
3. Live URL where it's deployed (required)
4. GitHub repo URL (optional)
5. Screenshot file path (optional)

If I give a screenshot path, upload it first:
curl -s -X POST ${baseUrl}/api/cli/upload -H "Authorization: Bearer ${token}" -F "file=@{path}"
Parse the "url" field from the JSON response.

Then submit everything:
curl -s -X POST ${baseUrl}/api/cli/submit -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d '{"title":"...","description":"...","deployedUrl":"...","githubUrl":"...","screenshotUrl":"...","chapterId":"${chapterId}","eventId":"${eventId}"}'

Show me the result and the link to my project.`;
}
