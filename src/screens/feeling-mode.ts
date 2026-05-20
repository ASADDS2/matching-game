import { TimerComponent } from '../components/timer';
import { AdjPairs } from '../game-data';
import { playCorrectSound, playWrongSound } from '../components/audio';
import { getState, setState, completeGame } from '../state';

export function renderFeelingMode(
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
  content.style.maxWidth = isMobile ? '100%' : '600px';
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
        <h1 class="gradient-text" style="font-size: clamp(1.1rem, 5vw, 1.8rem); font-weight: 800; margin: 0; font-family: var(--font-display);">Feeling vs. Thing</h1>
        <div style="font-size: clamp(0.65rem, 2.5vw, 0.8rem); color: var(--color-text-muted); text-align: center;">Adjectives (-ed vs. -ing)</div>
      </div>
      <div id="timer-target" style="width: ${isMobile ? '44px' : '60px'}; height: ${isMobile ? '44px' : '60px'}; flex-shrink: 0;"></div>
    </div>

    <!-- Main Quiz Card -->
    <div class="glass-panel quiz-card" id="quiz-card" style="padding: ${isMobile ? '1.25rem' : '2rem'}; display: flex; flex-direction: column; gap: 1rem; border-radius: var(--radius-lg); position: relative; overflow: hidden; min-height: ${isMobile ? '180px' : '250px'}; justify-content: center; align-items: center;">
      <!-- Question progress badge -->
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: var(--color-primary); padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;" id="progress-badge">
        Question 1 / 6
      </div>

      <!-- Sentence -->
      <div id="quiz-sentence" class="quiz-sentence" style="font-family: var(--font-display); font-size: clamp(1rem, 4vw, 1.5rem); font-weight: 700; color: var(--color-text); text-align: center; max-width: 95%; line-height: 1.4;">
        ...
      </div>

      <!-- Subject Tip Tag -->
      <div id="subject-tip" style="font-size: clamp(0.65rem, 2vw, 0.75rem); color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        Tip: ...
      </div>
    </div>

    <!-- Options Group -->
    <div class="answer-buttons-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: ${isMobile ? '0.6rem' : '1rem'}; width: 100%;">
      <button id="btn-opt-ed" class="btn-premium btn-secondary" style="padding: ${isMobile ? '1rem 0.5rem' : '1.5rem 1rem'}; font-size: ${isMobile ? '1rem' : '1.15rem'}; font-weight: 700; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
        <span id="opt-ed-text">-ed</span>
        <span style="font-size: 0.65rem; opacity: 0.7; font-weight: 500;">(Feeling / Emotion)</span>
      </button>
      <button id="btn-opt-ing" class="btn-premium btn-secondary" style="padding: ${isMobile ? '1rem 0.5rem' : '1.5rem 1rem'}; font-size: ${isMobile ? '1rem' : '1.15rem'}; font-weight: 700; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
        <span id="opt-ing-text">-ing</span>
        <span style="font-size: 0.65rem; opacity: 0.7; font-weight: 500;">(Description / Cause)</span>
      </button>
    </div>
  `;

  container.appendChild(content);

  // Initialize and start timer
  const timerTarget = content.querySelector('#timer-target') as HTMLElement;
  const timer = new TimerComponent(timerTarget, 60);
  timer.start();

  // Shuffle & select 6 adjective pair questions
  const selectedQuestions = [...AdjPairs].sort(() => 0.5 - Math.random()).slice(0, 6);

  let currentIdx = 0;
  let mistakesCount = 0;
  let isAnswering = false;

  const quizCard = content.querySelector('#quiz-card') as HTMLElement;
  const progressBadge = content.querySelector('#progress-badge') as HTMLElement;
  const quizSentence = content.querySelector('#quiz-sentence') as HTMLElement;
  const subjectTip = content.querySelector('#subject-tip') as HTMLElement;

  const btnEd = content.querySelector('#btn-opt-ed') as HTMLButtonElement;
  const btnIng = content.querySelector('#btn-opt-ing') as HTMLButtonElement;
  const edText = content.querySelector('#opt-ed-text') as HTMLElement;
  const ingText = content.querySelector('#opt-ing-text') as HTMLElement;

  function loadQuestion() {
    if (currentIdx >= selectedQuestions.length) {
      victory();
      return;
    }

    isAnswering = false;
    const q = selectedQuestions[currentIdx];

    progressBadge.textContent = `Question ${currentIdx + 1} / 6`;
    
    // Replace "___" with a stylized blank
    const styledSentence = q.sentence.replace('___', '<span style="border-bottom: 2px dashed var(--color-primary); color: var(--color-primary); min-width: 80px; display: inline-block;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    quizSentence.innerHTML = styledSentence;

    // Removed literal tips to increase difficulty.
    subjectTip.textContent = '💡 Feeling or cause of the emotion?';

    // Set options
    edText.textContent = q.edForm;
    ingText.textContent = q.ingForm;

    // Reset buttons styles
    btnEd.className = 'btn-premium btn-secondary';
    btnIng.className = 'btn-premium btn-secondary';
    btnEd.disabled = false;
    btnIng.disabled = false;
    
    // Clear inline styles from previous answers
    btnEd.style.background = '';
    btnEd.style.borderColor = '';
    btnEd.style.color = '';
    btnIng.style.background = '';
    btnIng.style.borderColor = '';
    btnIng.style.color = '';
  }

  function handleAnswer(choice: 'ed' | 'ing', clickedBtn: HTMLButtonElement) {
    if (isAnswering) return;
    isAnswering = true;

    btnEd.disabled = true;
    btnIng.disabled = true;

    const q = selectedQuestions[currentIdx];
    const isCorrect = choice === q.blankTarget;

    if (isCorrect) {
      clickedBtn.classList.remove('btn-secondary');
      clickedBtn.classList.add('btn-primary'); // turns blue/gradient
      clickedBtn.style.borderColor = 'var(--color-success)';
      clickedBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      clickedBtn.style.color = '#fff';
      
      playCorrectSound();

      const session = { ...getState().sessionStats };
      session.correct++;
      setState({ sessionStats: session });

      // Animate filling the blank in the card
      const blankWord = q.blankTarget === 'ed' ? q.edForm : q.ingForm;
      quizSentence.innerHTML = q.sentence.replace('___', `<span style="color: var(--color-success); font-weight: 800; border-bottom: 2px solid var(--color-success); animation: float 1s ease;">${blankWord}</span>`);

      currentIdx++;
      setTimeout(() => {
        loadQuestion();
      }, 1200);
    } else {
      clickedBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      clickedBtn.style.color = '#fff';
      clickedBtn.style.borderColor = 'var(--color-danger)';
      
      // Shake quiz card
      quizCard.animate([
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0)' }
      ], { duration: 400 });

      playWrongSound();

      mistakesCount++;

      // Add to review queue
      const currentQueue = [...getState().reviewQueue];
      if (!currentQueue.includes(q.id)) {
        currentQueue.push(q.id);
        setState({ reviewQueue: currentQueue });
      }

      const session = { ...getState().sessionStats };
      session.wrong++;
      setState({ sessionStats: session });

      // Highlight the correct option in green
      const correctBtn = q.blankTarget === 'ed' ? btnEd : btnIng;
      correctBtn.style.background = 'rgba(16, 185, 129, 0.15)';
      correctBtn.style.borderColor = 'var(--color-success)';

      currentIdx++;
      setTimeout(() => {
        loadQuestion();
      }, 1500);
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

    const score = Math.max(50, 600 + (remainingTime * 10) - (mistakesCount * 50));

    completeGame(2, score, stars, timeTaken);

    setTimeout(() => {
      navigate('results');
    }, 800);
  }

  btnEd.addEventListener('click', () => handleAnswer('ed', btnEd));
  btnIng.addEventListener('click', () => handleAnswer('ing', btnIng));

  const btnBack = content.querySelector('#btn-back');
  btnBack?.addEventListener('click', () => {
    timer.stop();
    navigate('select');
  });

  container.addEventListener('timer:expired', () => {
    const timeTaken = 60;
    const score = Math.max(20, currentIdx * 70 - mistakesCount * 15);
    completeGame(2, score, 0, timeTaken);
    navigate('results');
  });

  // Start first question
  loadQuestion();
}
