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
  /\bai\b/i,
  /scraper/i,
  /fetch/i,
  /headlesschrome/i,
  /phantomjs/i,
  /prerender/i,
];

export function isBot(userAgent?: string): boolean {
  const ua = userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  if (!ua) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(ua));
}

export const IS_BOT = isBot();
