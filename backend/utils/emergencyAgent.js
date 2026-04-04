function detectEmergency(text) {
  const criticalKeywords = [
    "chest pain",
    "can't breathe",
    "breathing difficulty",
    "unconscious",
    "severe bleeding",
    "heart attack"
  ];

  const lowerText = text.toLowerCase();

  return criticalKeywords.some(keyword => lowerText.includes(keyword));
}

module.exports = { detectEmergency };