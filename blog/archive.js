import { constellations } from './articles.js';

const scene = document.querySelector('.observatory');
const stars = scene.querySelector('.project-stars');
const dialog = scene.querySelector('dialog');
let selected;

const picker = scene.querySelector('.constellation-picker');
const topics = picker.querySelector('select');
const previous = picker.querySelector('.previous');
const next = picker.querySelector('.next');
const narrow = matchMedia('(max-width:720px)');
const desktopPoints = [[58,22], [36,34], [51,48], [76,37], [81,14]];
const mobilePoints = [[48,17], [18,31], [47,46], [80,35], [81,11]];
const skies = [];
for (const { topic, articles } of constellations) {
  const capacity = desktopPoints.length;
  for (let start = 0; start < articles.length; start += capacity) {
    const label = articles.length > capacity ? topic + ' · ' + (1 + start / capacity) : topic;
    skies.push({ topic: label, articles: articles.slice(start, start + capacity) });
  }
}

function placeStars() {
  const points = narrow.matches ? mobilePoints : desktopPoints;
  const segments = Array.from(stars.children, (button, i) => {
    const [x, y] = points[i];
    button.style.left = x + '%';
    button.style.top = y + '%';
    return (i ? 'L' : 'M') + x + ' ' + y;
  });
  scene.querySelector('.links').setAttribute('d', segments.join(' '));
}

function showConstellation(index) {
  const { articles, topic } = skies[index];
  stars.replaceChildren();
  for (const article of articles) {
    const star = document.createElement('button');
    star.type = 'button';
    star.setAttribute('aria-haspopup', 'dialog');
    star.setAttribute('aria-controls', dialog.id);
    const spark = document.createElement('i');
    spark.setAttribute('aria-hidden', 'true');
    spark.textContent = '✦';
    const label = document.createElement('span');
    label.textContent = article.title;
    star.append(spark, label);
    star.addEventListener('click', () => {
      selected = star;
      dialog.querySelector('h2').textContent = article.title;
      dialog.querySelector('.scroll-summary').textContent = article.description;
      dialog.querySelector('.read').href = article.url;
      dialog.showModal();
    });
    stars.append(star);
  }
  topics.selectedIndex = index;
  previous.disabled = index === 0;
  next.disabled = index === skies.length - 1;
  stars.setAttribute('aria-label', topic + ' article stars');
  placeStars();
}

for (const { topic } of skies) topics.add(new Option(topic));
picker.hidden = skies.length < 2;
topics.addEventListener('change', () => showConstellation(topics.selectedIndex));
function step(direction) {
  showConstellation(topics.selectedIndex + direction);
  stars.firstElementChild.focus({ preventScroll: true });
}
previous.addEventListener('click', () => step(-1));
next.addEventListener('click', () => step(1));
narrow.addEventListener('change', placeStars);
if (skies.length) showConstellation(0);
dialog.querySelector('button').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  selected?.focus({ preventScroll: true });
  selected = undefined;
});
