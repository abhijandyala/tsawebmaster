export interface ReviewHighlight {
  text: string;
  rating: number;
  authorName: string;
  matchedTerms: string[];
}

export function extractRelevantReviews(
  reviews: Array<{
    text: string;
    rating: number;
    authorName: string;
  }>,
  queryTerms: string[]
): ReviewHighlight[] {
  if (!queryTerms.length || !reviews.length) return [];

  const normalizedTerms = queryTerms.map(t => t.toLowerCase());
  
  const relevantReviews = reviews
    .map(review => {
      const lowerText = review.text.toLowerCase();
      const matchedTerms = normalizedTerms.filter(term => lowerText.includes(term));
      
      return {
        ...review,
        matchedTerms,
        relevanceScore: matchedTerms.length,
      };
    })
    .filter(r => r.relevanceScore > 0 || r.rating >= 4)
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return b.rating - a.rating;
    })
    .slice(0, 3);

  return relevantReviews.map(review => ({
    text: extractSnippet(review.text, review.matchedTerms),
    rating: review.rating,
    authorName: review.authorName,
    matchedTerms: review.matchedTerms,
  }));
}

function extractSnippet(text: string, matchedTerms: string[], maxLength = 150): string {
  if (text.length <= maxLength) return text;
  
  if (matchedTerms.length === 0) {
    return text.slice(0, maxLength).trim() + '...';
  }
  
  const lowerText = text.toLowerCase();
  let bestStart = 0;
  
  for (const term of matchedTerms) {
    const index = lowerText.indexOf(term.toLowerCase());
    if (index !== -1) {
      bestStart = Math.max(0, index - 30);
      break;
    }
  }
  
  let snippet = text.slice(bestStart, bestStart + maxLength);
  
  if (bestStart > 0) {
    const firstSpace = snippet.indexOf(' ');
    if (firstSpace > 0 && firstSpace < 20) {
      snippet = '...' + snippet.slice(firstSpace + 1);
    }
  }
  
  if (bestStart + maxLength < text.length) {
    const lastSpace = snippet.lastIndexOf(' ');
    if (lastSpace > maxLength - 20) {
      snippet = snippet.slice(0, lastSpace) + '...';
    } else {
      snippet = snippet.trim() + '...';
    }
  }
  
  return snippet;
}

export function highlightTermsInText(text: string, terms: string[]): string {
  if (!terms.length) return text;
  
  let highlighted = text;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });
  
  return highlighted;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function summarizeReviews(reviews: Array<{ rating: number; text: string }>): {
  averageRating: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  topThemes: string[];
} {
  if (!reviews.length) {
    return { averageRating: 0, sentiment: 'neutral', topThemes: [] };
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (avgRating >= 4) sentiment = 'positive';
  else if (avgRating < 3) sentiment = 'negative';

  const positiveWords = ['great', 'excellent', 'amazing', 'wonderful', 'helpful', 'friendly', 'clean', 'fast', 'delicious', 'fresh'];
  const negativeWords = ['bad', 'terrible', 'awful', 'slow', 'rude', 'dirty', 'cold', 'expensive', 'disappointing'];
  
  const themeCounts: Record<string, number> = {};
  
  reviews.forEach(review => {
    const lowerText = review.text.toLowerCase();
    [...positiveWords, ...negativeWords].forEach(word => {
      if (lowerText.includes(word)) {
        themeCounts[word] = (themeCounts[word] || 0) + 1;
      }
    });
  });
  
  const topThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme]) => theme);

  return { averageRating: Math.round(avgRating * 10) / 10, sentiment, topThemes };
}
