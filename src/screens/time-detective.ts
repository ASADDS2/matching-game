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

  const isMobile = window.innerWidth <= 480;

  const content = document.createElement('div');
  content.style.width = '100%';
  content.style.maxWidth = isMobile ? '100%' : '800px';
  content.style.margin = '0.5rem auto 0 auto';
  content.style.animation = 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
  content.style.position = 'relative';
  content.style.zIndex = '5';
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.gap = isMobile ? '0.75rem' : '1.5rem';

  // Game UI Header
  content.innerHTML = `
    <div class="game-screen-header" style="display: flex; align-items: center; justify-content: space-between;">
      <button id="btn-back" class="btn-premium btn-secondary" style="padding: 0.4rem 0.8rem; font-size: ${isMobile ? '0.8rem' : '0.9rem'}; flex-shrink: 0;">
        ← Volver
      </button>
      <div style="text-align: center; flex: 1; padding: 0 0.5rem;">
        <h1 class="gradient-text" style="font-size: clamp(1.1rem, 5vw, 1.8rem); font-weight: 800; margin: 0; font-family: var(--font-display);">Time Detective</h1>
        <div style="font-size: clamp(0.65rem, 2.5vw, 0.8rem); color: var(--color-text-muted); text-align: center;">Simple Past vs. Present Perfect</div>
      </div>
      <div id="timer-target" style="width: ${isMobile ? '44px' : '60px'}; height: ${isMobile ? '44px' : '60px'}; flex-shrink: 0;"></div>
    </div>

    <!-- Match Status -->
    <div class="glass-panel" style="padding: ${isMobile ? '0.65rem 0.75rem' : '1rem'}; display: flex; justify-content: space-around; align-items: center; border-radius: var(--radius-md);">
      <div>
        <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Casos Resueltos</span>
        <div id="progress-counter" style="font-size: ${isMobile ? '1.15rem' : '1.4rem'}; font-weight: 800; font-family: var(--font-display);">0 / 8</div>
      </div>
      <div style="width: 1px; height: 30px; background: var(--color-border);"></div>
      <div>
        <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Pistas Falsas (Errores)</span>
        <div id="mistakes-counter" style="font-size: ${isMobile ? '1.15rem' : '1.4rem'}; font-weight: 800; color: var(--color-danger); font-family: var(--font-display);">0</div>
      </div>
    </div>

    <!-- Current Case Sentence Card -->
    <div class="glass-panel" id="case-card" style="padding: ${isMobile ? '1.25rem 1rem' : '2.25rem 1.5rem'}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.85rem; border-radius: var(--radius-lg); min-height: ${isMobile ? '130px' : '180px'}; position: relative; border: 2px solid var(--color-primary); box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);">
      <div style="position: absolute; top: 10px; left: 12px; font-size: 0.65rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase; letter-spacing: 1px;">
        🔍 Evidencia Analizada
      </div>
      
      <div id="sentence-text" style="font-family: var(--font-display); font-size: clamp(0.95rem, 4vw, 1.35rem); font-weight: 700; text-align: center; color: var(--color-text); line-height: 1.4; max-width: 92%;">
        ...
      </div>
      
      <div id="difficulty-badge" style="font-size: 0.65rem; font-weight: 700; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: var(--color-amber); padding: 0.15rem 0.5rem; border-radius: 12px;">
        Dificultad: ★☆☆
      </div>
    </div>

    <!-- Classification Boards / Targets -->
    <div class="folders-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: ${isMobile ? '0.6rem' : '1.25rem'}; width: 100%;">
      <!-- Simple Past Target Folder -->
      <div id="folder-past" class="glass-panel folder-target" style="padding: ${isMobile ? '1rem 0.5rem' : '1.5rem'}; border-radius: var(--radius-lg); text-align: center; cursor: pointer; border: 1.5px dashed var(--color-border); transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;">
        <div style="font-size: ${isMobile ? '2.2rem' : '3rem'}; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); transition: transform 0.2s;">📁</div>
        <h4 style="font-family: var(--font-display); font-weight: 800; font-size: clamp(0.8rem, 3vw, 1.1rem); margin: 0; color: var(--color-text);">Simple Past</h4>
        <div style="font-size: clamp(0.6rem, 2vw, 0.72rem); color: var(--color-text-muted); font-weight: 500; line-height: 1.3;">
          Acciones terminadas en tiempo específico.<br>
          <em>(yesterday, ago, last week)</em>
        </div>
      </div>

      <!-- Present Perfect Target Folder -->
      <div id="folder-perfect" class="glass-panel folder-target" style="padding: ${isMobile ? '1rem 0.5rem' : '1.5rem'}; border-radius: var(--radius-lg); text-align: center; cursor: pointer; border: 1.5px dashed var(--color-border); transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;">
        <div style="font-size: ${isMobile ? '2.2rem' : '3rem'}; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); transition: transform 0.2s;">🗂️</div>
        <h4 style="font-family: var(--font-display); font-weight: 800; font-size: clamp(0.8rem, 3vw, 1.1rem); margin: 0; color: var(--color-text);">Present Perfect</h4>
        <div style="font-size: clamp(0.6rem, 2vw, 0.72rem); color: var(--color-text-muted); font-weight: 500; line-height: 1.3;">
          Experiencias, tiempo no específico o conecta al presente.<br>
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

