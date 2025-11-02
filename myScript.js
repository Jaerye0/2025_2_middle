const intro = document.getElementById('intro');
const intBg = document.getElementById('intBg');
const scrollContainer = document.getElementById('scroll');
const sections = document.querySelectorAll('#main .fossil');
const background = document.getElementById('background');
const distance = document.getElementById('distance');
const endSection = document.getElementById('end');
const backBtn = document.getElementById('backBtn');

let introDone = false;
let currentIndex = 0;
let isScrolling = false;
let endTriggered = false;
let enteredHuman = false;
let humanReadyForEnd = false;
let scrollCooldown = false;

window.addEventListener("load", () => {
  intBg.style.transition = "none";
  setTimeout(() => {
    intBg.style.transition = "transform 0.5s ease-in-out";
  }, 100);
});

function disableHover() {
  document.body.classList.add('no-hover');
}

function enableHover() {
  document.body.classList.remove('no-hover');
}

window.addEventListener(
  'wheel',
  (e) => {
    if (!introDone) {
      e.preventDefault();
      if (e.deltaY > 0) {
        intBg.style.transition = 'transform 0.6s ease-in-out';
        intBg.style.transform = 'translateY(-100%)';
        intro.style.pointerEvents = 'none';

        setTimeout(() => {
          intro.style.display = 'none';
          introDone = true;

          scrollContainer.style.transition = 'none';
          scrollContainer.style.opacity = '1';

          const firstFossil = document.getElementById('stegosaurus');
          const firstSign = document.getElementById('stegoSignImg');
          if (firstFossil && firstSign) {
            firstFossil.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
            firstSign.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
            firstFossil.style.transform = 'translate(-50%, -50%)';
            firstSign.style.transform = 'translate(-50%, -50%)';
            firstFossil.style.opacity = '1';
            firstSign.style.opacity = '1';
          }
        }, 600);
      }
      return;
    }

    if (Math.abs(e.deltaY) < 50 || scrollCooldown) return;
    scrollCooldown = true;
    setTimeout(() => (scrollCooldown = false), 700);

    e.preventDefault();
    if (isScrolling) return;
    isScrolling = true;
    disableHover();

    const direction = e.deltaY > 0 ? 1 : -1;

    if (endTriggered && direction < 0) {
      endSection.classList.remove('show');
      endTriggered = false;
      enteredHuman = true;
      humanReadyForEnd = false;
      setTimeout(() => {
        humanReadyForEnd = true;
      }, 1000);
      setTimeout(() => {
        isScrolling = false;
        enableHover();
      }, 800);
      return;
    }

    if (endTriggered && direction > 0) {
      isScrolling = false;
      enableHover();
      return;
    }

    currentIndex = Math.min(Math.max(currentIndex + direction, 0), sections.length - 1);
    const newScrollLeft = window.innerWidth * currentIndex;
    scrollContainer.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });

    if (currentIndex !== sections.length - 1) {
      enteredHuman = false;
      humanReadyForEnd = false;
    }

    if (currentIndex === sections.length - 1 && !enteredHuman && direction > 0) {
      enteredHuman = true;
      humanReadyForEnd = false;
      setTimeout(() => {
        humanReadyForEnd = true;
      }, 700);
    } else if (
      enteredHuman &&
      humanReadyForEnd &&
      currentIndex === sections.length - 1 &&
      direction > 0 &&
      !endTriggered
    ) {
      setTimeout(() => {
        endSection.classList.add('show');
        endTriggered = true;
        enteredHuman = false;
        humanReadyForEnd = false;
      }, 200);
    }

    setTimeout(() => {
      isScrolling = false;
      enableHover();
    }, 700);
  },
  { passive: false }
);

let scrollTimeout;
scrollContainer.addEventListener('scroll', () => {
  const scrollX = scrollContainer.scrollLeft;
  background.style.backgroundPosition = `${-scrollX * 0.15}px 0`;
  distance.style.backgroundPosition = `${-scrollX * 0.05}px 0`;
  disableHover();
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    enableHover();
  }, 150);
});

if (backBtn) {
  backBtn.addEventListener('click', () => {
    if (endTriggered) {
      endSection.classList.remove('show');
      endTriggered = false;
    }
    disableHover();
    let index = sections.length - 1;
    const speed = 100;
    const interval = setInterval(() => {
      const newScrollLeft = window.innerWidth * index;
      scrollContainer.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      index--;
      if (index < 0) {
        clearInterval(interval);
        enableHover();
        currentIndex = 0;
        enteredHuman = false;
        humanReadyForEnd = false;
      }
    }, speed);
  });
}
