<script lang="ts">
  import { onMount } from 'svelte';
  
  const emojis = ['🚀', '🎮', '🧩', '🌟', '🔮', '🎲', '⚡', '🤖'];
  
  type Card = { id: number; symbol: string; flipped: boolean; matched: boolean };
  
  let cards: Card[] = $state([]);
  let flippedIndices: number[] = $state([]);
  let moves = $state(0);
  let matches = $state(0);
  let gameWon = $state(false);
  let isChecking = $state(false);

  function initGame() {
    const symbols = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

    cards = symbols.map((symbol, index) => ({
      id: index,
      symbol,
      flipped: false,
      matched: false
    }));
    flippedIndices = [];
    moves = 0;
    matches = 0;
    gameWon = false;
    isChecking = false;
  }

  function flipCard(index: number) {
    if (isChecking || cards[index].flipped || cards[index].matched) return;

    cards[index].flipped = true;
    flippedIndices = [...flippedIndices, index];

    if (flippedIndices.length === 2) {
      moves++;
      isChecking = true;

      const [first, second] = flippedIndices;
      
      if (cards[first].symbol === cards[second].symbol) {
        cards[first].matched = true;
        cards[second].matched = true;
        matches++;
        flippedIndices = [];
        isChecking = false;

        if (matches === emojis.length) gameWon = true;
      } else {
        setTimeout(() => {
          cards[first].flipped = false;
          cards[second].flipped = false;
          cards = [...cards];
          flippedIndices = [];
          isChecking = false;
        }, 800);
      }
    }
  }

  onMount(initGame);
</script>

<div class="flex flex-col gap-6 w-full max-w-[480px] mx-auto bg-card p-6 rounded-md border border-border shadow-sm transition-colors duration-300">
  <div class="flex justify-between items-center">
    <div class="flex gap-4 text-base text-foreground font-semibold transition-colors duration-300">
      <span>Movimentos: {moves}</span>
      <span>Pares: {matches}/{emojis.length}</span>
    </div>
    <button class="bg-secondary text-secondary-foreground border border-border py-1.5 px-3 rounded-md text-sm font-semibold cursor-pointer transition-colors hover:bg-secondary/80" onclick={initGame}>Reiniciar</button>
  </div>

  <div class="grid grid-cols-4 gap-2 [perspective:1000px]">
    {#each cards as card, index}
      <button 
        class="group bg-transparent border-none p-0 aspect-square cursor-pointer [perspective:1000px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:rounded-md disabled:cursor-default"
        onclick={() => flipCard(index)}
        aria-label="Card {index}"
        disabled={card.flipped || card.matched}
      >
        <div class="relative w-full h-full text-center transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] {card.flipped || card.matched ? '[transform:rotateY(180deg)]' : ''}">
          <div class="absolute inset-0 backface-hidden rounded-md flex items-center justify-center shadow-sm bg-secondary border border-border transition-colors duration-300">
            <span class="text-2xl text-muted-foreground font-extrabold transition-colors duration-300">?</span>
          </div>
          <div class="absolute inset-0 backface-hidden rounded-md flex items-center justify-center shadow-sm border border-border transform-[rotateY(180deg)] text-3xl {card.matched ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 animate-pulse' : 'bg-primary/10 text-primary'} transition-colors duration-300">
            {card.symbol}
          </div>
        </div>
      </button>
    {/each}
  </div>

  {#if gameWon}
    <div class="text-center p-4 animate-[fadeIn_0.5s_ease]">
      <h2 class="text-emerald-600 dark:text-emerald-500 m-0 mb-2 transition-colors duration-300">🎉 Você Venceu!</h2>
      <p class="text-muted-foreground m-0 transition-colors duration-300">Terminou em {moves} movimentos.</p>
      <button class="bg-primary text-primary-foreground border border-primary text-base py-2.5 px-5 mt-4 rounded-md font-semibold cursor-pointer hover:bg-primary/90" onclick={initGame}>Jogar Novamente</button>
    </div>
  {/if}
</div>
