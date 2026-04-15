<script lang="ts">
  import { onDestroy } from 'svelte';

  const GRID_SIZE = 15;

  let snake = $state([{ x: 7, y: 7 }]);
  let food = $state({ x: 3, y: 3 });
  let direction = $state({ x: 0, y: -1 });
  let nextDirection = $state({ x: 0, y: -1 });
  let score = $state(0);
  let gameOver = $state(false);
  let isPlaying = $state(false);
  let interval: ReturnType<typeof setInterval>;

  function spawnFood() {
    let newFood: { x: number; y: number };

    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!snake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
        break;
      }
    }
    food = newFood;
  }

  function startGame() {
    snake = [{ x: 7, y: 7 }];
    direction = { x: 0, y: -1 };
    nextDirection = { x: 0, y: -1 };
    score = 0;
    gameOver = false;
    isPlaying = true;
    spawnFood();

    if (interval) clearInterval(interval);

    interval = setInterval(gameLoop, 150);
  }

  function gameLoop() {
    if (!isPlaying || gameOver) return;

    direction = nextDirection;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0) head.x = GRID_SIZE - 1;
    if (head.x >= GRID_SIZE) head.x = 0;
    if (head.y < 0) head.y = GRID_SIZE - 1;
    if (head.y >= GRID_SIZE) head.y = 0;

    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      gameOver = true;
      isPlaying = false;
      clearInterval(interval);
      return;
    }

    snake = [head, ...snake];

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      spawnFood();
    } else {
      snake.pop();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (!isPlaying && e.key === ' ') {
      startGame();
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
        break;
    }
  }

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div 
  class="flex flex-col items-center gap-4 w-full max-w-100 mx-auto bg-slate-100 dark:bg-white/5 p-6 rounded-[1.2rem] border border-black/5 dark:border-white/10 shadow-sm dark:shadow-none focus-visible:outline-4 focus-visible:outline-primary focus-visible:outline-offset-4 focus-visible:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-colors duration-300" 
  tabindex="0" 
  role="application"
  onkeydown={handleKeydown}
  aria-label="Jogo da Cobrinha. Pressione Enter ou Espaço para iniciar, setas para mover."
>
  <div class="flex justify-between items-center w-full">
    <span class="text-xl font-bold text-primary-foreground transition-colors duration-300">🍎 Score: {score}</span>
    {#if !isPlaying}
      <button class="bg-primary text-primary-foreground border-none py-2 px-4 rounded-md font-semibold cursor-pointer transition-colors hover:bg-primary/90" onclick={startGame}>
        {gameOver ? 'Tentar Novamente' : 'Jogar (Space)'}
      </button>
    {/if}
  </div>

  <div class="relative grid w-full aspect-square bg-slate-200 dark:bg-black/40 rounded-md overflow-hidden gap-px border border-black/10 dark:border-white/10 transition-colors duration-300" style="grid-template-columns: repeat({GRID_SIZE}, 1fr); grid-template-rows: repeat({GRID_SIZE}, 1fr);">
    {#each Array(GRID_SIZE * GRID_SIZE), i (i)}
      {@const x = i % GRID_SIZE}
      {@const y = Math.floor(i / GRID_SIZE)}
      {@const isSnakeHead = snake[0].x === x && snake[0].y === y}
      {@const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y)}
      {@const isFood = food.x === x && food.y === y}
      
      <div 
        class="bg-white dark:bg-white/5 rounded-md transition-colors duration-300 {isSnakeHead ? 'bg-blue-600 dark:bg-blue-500 rounded-lg' : ''} {isSnakeBody ? 'bg-blue-400 dark:bg-blue-400 opacity-80 rounded-md' : ''} {isFood ? 'bg-red-500 rounded-full scale-80' : ''}" 
      ></div>
    {/each}

    {#if gameOver}
      <div class="absolute inset-0 bg-white/80 dark:bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm transition-colors duration-300">
        <h2 class="text-red-600 dark:text-red-500 text-3xl m-0 mb-2 transition-colors duration-300">Game Over!</h2>
        <p class="text-slate-800 dark:text-white font-bold transition-colors duration-300">Score: {score}</p>
      </div>
    {/if}
  </div>
  
  <p class="text-sm text-muted-foreground m-0 transition-colors duration-300">Use as setas ou WASD para mover</p>
</div>
