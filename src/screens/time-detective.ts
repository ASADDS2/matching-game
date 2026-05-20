import { TimerComponent } from '../components/timer';
import { TimeSentences } from '../game-data';
import { playCorrectSound, playWrongSound } from '../components/audio';
import { getState, setState, completeGame } from '../state';

export function renderTimeDetective(
  container: HTMLElement,
  navigate: (screen: 'home' | 'select' | 'game' | 'results', modeIndex?: 0 | 1 | 2 | 3 | 4) => void
) {
  // Clear container
  container.innerHTML = '';

  // Background blobs
  const blob1 = document.createElement('div');
  blob1.className = 'bg-blob bg-blob-1';
  container.appendChild(blob1);

  const blob2 = document.createElement('div');
  blob2.className = 'bg-blob bg-blob-2';
  container.appendChild(blob2);

  const content = document.createElement('div');
  content.className = 'screen-content';

  // Game UI Header
  content.innerHTML = `
    <div class="game-header">
      <button id="btn-back" class="btn-premium btn-secondary game-header__back">
        ← Volver
      </button>
      <div class="game-header__title-block">
        <h1 class="gradient-text game-header__title">Time Detective</h1>
        <div class="game-header__subtitle">Simple Past vs. Present Perfect</div>
      </div>
      <div id="timer-target" class="game-header__timer"></div>
    </div>

    <!-- Match Status -->
    <div class="glass-panel stats-row">
      <div>
        <span class="stats-row__label">Cases Solved</span>
        <div id="progress-counter" class="stats-row__value">0 / 8</div>
      </div>
      <div class="stats-row__divider"></div>
      <div>
        <span class="stats-row__label">Wrong Clues (Mistakes)</span>
        <div id="mistakes-counter" class="stats-row__value" style="color: var(--color-danger);">0</div>
      </div>
    </div>

    <!-- Current Case Sentence Card -->
    <div class="glass-panel case-card" id="case-card">
      <div class="case-card__label">
        🔍 Evidence under review
      </div>
      
      <div id="sentence-text" class="case-card__sentence">
        ...
      </div>
      
      <div id="difficulty-badge" style="font-size: 0.65rem; font-weight: 700; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: var(--color-amber); padding: 0.15rem 0.5rem; border-radius: 12px;">
        Dificultad: ★☆☆
      </div>
    </div>

    <!-- Classification Boards / Targets -->
    <div class="folders-grid">
      <!-- Simple Past Target Folder -->
      <div id="folder-past" class="glass-panel folder-target">
        <div class="folder-target__emoji">📁</div>
        <h4 class="folder-target__title">Simple Past</h4>
        <div class="folder-target__hint">
          Finished actions at a specific time.<br>
          <em>(yesterday, ago, last week)</em>
        </div>
      </div>

      <!-- Present Perfect Target Folder -->
      <div id="folder-perfect" class="glass-panel folder-target">
        <div class="folder-target__emoji">🗂️</div>
        <h4 class="folder-target__title">Present Perfect</h4>
        <div class="folder-target__hint">
          Experiences, unspecified time or connection to the present.<br>
          <em>(already, never, yet, for/since)</em>
        </div>
      </div>
    </div>
  `;

  container.appendChild(content);

  // Initialize and start timer
  const timerTarget = content.querySelector('#timer-target') as HTMLElement;
  const timer = new TimerComponent(timerTarget, 60);
  timer.start();

  // Shuffle sentences and select 8
  const selectedCases = [...TimeSentences].sort(() => 0.5 - Math.random()).slice(0, 8);

  let currentIdx = 0;
  let mistakesCount = 0;
  let isSorting = false;

  const caseCard = content.querySelector('#case-card') as HTMLElement;
  const sentenceText = content.querySelector('#sentence-text') as HTMLElement;
  const difficultyBadge = content.querySelector('#difficulty-badge') as HTMLElement;
  const progressCounter = content.querySelector('#progress-counter') as HTMLElement;
  const mistakesCounter = content.querySelector('#mistakes-counter') as HTMLElement;

  const folderPast = content.querySelector('#folder-past') as HTMLElement;
  const folderPerfect = content.querySelector('#folder-perfect') as HTMLElement;

  function loadCase() {
    if (currentIdx >= selectedCases.length) {
      victory();
      return;
    }

    isSorting = false;
    const c = selectedCases[currentIdx];

    progressCounter.textContent = `${currentIdx} / 8`;
    sentenceText.textContent = `"${c.sentence}"`;

    // Stars indicator for difficulty
    const stars = '★'.repeat(c.difficulty) + '☆'.repeat(3 - c.difficulty);
    difficultyBadge.textContent = `Dificultad: ${stars}`;
    
    // Color style for difficulty badge
    if (c.difficulty === 1) {
      difficultyBadge.style.color = 'var(--color-success)';
      difficultyBadge.style.background = 'rgba(16, 185, 129, 0.1)';
      difficultyBadge.style.borderColor = 'rgba(16, 185, 129, 0.2)';
    } else if (c.difficulty === 2) {
      difficultyBadge.style.color = 'var(--color-amber)';
      difficultyBadge.style.background = 'rgba(245, 158, 11, 0.1)';
      difficultyBadge.style.borderColor = 'rgba(245, 158, 11, 0.2)';
    } else {
      difficultyBadge.style.color = 'var(--color-danger)';
      difficultyBadge.style.background = 'rgba(239, 68, 68, 0.1)';
      difficultyBadge.style.borderColor = 'rgba(239, 68, 68, 0.2)';
    }

    // Reset layout border styling
    caseCard.style.borderColor = 'var(--color-primary)';
    caseCard.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.15)';
  }

  function handleFolderSelection(tense: 'simple_past' | 'present_perfect', targetFolder: HTMLElement) {
    if (isSorting) return;
    isSorting = true;

    const c = selectedCases[currentIdx];
    const isCorrect = tense === c.tense;

    const folderEmoji = targetFolder.querySelector('div') as HTMLElement;

    if (isCorrect) {
      // Correct sorting!
      playCorrectSound();
      
      // Visual feedback: flash card green
      caseCard.style.borderColor = 'var(--color-success)';
      caseCard.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.25)';
      
      // Push emoji zoom
      folderEmoji.style.transform = 'scale(1.3) translateY(-5px)';
      targetFolder.style.borderColor = 'var(--color-success)';
      targetFolder.style.background = 'rgba(16, 185, 129, 0.05)';

      const session = { ...getState().sessionStats };
      session.correct++;
      setState({ sessionStats: session });

      currentIdx++;
      setTimeout(() => {
        folderEmoji.style.transform = 'scale(1) translateY(0)';
        targetFolder.style.borderColor = 'var(--color-border)';
        targetFolder.style.background = 'transparent';
        loadCase();
      }, 1000);
    } else {
      // Incorrect sorting
      playWrongSound();
      
      // Shake case card and flash red
      caseCard.style.borderColor = 'var(--color-danger)';
      caseCard.style.boxShadow = '0 8px 32px rgba(239, 68, 68, 0.25)';
      caseCard.animate([
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0)' }
      ], { duration: 400 });

      // Flash target folder red
      targetFolder.style.borderColor = 'var(--color-danger)';
      targetFolder.style.background = 'rgba(239, 68, 68, 0.05)';

      mistakesCount++;
      mistakesCounter.textContent = mistakesCount.toString();

      // Add to mistakes queue
      const currentQueue = [...getState().reviewQueue];
      if (!currentQueue.includes(c.id)) {
        currentQueue.push(c.id);
        setState({ reviewQueue: currentQueue });
      }

      const session = { ...getState().sessionStats };
      session.wrong++;
      setState({ sessionStats: session });

      // Show correct folder indication after shake
      const correctFolder = c.tense === 'simple_past' ? folderPast : folderPerfect;
      setTimeout(() => {
        correctFolder.style.borderColor = 'var(--color-success)';
        correctFolder.style.background = 'rgba(16, 185, 129, 0.05)';
      }, 500);

      currentIdx++;
      setTimeout(() => {
        targetFolder.style.borderColor = 'var(--color-border)';
        targetFolder.style.background = 'transparent';
        correctFolder.style.borderColor = 'var(--color-border)';
        correctFolder.style.background = 'transparent';
        loadCase();
      }, 1800);
    }
  }

  function victory() {
    timer.stop();
    const remainingTime = timer.getRemainingSeconds();
    const timeTaken = 60 - remainingTime;

    let stars: 0 | 1 | 2 | 3 = 1;
    if (mistakesCount === 0 && remainingTime >= 25) {
      stars = 3;
    } else if (mistakesCount <= 2 && remainingTime >= 10) {
      stars = 2;
    }

    const score = Math.max(50, 600 + (remainingTime * 10) - (mistakesCount * 45));

    completeGame(4, score, stars, timeTaken);

    setTimeout(() => {
      navigate('results');
    }, 800);
  }

  folderPast.addEventListener('click', () => handleFolderSelection('simple_past', folderPast));
  folderPerfect.addEventListener('click', () => handleFolderSelection('present_perfect', folderPerfect));

  const btnBack = content.querySelector('#btn-back');
  btnBack?.addEventListener('click', () => {
    timer.stop();
    navigate('select');
  });

  container.addEventListener('timer:expired', () => {
    const timeTaken = 60;
    const score = Math.max(20, currentIdx * 70 - mistakesCount * 15);
    completeGame(4, score, 0, timeTaken);
    navigate('results');
  });

  // Start sorting cases
  loadCase();
}

