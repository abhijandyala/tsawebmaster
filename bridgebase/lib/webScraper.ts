import * as cheerio from 'cheerio';

export interface ScrapedResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

const cache = new Map<string, { data: ScrapedResult[]; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30;

export async function scrapeCharlotteInfo(query: string): Promise<ScrapedResult[]> {
  const cacheKey = query.toLowerCase().trim();
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const results: ScrapedResult[] = [];

  try {
    results.push({
      title: `Search "${query}" on Charlotte Agenda`,
      snippet: `Find local Charlotte guides, reviews, and recommendations about ${query} from Charlotte Agenda.`,
      url: `https://charlotteagenda.com/?s=${encodeURIComponent(query)}`,
      source: 'Charlotte Agenda',
    });

    results.push({
      title: `${query} in Charlotte - Charlotte Magazine`,
      snippet: `Discover the best ${query} options in the Charlotte area with reviews and recommendations.`,
      url: `https://www.charlottemagazine.com/?s=${encodeURIComponent(query)}`,
      source: 'Charlotte Magazine',
    });

  } catch (error) {
    console.error('Error scraping Charlotte info:', error);
  }

  cache.set(cacheKey, { data: results, timestamp: Date.now() });
  return results;
}

export async function fetchAndParsePage(url: string): Promise<{
  title: string;
  content: string;
  links: string[];
} | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CharlotteConnect/1.0)',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    $('script, style, nav, footer, header, aside').remove();

    const title = $('title').text().trim() || $('h1').first().text().trim();
    const content = $('article, main, .content, .post-content')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500);

    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http')) {
        links.push(href);
      }
    });

    return { title, content, links: links.slice(0, 10) };
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export function extractRelevantSnippets(
  content: string,
  queryTerms: string[],
  maxSnippets = 3
): string[] {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const lowerTerms = queryTerms.map(t => t.toLowerCase());

  const scoredSentences = sentences.map(sentence => {
    const lowerSentence = sentence.toLowerCase();
    const score = lowerTerms.reduce((acc, term) => {
      return acc + (lowerSentence.includes(term) ? 1 : 0);
    }, 0);
    return { sentence: sentence.trim(), score };
  });

  return scoredSentences
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSnippets)
    .map(s => s.sentence);
}
