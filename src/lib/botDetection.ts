const BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /applebot/i,
  /gptbot/i,
  /claude-web/i,
  /claudebot/i,
  /anthropic/i,
  /perplexitybot/i,
  /perplexity/i,
  /chatgpt-user/i,
  /oai-searchbot/i,
  /cohere-ai/i,
  /meta-externalagent/i,
  /ia_archiver/i,
  /ahrefsbot/i,
  /semrushbot/i,
  /mj12bot/i,
  /dotbot/i,
  /rogerbot/i,
  /exabot/i,
  /bot\b/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /phantomjs/i,
  /prerender/i,
];

const PREVIEW_HOST_PATTERNS = [
  /localhost/i,
  /127\.0\.0\.1/,
  /\.local$/i,
  /\.webcontainer\.io$/i,
  /\.stackblitz\.io$/i,
  /\.bolt\.new$/i,
  /\.bolt\.host$/i,
];

function isPreviewEnvironment(): boolean {
  if (typeof window === 'undefined' || !window.location) return false;
  const host = window.location.hostname || '';
  return PREVIEW_HOST_PATTERNS.some((p) => p.test(host));
}

export function isBot(userAgent?: string): boolean {
  if (isPreviewEnvironment()) return false;
  const ua = userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  if (!ua) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(ua));
}

export const IS_BOT = isBot();
