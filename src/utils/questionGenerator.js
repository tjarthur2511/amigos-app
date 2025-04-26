// src/utils/questionGenerator.js

export function generateAIQuestion() {
    const templates = [
      "What's your favorite way to spend a weekend?",
      "Would you rather explore a new city or relax on a beach?",
      "What's one hobby you'd love to try?",
      "Are you more of a morning or night person?",
      "What's your go-to coffee or tea order?",
      "Do you prefer spontaneous plans or organized events?",
      "What's a skill you're really proud of?",
      "Would you rather hike a mountain or read a book indoors?",
      "What's a dream adventure you want to take?",
      "Are you a bigger fan of concerts or cozy nights in?"
    ];
  
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }
  