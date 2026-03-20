import type { Game, AtBat, Player } from '../types';

export const generateGameSummary = async (
  apiKey: string,
  game: Game,
  roster: Player[],
  atBats: AtBat[]
): Promise<{ summary: string; mvp: string }> => {
  
  if (!apiKey) throw new Error("Anthropic API key is not configured.");

  let promptText = `Please write a 3-4 sentence recap of a softball game against ${game.opponent} on ${new Date(game.date).toLocaleDateString()}. \n`;
  promptText += `The game was played ${game.isHome ? 'at home' : 'away'}.\n\n`;
  promptText += `Here is the chronological play-by-play data:\n`;
  
  const sortedAtBats = [...atBats].sort((a,b) => a.timestamp - b.timestamp);
  for (const ab of sortedAtBats) {
    const p = roster.find(r => r.id === ab.playerId);
    promptText += `- ${p?.name || 'Unknown'} (${p?.position || ''}): ${ab.result}, ${ab.rbi} RBI, Scored Run: ${ab.runScored ? 'Yes' : 'No'}\n`;
  }

  promptText += `\nReturn your response strictly in the following JSON format without any markdown wrappers or backticks:\n`;
  promptText += `{\n  "summary": "Your 3-4 sentence engaging sports summary here. Mention specific players and big hits.",\n  "mvp": "Player Name"\n}`;

  try {
    const response = await fetch('/api/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 300,
        messages: [{ role: 'user', content: promptText }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.content[0].text;
    
    // Parse the JSON block, sometimes models return backticks despite instructions
    const cleanJson = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    
    return {
      summary: parsed.summary,
      mvp: parsed.mvp
    };

  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
