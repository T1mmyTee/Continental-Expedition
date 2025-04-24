export function createSeededRandom(seed) {
    // Initiale Speicherung des Seeds, um ihn später wiederverwenden zu können
    const originalSeed = seed % 2147483647;
    let state = originalSeed <= 0 ? originalSeed + 2147483646 : originalSeed;
  
    // Funktion für nächste zufällige Fließkommazahl
    function nextFloat() {
      state = (state * 16807) % 2147483647;
      return (state - 1) / 2147483646;
    }
  
    // Funktion für nächste zufällige Ganzzahl
    function nextInt(min, max) {
      return Math.floor(nextFloat() * (max - min + 1)) + min;
    }
  
    // Reset-Funktion, um den Zustand auf den ursprünglichen Seed zurückzusetzen
    function reset() {
      state = originalSeed <= 0 ? originalSeed + 2147483646 : originalSeed;
    }
  
    return { nextFloat, nextInt, reset };
}
  /* Nutzung:
  let rng = createSeededRandom(9876);
  
  console.log(rng.nextFloat());     // z. B. 0.2382...
  console.log(rng.nextInt(1, 100));  // z. B. 7
  console.log(rng.nextInt(1, 100)); // z. B. 145
  */