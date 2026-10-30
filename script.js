
(() => {
  'use strict';

  // Welcome screen and viewing mode
  const welcomeScreen = document.getElementById('welcomeScreen');
  const siteShell = document.getElementById('siteShell');
  const modeButtons = document.querySelectorAll('[data-mode]');
  const changeMode = document.getElementById('changeMode');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const header = document.querySelector('.site-header');

  function showPortfolio(mode) {
    if (!siteShell || !welcomeScreen) return;

    siteShell.classList.toggle('mobile-mode', mode === 'mobile');
    siteShell.setAttribute('aria-hidden', 'false');
    welcomeScreen.classList.add('hidden');
    document.body.classList.toggle('mobile-view', mode === 'mobile');

    try {
      localStorage.setItem('yt-view-mode', mode);
    } catch (error) {
      console.warn('Could not save viewing preference:', error);
    }
  }

  function showWelcome() {
    if (!welcomeScreen || !siteShell) return;

    welcomeScreen.classList.remove('hidden');
    siteShell.setAttribute('aria-hidden', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showPortfolio(button.dataset.mode);
    });
  });

  if (changeMode) {
    changeMode.addEventListener('click', showWelcome);
  }

  let savedMode = null;

  try {
    savedMode = localStorage.getItem('yt-view-mode');
  } catch (error) {
    console.warn('Could not read viewing preference:', error);
  }

  if (savedMode === 'mobile' || savedMode === 'desktop') {
    showPortfolio(savedMode);
  }

  // Mobile navigation
  document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('open');

      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Header scroll effect
  if (header) {
    window.addEventListener(
      'scroll',
      () => {
        header.classList.toggle('scrolled', window.scrollY > 24);
      },
      { passive: true }
    );
  }

  // Navigation section highlighting and reveal animations
  const sections = [...document.querySelectorAll('main section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navAnchors.forEach((anchor) => {
          anchor.classList.toggle(
            'active',
            anchor.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll('.reveal').forEach((element) => {
      element.classList.add('visible');
    });
  }

  // Project filters and search
  const projectCards = [...document.querySelectorAll('.project-card')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectSearch = document.getElementById('projectSearch');
  const emptyState = document.getElementById('emptyState');

  let currentFilter = 'all';

  function updateProjects() {
    const query = projectSearch
      ? projectSearch.value.trim().toLowerCase()
      : '';

    let visible = 0;

    projectCards.forEach((card) => {
      const title = (card.dataset.title || '').toLowerCase();

      const matchesFilter =
        currentFilter === 'all' ||
        card.dataset.category === currentFilter;

      const matchesSearch = !query || title.includes(query);
      const show = matchesFilter && matchesSearch;

      card.hidden = !show;

      if (show) visible++;
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter || 'all';

      filterButtons.forEach((item) => {
        item.classList.toggle('active', item === button);
      });

      updateProjects();
    });
  });

  if (projectSearch) {
    projectSearch.addEventListener('input', updateProjects);
  }

  // Project detail dialog
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalTech = document.getElementById('modalTech');

  document.querySelectorAll('.detail-button').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.project-card');

      if (!card || !modal) return;

      if (modalTitle) {
        modalTitle.textContent = card.dataset.title || 'Project details';
      }

      if (modalDescription) {
        modalDescription.textContent = card.dataset.description || '';
      }

      if (modalTech) {
        modalTech.textContent = card.dataset.tech || '';
      }

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      }
    });
  });

  const modalClose = document.getElementById('modalClose');

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.close());

    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.close();
    });
  }

  // Code examples shown in the portfolio
  const codeExamples = {
    html: {
      file: 'index.html',
      code: `<span class="tag">&lt;main</span> <span class="attr">class</span>=<span class="str">"workspace"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;h1&gt;</span>Make space for
    good ideas.<span class="tag">&lt;/h1&gt;</span>
  <span class="tag">&lt;p&gt;</span>Thoughtful digital work,
    made visible.<span class="tag">&lt;/p&gt;</span>
<span class="tag">&lt;/main&gt;</span>`
    },

    css: {
      file: 'style.css',
      code: `<span class="tag">.workspace</span> {
  <span class="attr">display</span>: grid;
  <span class="attr">min-height</span>: 100vh;
  <span class="attr">place-items</span>: center;
  <span class="attr">padding</span>: 2rem;
  <span class="attr">background</span>: #101820;
}`
    },

    javascript: {
      file: 'script.js',
      code: `<span class="tag">const</span> ideas = document
  .<span class="attr">querySelector</span>(<span class="str">'.ideas'</span>);

ideas.<span class="attr">addEventListener</span>(<span class="str">'click'</span>, () =&gt; {
  ideas.<span class="attr">classList</span>.<span class="attr">toggle</span>(<span class="str">'is-active'</span>);
});`
    },

    typescript: {
      file: 'types.ts',
      code: `<span class="tag">type</span> Project = {
  <span class="attr">title</span>: string;
  <span class="attr">tools</span>: string[];
  <span class="attr">isReady</span>: boolean;
};`
    },

    python: {
      file: 'focus.py',
      code: `<span class="tag">def</span> <span class="attr">make_space</span>(ideas):
    <span class="str">"""Keep the useful parts."""</span>
    <span class="tag">return</span> [
        idea <span class="tag">for</span> idea <span class="tag">in</span> ideas
        <span class="tag">if</span> idea.is_useful
    ]`
    }
  };

  const codeContent = document.getElementById('codeContent');
  const lineNumbers = document.getElementById('lineNumbers');
  const fileName = document.getElementById('fileName');

  function renderCode(language) {
    const example = codeExamples[language];

    if (!example || !codeContent) return;

    codeContent.innerHTML = example.code;

    if (fileName) {
      fileName.textContent = example.file;
    }

    if (lineNumbers) {
      lineNumbers.textContent = example.code
        .replace(/<[^>]+>/g, '')
        .split('\n')
        .map((_, index) => String(index + 1).padStart(2, '0'))
        .join('\n');
    }

    document.querySelectorAll('.language-tabs button').forEach((button) => {
      button.classList.toggle(
        'active',
        button.dataset.language === language
      );
    });
  }

  document.querySelectorAll('.language-tabs button').forEach((button) => {
    button.addEventListener('click', () => {
      renderCode(button.dataset.language);
    });
  });

  renderCode('html');

  // Copy code example
  const copyCode = document.getElementById('copyCode');

  if (copyCode && codeContent) {
    copyCode.addEventListener('click', async () => {
      const status = document.getElementById('copyStatus');

      try {
        await navigator.clipboard.writeText(codeContent.textContent);

        if (status) {
          status.textContent = 'Copied to clipboard';
        }
      } catch (error) {
        if (status) {
          status.textContent = 'Select the code to copy it';
        }
      }

      window.setTimeout(() => {
        if (status) status.textContent = '';
      }, 2200);
    });
  }

  // CONTACT FORM: only one submit handler
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const fields = [
        ...contactForm.querySelectorAll(
          'input[required], textarea[required]'
        )
      ];

      let valid = true;

      fields.forEach((field) => {
        const error = field.parentElement.querySelector('small');
        let message = '';

        if (!field.value.trim()) {
          message = 'This field is required.';
        } else if (
          field.type === 'email' &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
        ) {
          message = 'Enter a valid email address.';
        }

        if (error) error.textContent = message;

        if (message) valid = false;
      });

      const success = document.getElementById('formSuccess');

      if (!valid) {
        if (success) success.textContent = '';
        return;
      }

      const formData = new FormData(contactForm);

      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const subject = String(formData.get('subject') || '').trim();
      const projectType = String(formData.get('type') || '').trim();
      const message = String(formData.get('message') || '').trim();

      if (success) success.textContent = 'Sending...';

      try {
        if (typeof supabaseClient === 'undefined') {
          throw new Error(
            'Supabase is not configured. Check the settings in index.html.'
          );
        }

        // Save message to Supabase
        const { error: databaseError } = await supabaseClient
          .from('contact_messages')
          .insert({
            name,
            email,
            subject,
            project_type: projectType,
            message
          });

        if (databaseError) throw databaseError;

        // Request email notification from the Edge Function
        const { error: emailError } =
          await supabaseClient.functions.invoke('send-contact-email', {
            body: {
              name,
              email,
              subject,
              project_type: projectType,
              message
            }
          });

        if (emailError) {
          console.error('Email notification error:', emailError);

          if (success) {
            success.textContent =
              'Your message was saved, but the email notification failed.';
          }
        } else if (success) {
          success.textContent =
            'Thank you! Your inquiry has been sent successfully.';
        }

        contactForm.reset();

        contactForm.querySelectorAll('label small').forEach((error) => {
          error.textContent = '';
        });
      } catch (error) {
        console.error('Contact form error:', error);

        if (success) {
          success.textContent =
            'Your message could not be processed. Please try again.';
        }
      }
    });
  }

  // Footer year
  const year = document.getElementById('year');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // Check the Supabase projects connection without replacing HTML project cards
  async function loadProjects() {
    if (typeof supabaseClient === 'undefined') return;

    const { data, error } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order');

    if (error) {
      console.error('Could not load projects:', error);
      return;
    }

    console.log('Visible projects loaded from Supabase:', data);
  } 

  loadProjects();
})();
