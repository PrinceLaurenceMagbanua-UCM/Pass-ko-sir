const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const toast = document.getElementById('toast');
const dialog = document.getElementById('interestDialog');
const readingProgress = document.getElementById('readingProgress');
const questCount = document.getElementById('questCount');
const questBar = document.getElementById('questBar');
const questStatusTitle = document.getElementById('questStatusTitle');
const questStatusText = document.getElementById('questStatusText');
const visitedQuests = new Set();
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function updateReadingProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = distance > 0 ? window.scrollY / distance * 100 : 0;
  readingProgress.style.width = `${Math.max(0, Math.min(100, progress))}%`;
}

window.addEventListener('scroll', updateReadingProgress, { passive: true });
window.addEventListener('resize', updateReadingProgress);
updateReadingProgress();

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 75}ms`;
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const light = document.body.classList.contains('light');
  themeIcon.textContent = light ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  showToast(light ? 'Day mode. Same questionable decisions.' : 'Back to the dark side. Comfortable.');
});

const questGlyphs = {
  Gaming: '✳',
  Music: '♫',
  Technology: '</>',
  'Manga & Trails': '↟'
};

function updateQuestProgress(card) {
  const title = card.dataset.title;
  if (!visitedQuests.has(title)) {
    visitedQuests.add(title);
    const count = visitedQuests.size;
    questCount.textContent = `${count} / 4`;
    questBar.style.width = `${count * 25}%`;
    if (count === 4) {
      questStatusTitle.textContent = 'Profile explored. Achievement unlocked.';
      questStatusText.textContent = 'You found every side quest. Respect.';
      showToast('ACHIEVEMENT UNLOCKED: Knows a little more about Prince.');
    } else {
      questStatusTitle.textContent = `${count} side quest${count === 1 ? '' : 's'} explored`;
      questStatusText.textContent = `${4 - count} more to discover, if you're curious.`;
    }
  }
}

document.querySelectorAll('.interest-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.getElementById('dialogNumber').textContent = card.dataset.number;
    document.getElementById('dialogTitle').textContent = card.dataset.title;
    document.getElementById('dialogDetail').textContent = card.dataset.detail;
    document.getElementById('dialogGlyph').textContent = questGlyphs[card.dataset.title] || '✳';
    updateQuestProgress(card);
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      showToast(card.dataset.detail);
    }
  });
});

function closeDialog() {
  if (dialog.open) dialog.close();
}

document.getElementById('dialogClose').addEventListener('click', closeDialog);
document.getElementById('dialogDone').addEventListener('click', closeDialog);
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener('close', () => {
  const activeCard = document.querySelector('.interest-card:focus');
  if (activeCard) activeCard.focus();
});

const vibeMessages = {
  Curious: 'You would absolutely click a button just to see what it does. Honestly, same.',
  Creative: 'Your brain has 14 tabs open and at least 3 of them have good ideas.',
  Focused: 'Locked in. Notifications ignored. Side quests temporarily postponed.',
  Unpredictable: 'No plan, just vibes. Somehow, this might actually work.'
};

document.querySelectorAll('.vibe-picker button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.vibe-picker button').forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    document.getElementById('vibeResult').textContent = vibeMessages[button.dataset.vibe];
  });
});

document.getElementById('surpriseBtn').addEventListener('click', () => {
  const ideas = [
    'Random thought: what if your next favorite thing is something you have not tried yet?',
    'Achievement unlocked: you clicked the button. Curiosity remains undefeated.',
    'Life is basically a side quest with deadlines.',
    'Somewhere out there is a trail with your name on it. Probably muddy.',
    'Current status: figuring it out, but at least the UI looks good.',
    'Plot twist: the real skill was the tabs we opened along the way.'
  ];
  showToast(ideas[Math.floor(Math.random() * ideas.length)]);
  const photo = document.querySelector('.photo-frame');
  if (typeof photo.animate === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    photo.animate(
      [{ transform: 'rotate(2deg) translateY(0)' }, { transform: 'rotate(-1deg) translateY(-9px)' }, { transform: 'rotate(2deg) translateY(0)' }],
      { duration: 620, easing: 'cubic-bezier(.2,.8,.2,1)' }
    );
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  });
});
