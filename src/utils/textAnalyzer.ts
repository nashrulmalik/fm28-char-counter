export interface TextAnalysis {
  characterCount: number;
  wordCount: number;
  sentenceCount: number;
  readingTime: string;
  letterDensity: { [key: string]: { count: number; percentage: number } };
}

export function analyzeText(text: string, excludeSpaces: boolean = false): TextAnalysis {
  const cleanText = text.trim();
  
  // Character count
  const characterCount = excludeSpaces ? cleanText.replace(/\s/g, '').length : cleanText.length;
  
  // Word count
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Sentence count
  const sentences = cleanText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // Reading time (assuming average reading speed of 200 words per minute)
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const readingTime = `~${readingTimeMinutes} minute${readingTimeMinutes > 1 ? 's' : ''}`;
  
  // Letter density
  const letterCount: { [key: string]: number } = {};
  const letters = cleanText.toLowerCase().replace(/[^a-z]/g, '');
  
  for (const letter of letters) {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  }
  
  // Convert to percentages and create combined object
  const letterDensity: { [key: string]: { count: number; percentage: number } } = {};
  const totalLetters = letters.length;
  
  for (const [letter, count] of Object.entries(letterCount)) {
    letterDensity[letter] = {
      count,
      percentage: Number(((count / totalLetters) * 100).toFixed(2))
    };
  }
  
  return {
    characterCount,
    wordCount,
    sentenceCount,
    readingTime,
    letterDensity
  };
}
