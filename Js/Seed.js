export function createSeededRandom(seed) {
    let state = seed % 2147483647;
    if (state <= 0) state += 2147483646;
  
    function nextFloat() {
      state = (state * 16807) % 2147483647;
      return (state - 1) / 2147483646;
    }
  
    function nextInt(min, max) {
      return Math.floor(nextFloat() * (max - min + 1)) + min;
    }
  
    return { nextFloat, nextInt };
  }
  
  /* Nutzung:
  let rng = createSeededRandom(9876);
  
  console.log(rng.nextFloat());     // z. B. 0.2382...
  console.log(rng.nextInt(1, 100));  // z. B. 7
  console.log(rng.nextInt(1, 100)); // z. B. 145
  */