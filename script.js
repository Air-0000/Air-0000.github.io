/* Small, progressive interactions. Content remains available without JavaScript. */
(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function reflectTheme() {
    const dark = root.dataset.theme === 'dark';
    themeButton?.setAttribute('aria-label', dark ? '切换至浅色主题' : '切换至深色主题');
    themeButton?.setAttribute('aria-pressed', String(dark));
    themeMeta?.setAttribute('content', dark ? '#101d17' : '#f6f5ef');
  }
  reflectTheme();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch {}
    reflectTheme();
  });

  const menuButton = document.getElementById('menuToggle');
  const navigation = document.getElementById('mainNavigation');
  function closeMenu(restoreFocus = false) {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', '展开导航');
    navigation?.classList.remove('is-open');
    if (restoreFocus) menuButton?.focus();
  }
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '收起导航' : '展开导航');
    navigation?.classList.toggle('is-open', open);
  });
  navigation?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.header')) closeMenu();
  });
  const desktop = matchMedia('(min-width: 821px)');
  desktop.addEventListener('change', () => closeMenu());

  const navLinks = Array.from(navigation?.querySelectorAll('a[href^="#"]') || []);
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let scheduled = false;
  function updateNavigation() {
    let current = '';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 150) current = section.id;
    }
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 30) current = 'contact';
    for (const link of navLinks) {
      const active = link.getAttribute('href') === '#' + current;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  }
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
  }, { passive: true });
  addEventListener('resize', updateNavigation, { passive: true });
  updateNavigation();

  const filters = Array.from(document.querySelectorAll('[data-filter]'));
  const projects = Array.from(document.querySelectorAll('.project-card'));
  const count = document.getElementById('projectCount');
  const expandButton = document.getElementById('showAllProjects');
  let activeFilter = 'featured';
  function applyFilter(category) {
    activeFilter = category;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.filter === category)));
    let visible = 0;
    for (const project of projects) {
      const show = category === 'all' || (category === 'featured' ? project.dataset.featured === 'true' : project.dataset.category === category);
      project.hidden = !show;
      if (show) visible++;
    }
    if (count) count.textContent = category === 'featured' ? `精选 ${visible} / 共 ${projects.length} 个项目` : `${visible} 个项目`;
    if (expandButton) {
      expandButton.hidden = !['featured', 'all'].includes(category);
      expandButton.setAttribute('aria-expanded', String(category === 'all'));
      expandButton.innerHTML = category === 'all' ? '收起，返回精选 6 项 <span aria-hidden="true">↑</span>' : `查看全部 ${projects.length} 个项目 <span aria-hidden="true">↓</span>`;
    }
    updateNavigation();
  }
  filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
  expandButton?.addEventListener('click', () => {
    const collapse = activeFilter === 'all';
    applyFilter(collapse ? 'featured' : 'all');
    if (collapse) {
      filters[0]?.focus({preventScroll: true});
      document.querySelector('.project-toolbar')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
  });
  function revealLinkedProject() {
    const id = location.hash.slice(1);
    const target = id && document.getElementById(id);
    if (target?.classList.contains('project-card') && target.hidden) applyFilter('all');
  }
  applyFilter('featured');
  revealLinkedProject();
  addEventListener('hashchange', revealLinkedProject);
  document.querySelector('.filters')?.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const index = filters.indexOf(document.activeElement);
    if (index < 0) return;
    e.preventDefault();
    let next = e.key === 'Home' ? 0 : e.key === 'End' ? filters.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + filters.length) % filters.length;
    filters[next].focus();
    filters[next].click();
  });

  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function legacyCopy(text) {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Copy unavailable');
  }
  document.getElementById('copyEmailBtn')?.addEventListener('click', async function () {
    const email = this.dataset.email;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(email); }
        catch { legacyCopy(email); }
      } else legacyCopy(email);
      showToast('邮箱已复制：' + email);
    } catch { showToast('请手动复制：' + email); }
    this.focus({ preventScroll: true });
  });
})();
