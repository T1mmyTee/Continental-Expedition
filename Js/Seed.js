export function seededRandom(seed, x, y, z, min = 0, max = 1) {
    // Kombiniere Seed und Koordinaten zu einer Zahl
    const combinedSeed = (x * 73856093) ^ (y * 19349663) ^ (z * 98374673) ^ seed;
  
    // Mulberry32 PRNG
    function mulberry32(a) {
      return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
  
    const rand = mulberry32(combinedSeed);
    const value = rand();
  
    // Skaliere auf gewünschten Bereich
    return Math.floor(value * (max - min + 1)) + min;
  }