const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
const sidebarClose = document.querySelector('.sidebar-close');

const portraitImage = document.querySelector('.portrait-image');
const portraitPlaceholder = document.querySelector('.portrait-placeholder');
if (portraitImage && portraitPlaceholder) {
  const showPortrait = () => {
    if (portraitImage.naturalWidth > 0) {
      portraitImage.hidden = false;
      portraitPlaceholder.hidden = true;
    }
  };
  portraitImage.addEventListener('load', showPortrait);
  showPortrait();
}

function setSidebar(open) {
  sidebar.classList.toggle('open', open);
  sidebarBackdrop.classList.toggle('visible', open);
  sidebar.setAttribute('aria-hidden', String(!open));
  sidebar.inert = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', open);
  if (open) sidebarClose.focus();
  else menuToggle.focus();
}

menuToggle.addEventListener('click', () => setSidebar(menuToggle.getAttribute('aria-expanded') !== 'true'));
sidebarClose.addEventListener('click', () => setSidebar(false));
sidebarBackdrop.addEventListener('click', () => setSidebar(false));
sidebar.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => setSidebar(false)));

const filters = document.querySelectorAll('.filter-button');
const projects = document.querySelectorAll('.project-card');

filters.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    projects.forEach(project => {
      project.hidden = category !== 'all' && project.dataset.category !== category;
    });
  });
});

const projectModal = document.querySelector('.project-modal');
const modalExpand = document.querySelector('.modal-expand');
const modalClose = document.querySelector('.modal-close');
const modalFrame = document.querySelector('#modal-frame');
const previewNote = document.querySelector('#preview-note');

document.querySelectorAll('.project-open').forEach(button => {
  button.addEventListener('click', () => {
    const project = button.closest('.project-card');
    const heading = project.querySelector('h3');
    const projectNumber = project.querySelector('.project-number').textContent;
    document.querySelector('#modal-number').textContent = `/ ${projectNumber}`;
    document.querySelector('#preview-title').textContent = heading.textContent;
    document.querySelector('#modal-type').textContent = project.querySelector('.project-type').textContent;
    document.querySelector('#modal-question').textContent = project.querySelector('.project-question').textContent;
    document.querySelector('#modal-description').textContent = project.querySelector('.project-description').textContent;
    document.querySelector('#modal-method').textContent = project.querySelector('.project-method').textContent;
    document.querySelector('#modal-proof').textContent = project.dataset.preview;

    const previewUrl = project.dataset.previewUrl;
    if (previewUrl) {
      modalFrame.src = previewUrl;
      modalFrame.hidden = false;
      previewNote.hidden = true;
    } else {
      modalFrame.removeAttribute('src');
      modalFrame.hidden = true;
      previewNote.hidden = false;
    }
    projectModal.showModal();
    modalClose.focus();
  });
});

modalExpand.addEventListener('click', () => {
  const expanded = !projectModal.classList.contains('expanded');
  projectModal.classList.toggle('expanded', expanded);
  modalExpand.setAttribute('aria-expanded', String(expanded));
  modalExpand.textContent = expanded ? 'Restore ↙' : 'Expand ⤢';
});

modalClose.addEventListener('click', () => projectModal.close());
projectModal.addEventListener('click', event => {
  if (event.target === projectModal) projectModal.close();
});
projectModal.addEventListener('close', () => {
  projectModal.classList.remove('expanded');
  modalExpand.setAttribute('aria-expanded', 'false');
  modalExpand.textContent = 'Expand ⤢';
  modalFrame.removeAttribute('src');
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && sidebar.classList.contains('open')) setSidebar(false);
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', link.getAttribute('href'));
    }
  });
});
