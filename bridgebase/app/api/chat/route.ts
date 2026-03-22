import { NextResponse } from 'next/server';
import { resources } from '@/data/resources';

const catalog = resources.map((r) => ({
  id: r.id,
  name: r.name,
  category: r.category,
  description: r.description.slice(0, 400),
  city: r.city,
}));

function keywordMatch(query: string) {
  const q = query.toLowerCase();
  const scored = resources.map((r) => {
    let s = 0;
    if (r.name.toLowerCase().includes(q)) s += 5;
    if (r.description.toLowerCase().includes(q)) s += 2;
    if (r.category.toLowerCase().includes(q)) s += 3;
    r.tags.forEach((t) => {
      if (t.toLowerCase().includes(q)) s += 1;
    });
    return { r, s };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored.filter((x) => x.s > 0).slice(0, 5).map((x) => x.r);
}

export async function POST(req: Request) {
  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const message = (body.message || '').trim();
  if (!message || message.length > 2000) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 });
  }

  const key = process.env.OPENAI_API_KEY;
  if (key) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You help Charlotte NC residents find community resources. Here is JSON of available resources (id, name, category, description, city):
${JSON.stringify(catalog)}
Reply concisely. Suggest up to 3 resources by name and id if they fit. If nothing fits, say no strong match and suggest submitting a resource request.`,
            },
            { role: 'user', content: message },
          ],
          max_tokens: 500,
        }),
      });
      if (!res.ok) throw new Error('OpenAI error');
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data.choices?.[0]?.message?.content || 'No response.';
      return NextResponse.json({ reply: text });
    } catch {
      /* fall through */
    }
  }

  const matches = keywordMatch(message);
  if (matches.length === 0) {
    return NextResponse.json({
      reply:
        'I could not find a strong match in our community hub yet. Try browsing the Resource hub or submit a request so we can add it.',
    });
  }
  const lines = matches.map((r) => `• **${r.name}** (${r.category}) — /resource/${r.id}`).join('\n');
  return NextResponse.json({
    reply: `Here are some resources that might help:\n${lines}\n\nOpen any card in the hub for full details and the map.`,
  });
}
