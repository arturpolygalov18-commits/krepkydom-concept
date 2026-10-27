const menu = document.querySelector('.site-menu');
const menuTrigger = document.querySelector('[data-open-menu]');
function setMenu(open) {
  menu.hidden = !open;
  menuTrigger.setAttribute('aria-expanded', String(open));
}
menuTrigger.addEventListener('click', () => setMenu(menu.hidden));
menuTrigger.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setMenu(true);
    menu.querySelector('a').focus();
  }
});
document.addEventListener('click', event => {
  if (!menu.contains(event.target) && !menuTrigger.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) {
    setMenu(false);
    menuTrigger.focus();
  }
});
document.addEventListener('focusin', event => {
  if (!menu.hidden && !menu.contains(event.target) && !menuTrigger.contains(event.target)) setMenu(false);
});
const contact = document.querySelector('.contact-dialog');
document.querySelectorAll('[data-open-contact]').forEach(button => button.addEventListener('click', () => contact.showModal()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});

// The roof edge uses the same original image and the same scale as the full scene.
const visual = document.querySelector('.hero-visual');
const frame = visual.querySelector('.photo-frame');
const heroPhoto = visual.querySelector('.hero-photo');
function shapePhoto() {
  const width = visual.clientWidth, height = visual.clientHeight;
  const bleed = innerWidth > 1000 ? 50 : 0;
  const radius = innerWidth <= 600 ? 24 : 30;
  const sceneWidth = width + bleed;
  const scale = Math.max(sceneWidth / 900, height / 600);
  const horizontalPosition = bleed ? .1 : .5;
  const ox = (sceneWidth - 900 * scale) * horizontalPosition;
  const oy = (height - 600 * scale) / 2;
  frame.style.left = -bleed + 'px';
  frame.style.width = sceneWidth + 'px';
  heroPhoto.style.objectPosition = `${horizontalPosition * 100}% ${bleed ? 50 : 45}%`;
  let path = `M ${bleed + radius} 0 H ${sceneWidth - radius} Q ${sceneWidth} 0 ${sceneWidth} ${radius} V ${height - radius} Q ${sceneWidth} ${height} ${sceneWidth - radius} ${height} H ${bleed + radius} Q ${bleed} ${height} ${bleed} ${height - radius} V ${radius} Q ${bleed} 0 ${bleed + radius} 0 Z`;
  if (bleed) {
    const roof = [[47,291],[79,279],[115,265],[180,238],[200,230],[200,269],[48,307]];
    path += ' ' + roof.map((point, i) => `${i ? 'L' : 'M'} ${(ox + point[0] * scale).toFixed(2)} ${(oy + point[1] * scale).toFixed(2)}`).join(' ') + ' Z';
  }
  frame.style.clipPath = `path('${path}')`;
}
new ResizeObserver(shapePhoto).observe(visual);
heroPhoto.addEventListener('load', shapePhoto);
shapePhoto();
