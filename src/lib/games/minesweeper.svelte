<script lang="ts">
  import { onMount } from 'svelte';

  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  type Cell = {
    mine: boolean;
    revealed: boolean;
    flagged: boolean;
    adjacent: number;
  };

  let board: Cell[][] = $state([]);
  let gameOver = $state(false);
  let gameWon = $state(false);
  let started = $state(false);
  let minesLeft = $state(MINES);
  let time = $state(0);
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  function createBoard(): Cell[][] {
    return Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      }))
    );
  }

  function placeMines(safe: { r: number; c: number }): Cell[][] {
    const b = createBoard();

    let placed = 0;

    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);

      if (!b[r][c].mine && !(r === safe.r && c === safe.c)) {
        b[r][c].mine = true;
        placed++;
      }
    }
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!b[r][c].mine) {
          b[r][c].adjacent = neighbors(r, c).filter(([nr, nc]) => b[nr][nc].mine).length;
        }
      }
    }
    return b;
  }

  function neighbors(r: number, c: number): [number, number][] {
    const result: [number, number][] = [];

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;

        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) result.push([nr, nc]);
      }
    }
    return result;
  }

  function reveal(r: number, c: number) {
    if (board[r][c].revealed || board[r][c].flagged) return;

    board[r][c].revealed = true;

    if (board[r][c].mine) {
      revealAllMines();
      gameOver = true;
      stopTimer();
      return;
    }
    if (board[r][c].adjacent === 0) {
      for (const [nr, nc] of neighbors(r, c)) reveal(nr, nc);
    }
    checkWin();
  }

  function revealAllMines() {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (board[r][c].mine) board[r][c].revealed = true;
  }

  function checkWin() {
    const allSafeRevealed = board.every((row) =>
      row.every((cell) => cell.mine || cell.revealed)
    );

    if (allSafeRevealed) {
      gameWon = true;
      stopTimer();
    }
  }

  function handleClick(r: number, c: number) {
    if (gameOver || gameWon || board[r][c].flagged) return;
    if (!started) {
      board = placeMines({ r, c });
      started = true;
      startTimer();
    }
    
    reveal(r, c);
    board = board;
  }

  function handleRightClick(e: MouseEvent, r: number, c: number) {
    e.preventDefault();

    if (gameOver || gameWon || board[r][c].revealed) return;

    board[r][c].flagged = !board[r][c].flagged;
    minesLeft += board[r][c].flagged ? -1 : 1;
    board = board;
  }

  function startTimer() {
    timerInterval = setInterval(() => time++, 1000);
  }
  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
  }

  function reset() {
    stopTimer();
    board = createBoard();
    gameOver = false;
    gameWon = false;
    started = false;
    minesLeft = MINES;
    time = 0;
  }

  const adjacentColors = [
    '', 'text-blue-500', 'text-green-600', 'text-red-500',
    'text-purple-700', 'text-red-800', 'text-cyan-500',
    'text-black dark:text-white', 'text-slate-500',
  ];

  onMount(() => {
    board = createBoard();
    return () => stopTimer();
  });
</script>

<div class="flex flex-col items-center gap-4 w-full max-w-[480px] mx-auto bg-slate-100 dark:bg-white/5 p-6 rounded-[1.2rem] border border-black/5 dark:border-white/10 shadow-sm dark:shadow-none transition-colors duration-300 select-none">

  <!-- HUD -->
  <div class="flex justify-between items-center w-full font-mono font-bold">
    <div class="flex items-center gap-2 text-lg bg-secondary/50 rounded-md px-3 py-1.5 text-destructive">
      💣 {minesLeft.toString().padStart(3, '0')}
    </div>
    <button
      class="h-9 w-9 flex items-center justify-center text-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-md hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors"
      onclick={reset}
      title="Reiniciar"
    >
      {gameWon ? '😎' : gameOver ? '😵' : '🙂'}
    </button>
    <div class="flex items-center gap-2 text-lg bg-secondary/50 rounded-md px-3 py-1.5 text-muted-foreground">
      ⏱ {time.toString().padStart(3, '0')}
    </div>
  </div>

  <!-- Grid -->
  <div
    class="grid border border-black/10 dark:border-white/10 rounded-md overflow-hidden shadow-inner"
    style="grid-template-columns: repeat({COLS}, 1fr); width: 100%;"
  >
    {#each board as row, r (r)}
      {#each row as cell, c (r + '-' + c)}
        <button
          class="aspect-square flex items-center justify-center text-sm font-extrabold border border-border cursor-pointer transition-colors focus:outline-none focus:z-10 focus:ring-1 focus:ring-primary
            {cell.revealed
              ? cell.mine
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-card text-transparent'
              : 'bg-secondary hover:bg-secondary/80 active:bg-secondary/60'}"
          onclick={() => handleClick(r, c)}
          oncontextmenu={(e) => handleRightClick(e, r, c)}
          aria-label="Célula {r},{c}"
          disabled={gameOver || gameWon}
        >
          {#if cell.revealed && !cell.mine && cell.adjacent > 0}
            <span class={adjacentColors[cell.adjacent]}>{cell.adjacent}</span>
          {:else if cell.revealed && cell.mine}
            💣
          {:else if cell.flagged}
            🚩
          {/if}
        </button>
      {/each}
    {/each}
  </div>

  <!-- Status overlay -->
  {#if gameOver || gameWon}
    <div class="flex flex-col items-center gap-3 animate-[fadeSlideIn_0.4s_ease_both]">
      <p class="text-lg font-extrabold {gameWon ? 'text-emerald-500' : 'text-red-500'}">
        {gameWon ? '🎉 Você venceu!' : '💥 Kaboom! Tente novamente.'}
      </p>
      <button
        class="bg-primary text-primary-foreground px-5 py-2 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer"
        onclick={reset}
      >
        Jogar Novamente
      </button>
    </div>
  {:else}
    <p class="text-xs text-muted-foreground m-0">
      Clique esquerdo para revelar · Clique direito para marcar bandeira
    </p>
  {/if}
</div>
