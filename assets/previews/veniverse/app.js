// ===== PAGE ROUTING =====
const catFirstPage = {
    genetic: 'chromosomal',
    vascular: 'vascular',
    '3d': 'bycondition',
    treatment: 'specialists',
    community: 'forums',
    learn: 'publications'
};

// Maps page IDs to their HTML file in /pages/
const pageFiles = {
    combined: 'pages/kts.html',
    'singlegene-marfan': 'pages/marfan.html',
    'singlegene-eds': 'pages/eds.html',
    avms: 'pages/avms.html',
    vascular: 'pages/vascular.html',
    venous: 'pages/venous.html',
    lymphatic: 'pages/lymphatic.html',
    capillary: 'pages/capillary.html',
    specialists: 'pages/specialists.html',
    chromosomal: 'pages/chromosomal.html',
    singlegene: 'pages/singlegene.html',
    multifactorial: 'pages/multifactorial.html',
    mitochondrial: 'pages/mitochondrial.html',
    centers: 'pages/centers.html',
    therapies: 'pages/therapies.html',
    trials: 'pages/trials.html',
    insurance: 'pages/insurance.html',
    forums: 'pages/forums.html',
    caregiver: 'pages/caregiver.html',
    stories: 'pages/stories.html',
    events: 'pages/events.html',
    publications: 'pages/publications.html',
    articles: 'pages/articles.html',
    glossary: 'pages/glossary.html',
    faqs: 'pages/faqs.html'
};

// Only the CAD / 3D model experiences remain placeholders.
const placeholderPages = {
    bycondition: {
        title: '3D Models by Condition',
        sub: 'Browse interactive models grouped by diagnosis',
        icon: 'fa-cube',
        breadcrumb: '3D Models',
        msg: 'Interactive 3D models for each condition are being built.'
    },
    bybody: {
        title: '3D Models by Body System',
        sub: 'Cardiovascular, neurological, musculoskeletal models',
        icon: 'fa-cube',
        breadcrumb: '3D Models',
        msg: 'Body system models are being developed.'
    },
    viewer: {
        title: 'Interactive Anatomy Viewer',
        sub: 'Rotate, zoom, and explore cross-sections',
        icon: 'fa-cube',
        breadcrumb: '3D Models',
        msg: 'The interactive anatomy viewer is under development.'
    },
};

// Search conditions list
const conditions = [
    'Klippel-Trenaunay Syndrome',
    'Marfan Syndrome',
    'Ehlers-Danlos Syndrome',
    'Arteriovenous Malformations',
    'Down Syndrome',
    'Turner Syndrome',
    'Klinefelter Syndrome',
    'Edwards Syndrome',
    'Cystic Fibrosis',
    'Sickle Cell Disease',
    'Venous Malformations',
    'Lymphatic Malformations',
    'Capillary Malformations',
    'Chromosomal Disorders',
    'Mitochondrial Disorders',
    'Vascular Malformations',
    'Blue Rubber Bleb Nevus Syndrome',
    'Facial Venous Malformation',
    'Intramuscular Venous Malformation',
    'Gastrointestinal Venous Malformation',
    'Extremity Venous Malformation',
    'Cystic Hygroma',
    'Tongue Lymphatic Malformation',
    'Axillary Lymphatic Malformation',
    'Retroperitoneal Lymphatic Malformation',
    'Cervical Lymphatic Malformation',
    'Orbital Lymphatic Malformation',
    'CM-AVM Syndrome',
    'Port-Wine Birthmark',
    'Nevus Flammeus',
    'Salmon Patch',
    'Sturge-Weber Syndrome',
    'Brain AVM',
    'Skin AVM',
    'Limb AVM',
    'Pulmonary AVM',
    'Spinal AVM'
];

const searchMap = {
    'vascular malformations': 'vascular',
    'klippel-trenaunay syndrome': 'combined',
    'marfan syndrome': 'singlegene-marfan',
    'ehlers-danlos syndrome': 'singlegene-eds',
    'arteriovenous malformations': 'avms',
    'chromosomal disorders': 'chromosomal',
    'venous malformations': 'venous',
    'lymphatic malformations': 'lymphatic',
    'capillary malformations': 'capillary',
    'mitochondrial disorders': 'mitochondrial',
    'down syndrome': 'chromosomal',
    'turner syndrome': 'chromosomal',
    'klinefelter syndrome': 'chromosomal',
    'edwards syndrome': 'chromosomal',
    'cystic fibrosis': 'singlegene',
    'sickle cell disease': 'singlegene',
    'blue rubber bleb nevus syndrome': 'venous',
    'facial venous malformation': 'venous',
    'intramuscular venous malformation': 'venous',
    'gastrointestinal venous malformation': 'venous',
    'extremity venous malformation': 'venous',
    'cystic hygroma': 'lymphatic',
    'tongue lymphatic malformation': 'lymphatic',
    'axillary lymphatic malformation': 'lymphatic',
    'retroperitoneal lymphatic malformation': 'lymphatic',
    'cervical lymphatic malformation': 'lymphatic',
    'orbital lymphatic malformation': 'lymphatic',
    'cm-avm syndrome': 'capillary',
    'port-wine birthmark': 'capillary',
    'nevus flammeus': 'capillary',
    'salmon patch': 'capillary',
    'sturge-weber syndrome': 'capillary',
    'brain avm': 'avms',
    'skin avm': 'avms',
    'limb avm': 'avms',
    'pulmonary avm': 'avms',
    'spinal avm': 'avms'
};


// ===== LOAD PAGE =====
function loadPage(id) {
    const contentDiv = document.getElementById('page-content');
    const homeDiv = document.getElementById('page-home');
    const contactDiv = document.getElementById('contact');

    if (id === 'home') {
        homeDiv.style.display = '';
        contentDiv.innerHTML = '';
        contentDiv.classList.remove('has-content');
        contactDiv.style.display = 'none';
        updateNav('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (id === 'contact') {
        homeDiv.style.display = 'none';
        contentDiv.innerHTML = '';
        contentDiv.classList.remove('has-content');
        contactDiv.style.display = '';
        updateNav('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Hide home and contact while a content page is showing
    homeDiv.style.display = 'none';
    contactDiv.style.display = 'none';
    updateNav('');

    if (pageFiles[id]) {
        fetch(pageFiles[id])
            .then(res => {
                if (!res.ok) throw new Error('Page not found');
                return res.text();
            })
            .then(html => {
                contentDiv.innerHTML = html;
                if (['vascular', 'venous', 'lymphatic', 'capillary', 'avms', 'combined'].includes(id)) {
                    const breadcrumb = contentDiv.querySelector('.breadcrumb');
                    if (breadcrumb) breadcrumb.insertAdjacentHTML('afterend', buildVascularSubnav(id));
                }
                contentDiv.classList.add('has-content');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                initTabs();
                initSlideshows();
            })
            .catch(() => {
                contentDiv.innerHTML = buildLoadError();
                contentDiv.classList.add('has-content');
            });
    } else if (placeholderPages[id]) {
        contentDiv.innerHTML = buildPlaceholder(id);
        contentDiv.classList.add('has-content');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function buildVascularSubnav(activePage) {
    const items = [
        ['vascular', 'Overview'],
        ['venous', 'Venous'],
        ['lymphatic', 'Lymphatic'],
        ['capillary', 'Capillary'],
        ['avms', 'Arteriovenous'],
        ['combined', 'Combined / complex']
    ];

    return `<nav class="vascular-subnav" aria-label="Vascular malformation types">${items.map(([id, label]) =>
        `<a href="#" ${id === activePage ? 'aria-current="page"' : ''} onclick="loadPage('${id}');return false">${label}</a>`
    ).join('')}</nav>`;
}

function buildPlaceholder(id) {
    const p = placeholderPages[id];

    if (!p) {
        return '<div class="coming-soon"><i class="fas fa-circle-info"></i><h3>Page information is unavailable</h3></div>';
    }

    return `
        <div class="breadcrumb">
            <a href="#" onclick="loadPage('home'); return false">Home</a> &rsaquo;
            <span>${p.breadcrumb}</span> &rsaquo;
            <span>${p.title}</span>
        </div>
        <h1 class="page-title">${p.title}</h1>
        <p class="page-subtitle">${p.sub}</p>
        <div class="title-bar"></div>
        <div class="coming-soon">
            <i class="fas ${p.icon}"></i>
            <h3>3D model content in progress</h3>
            <p>${p.msg}</p>
        </div>
    `;
}

function buildLoadError() {
    return `
        <div class="coming-soon">
            <i class="fas fa-triangle-exclamation"></i>
            <h3>This page could not be loaded</h3>
            <p>Open the site through a local server (for example VS Code's Live Server) instead of double-clicking index.html, and check that the file exists in the pages folder.</p>
        </div>
    `;
}

function showCat(cat) {
    if (catFirstPage[cat]) loadPage(catFirstPage[cat]);
    updateNav(cat);
}

function updateNav(active) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navLink = document.querySelector(`[data-nav="${active}"]`);
    if (navLink) navLink.classList.add('active');
}


// ===== TABS (works on dynamically loaded content) =====
function switchTab(btn, panelId) {
    const tabsContainer = btn.closest('.tabs');

    tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    tabsContainer.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(panelId).classList.add('active');
}

function initTabs() {
    document.querySelectorAll('#page-content .tabs').forEach(tabGroup => {
        const firstBtn = tabGroup.querySelector('.tab-btn');
        const firstPanel = tabGroup.querySelector('.tab-panel');

        if (firstBtn) firstBtn.classList.add('active');
        if (firstPanel) firstPanel.classList.add('active');
    });
}


// ===== SLIDESHOWS (rotate only when a slideshow has more than one slide) =====
let slideshowTimer = null;

function initSlideshows() {
    clearInterval(slideshowTimer);

    const slides = document.querySelector('#page-content .slides');
    if (!slides || slides.children.length < 2) return;

    let current = 0;

    slideshowTimer = setInterval(() => {
        current = (current + 1) % slides.children.length;
        slides.style.transform = `translateX(-${current * 100}%)`;
    }, 4000);
}


// ===== DARK MODE =====
function toggleDark() {
    document.body.classList.toggle('dark-mode');

    const icon = document.getElementById('darkIcon');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');

    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.getElementById('darkIcon').classList.replace('fa-moon', 'fa-sun');
}


// ===== TOAST =====
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function sendContactEmail(event) {
    event.preventDefault();

    const name = document.getElementById('cName').value.trim();
    const sender = document.getElementById('cEmail').value.trim();
    const subject = document.getElementById('cSubject').value;
    const message = document.getElementById('cMsg').value.trim();
    const body = `Name: ${name}\nEmail: ${sender}\n\n${message}`;
    const mailto = `mailto:veniversegenetics@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
}


// ===== BOOKMARK =====
function toggleBookmark(btn, name) {
    btn.classList.toggle('bookmarked');

    const icon = btn.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');

    const isBookmarked = btn.classList.contains('bookmarked');
    showToast(isBookmarked ? `${name} bookmarked!` : `${name} removed from bookmarks`);

    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    if (isBookmarked) {
        if (!bookmarks.includes(name)) bookmarks.push(name);
    } else {
        bookmarks = bookmarks.filter(b => b !== name);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}


// ===== SEARCH =====
function handleSearch() {
    const val = document.getElementById('searchInput').value.trim().toLowerCase();
    const suggest = document.getElementById('searchSuggest');

    if (val.length < 2) {
        suggest.classList.remove('show');
        return;
    }

    const matches = conditions.filter(c => c.toLowerCase().includes(val));

    if (matches.length) {
        suggest.innerHTML = matches
            .map(m => `<a href="#" role="option" onclick="searchSelect('${m}');return false">${m}</a>`)
            .join('');
        suggest.classList.add('show');
        suggest.setAttribute('role', 'listbox');
    } else {
        suggest.classList.remove('show');
        suggest.innerHTML = '';
    }
}

function submitSearch(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('searchInput');
    const query = input.value.trim().toLowerCase();
    if (!query) {
        input.focus();
        showToast('Enter a condition to search.');
        return;
    }

    const exactMatch = conditions.find(condition => condition.toLowerCase() === query);
    const match = exactMatch || conditions.find(condition => condition.toLowerCase().includes(query));
    document.getElementById('searchSuggest').classList.remove('show');
    if (match) {
        searchSelect(match);
    } else {
        showToast('No matching condition found. Try a different search.');
    }
}

function searchSelect(name) {
    document.getElementById('searchSuggest').classList.remove('show');
    document.getElementById('searchInput').value = name;

    const key = name.toLowerCase();

    if (searchMap[key]) {
        loadPage(searchMap[key]);
    } else {
        showToast(`No page is linked to ${name} yet.`);
    }
}

document.addEventListener('click', event => {
    const section = document.querySelector('.search-section');
    if (section && !section.contains(event.target)) {
        document.getElementById('searchSuggest')?.classList.remove('show');
    }
});


// ===== SCROLL EVENTS =====
window.addEventListener('scroll', () => {
    document.getElementById('backToTop').classList.toggle('show', window.scrollY > 400);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('progressBar').style.width =
        docHeight > 0 ? (window.scrollY / docHeight * 100) + '%' : '0%';

    document.getElementById('topNav').classList.toggle('scrolled', window.scrollY > 10);
});


// ===== TYPING ANIMATION =====
(function typeWriter() {
    const text = 'Understanding Your Condition Starts Here';
    const el = document.getElementById('typedText');

    if (!el) return;

    let i = 0;

    function type() {
        if (i < text.length) {
            el.innerHTML = text.substring(0, i + 1) + '<span class="typed-cursor">|</span>';
            i++;
            setTimeout(type, 60);
        } else {
            el.innerHTML = text;
        }
    }

    type();
})();


// ===== ANIMATED COUNTERS =====
const statsEl = document.getElementById('statsSection');

if (statsEl) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.num').forEach(num => {
                    const target = parseInt(num.dataset.target);
                    const step = Math.ceil(target / 60);
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;

                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }

                        num.textContent = current.toLocaleString() + '+';
                    }, 25);
                });

                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    statsObserver.observe(statsEl);
}


// ===== TESTIMONIAL CAROUSEL =====
(function testimonialCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (!slides.length) return;

    let current = 0;

    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 4000);
})();


// ===== SIDEBAR (pull-out menu with dropdowns) =====
function toggleMenu(forceState) {
    const drawer = document.getElementById('menuDrawer');
    const overlay = document.getElementById('menuOverlay');
    const toggle = document.getElementById('menuToggle');
    const shouldOpen = forceState !== undefined ? forceState : !drawer.classList.contains('open');

    drawer.classList.toggle('open', shouldOpen);
    overlay.classList.toggle('active', shouldOpen);
    drawer.setAttribute('aria-hidden', String(!shouldOpen));
    toggle.setAttribute('aria-expanded', String(shouldOpen));
}

function toggleMenuGroup(btn) {
    const group = btn.closest('.menu-group');
    const wasOpen = group.classList.contains('open');

    // Close every dropdown first so only one is open at a time
    document.querySelectorAll('.menu-group').forEach(g => {
        g.classList.remove('open');
        g.querySelector('.menu-group-btn').setAttribute('aria-expanded', 'false');
        g.querySelector('.menu-sub').style.maxHeight = '0px';
    });

    if (!wasOpen) {
        const sub = group.querySelector('.menu-sub');
        group.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        sub.style.maxHeight = sub.scrollHeight + 'px';
    }
}

// Switch to a tab (overview, symptoms, ...) on the page that is showing. Returns true if it worked.
function selectTab(tab) {
    const panel = document.querySelector(`#page-content .tab-panel[id$="-${tab}"]`);
    const btn = document.querySelector(`#page-content .tab-btn[onclick*="-${tab}'"]`);

    if (!panel || !btn) return false;

    switchTab(btn, panel.id);

    const tabs = document.querySelector('#page-content .tabs');
    if (tabs) tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });

    return true;
}

// Load a page, then jump to the chosen tab once the page has finished loading
function openCondition(id, tab) {
    const content = document.getElementById('page-content');

    if (tab) {
        const observer = new MutationObserver(() => {
            if (selectTab(tab)) observer.disconnect();
        });
        observer.observe(content, { childList: true });
        setTimeout(() => observer.disconnect(), 3000);
    }

    loadPage(id);
    toggleMenu(false);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
});

// Local chat-style guide for finding information on this site. This does not
// send visitor questions to an external AI service.
function initHelpChat() {
    const bubble = document.getElementById('chatBubble');
    const panel = document.getElementById('helpChat');
    const close = document.getElementById('closeHelpChat');
    const form = document.getElementById('helpChatForm');
    const input = document.getElementById('helpChatInput');
    const messages = document.getElementById('helpChatMessages');
    if (!bubble || !panel || !close || !form || !input || !messages) return;

    const setOpen = (open) => {
        panel.classList.toggle('is-open', open);
        panel.setAttribute('aria-hidden', String(!open));
        panel.inert = !open;
        bubble.setAttribute('aria-expanded', String(open));
        if (open) input.focus();
        else bubble.focus();
    };
    const addMessage = (text, role, action) => {
        const item = document.createElement('div');
        item.className = `help-chat-message ${role}`;
        const copy = document.createElement('p');
        copy.textContent = text;
        item.appendChild(copy);
        if (action) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'help-chat-action';
            button.textContent = action.label;
            button.addEventListener('click', () => {
                action.run();
                setOpen(false);
            });
            item.appendChild(button);
        }
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
    };
    const guide = (question) => {
        const q = question.toLowerCase();
        const routes = [
            { terms: ['marfan'], text: 'Marfan syndrome is in Genetic Diseases → Single-Gene Disorders. Select the Marfan page for its overview and resources.', label: 'Open Marfan syndrome', run: () => loadPage('singlegene-marfan') },
            { terms: ['ehlers', 'eds'], text: 'Ehlers-Danlos syndrome is in Genetic Diseases → Single-Gene Disorders.', label: 'Open Ehlers-Danlos syndrome', run: () => loadPage('singlegene-eds') },
            { terms: ['klippel-trenaunay', 'klippel trenaunay', 'kts'], text: 'Klippel-Trenaunay syndrome is listed with combined vascular malformations.', label: 'Open Klippel-Trenaunay syndrome', run: () => loadPage('combined') },
            { terms: ['vascular', 'venous', 'lymphatic', 'capillary', 'avm', 'malformation', 'port-wine'], text: 'Browse Vascular Malformations to choose a type, including venous, lymphatic, capillary, arteriovenous, and combined malformations.', label: 'Browse vascular malformations', run: () => showCat('vascular') },
            { terms: ['genetic', 'chromosomal', 'mitochondrial', 'inheritance', 'gene'], text: 'The Genetic Diseases section includes chromosomal, single-gene, multifactorial, and mitochondrial topics.', label: 'Browse genetic diseases', run: () => showCat('genetic') },
            { terms: ['specialist', 'doctor', 'clinic', 'center', 'centre', 'treatment', 'therapy', 'care'], text: 'Treatment Resources has specialist directories, treatment centers, therapy information, clinical trials, and insurance resources.', label: 'Open treatment resources', run: () => showCat('treatment') },
            { terms: ['community', 'support', 'caregiver', 'forum', 'story', 'event'], text: 'Community & Support includes patient forums, caregiver groups, stories, and events.', label: 'Browse community resources', run: () => showCat('community') },
            { terms: ['research', 'publication', 'article', 'glossary', 'faq', 'study'], text: 'Learn & Research includes publications, educational articles, a glossary, and FAQs.', label: 'Browse research and learning', run: () => showCat('learn') },
            { terms: ['3d', 'cad', 'model', 'anatomy'], text: 'The 3D Models section is where CAD and anatomy-model content will appear.', label: 'Open 3D models', run: () => showCat('3d') },
            { terms: ['contact', 'message', 'email'], text: 'Use the Contact option in the site menu to send a message.', label: 'Open contact form', run: () => loadPage('contact') }
        ];
        const match = routes.find(route => route.terms.some(term =>
            term.length <= 3 ? new RegExp(`\\b${term}\\b`).test(q) : q.includes(term)
        ));
        if (match) return match;
        return {
            text: 'I can help you find sections on genetic diseases, vascular malformations, treatment resources, community support, research, and 3D models. Try naming a topic or use the site search above.',
            label: 'Browse all topics',
            run: () => window.scrollTo({ top: 0, behavior: 'smooth' })
        };
    };

    bubble.addEventListener('click', () => setOpen(!panel.classList.contains('is-open')));
    close.addEventListener('click', () => setOpen(false));
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        addMessage(question, 'user');
        const answer = guide(question);
        addMessage(answer.text, 'assistant', answer);
        input.value = '';
        input.focus();
    });
}

document.addEventListener('DOMContentLoaded', initHelpChat);

// Condition-to-program guidance. Center-level entries are not endorsements of a particular clinician.
const specialistCenterProfiles = {
    mayo: { name: 'Mayo Clinic Vascular Anomalies Clinic', location: 'Arizona and Minnesota', url: 'https://www.mayoclinic.org/departments-centers/vascular-anomalies-clinic/overview/ovc-20421863', note: 'Multidisciplinary vascular-anomalies program; confirm the campus and exact condition.' },
    chop: { name: 'CHOP Comprehensive Vascular Anomalies Program', location: 'Philadelphia, Pennsylvania', url: 'https://www.chop.edu/centers-programs/vascular-anomalies-program', note: 'Pediatric program; confirm age eligibility and referral requirements.' },
    ucla: { name: 'UCLA Multidisciplinary Vascular Anomalies Clinic', location: 'Los Angeles, California', url: 'https://www.uclahealth.org/medical-services/multidisciplinary-vascular-anomalies-clinic', note: 'Broad program; match the individual clinician to the lesion location and procedure.' },
    hopkins: { name: 'Johns Hopkins Vascular Anomalies Center', location: 'Baltimore, Maryland', url: 'https://www.hopkinsmedicine.org/vascularanomaliescenter/', note: 'Broad complex-anomaly lead; confirm exact subtype and current clinic intake.' },
    chla: { name: "Children's Hospital Los Angeles Vascular Anomalies Center", location: 'Los Angeles, California', url: 'https://www.chla.org/vascular-anomalies-center/find-us', note: 'Pediatric program; verify age eligibility and current referral route.' },
    kki: { name: 'Kennedy Krieger Hunter Nelson Sturge-Weber Syndrome Center', location: 'Baltimore, Maryland', url: 'https://www.kennedykrieger.org/patient-care/centers-and-programs/sturge-weber-syndrome-center', note: 'Condition-specific starting point for Sturge-Weber syndrome; confirm the clinician and services needed.' },
    kkh: { name: "KK Women's and Children's Hospital Vascular Anomalies Clinic", location: 'Singapore', url: 'https://www.kkh.com.sg', note: 'Pediatric lead for venous, lymphatic, and combined anomalies; confirm the exact subtype and referral route.' },
    montpellier: { name: 'University Hospital of Montpellier — Lymphatic and Vascular Anomalies Centre', location: 'Montpellier, France', url: 'https://lymphorare.fr', note: 'Lymphatic and vascular-anomaly lead; ask about the specific anatomy and treatment modality.' },
    laribi: { name: 'Hôpital Lariboisière — Superficial Vascular Anomalies Reference Centre', location: 'Paris, France', url: 'https://hopital-lariboisiere.aphp.fr/centre-de-reference-des-anomalies-vasculaires-superficielles', note: 'The official centre page describes care for superficial vascular anomalies; it is not a match for brain, spinal, or pulmonary AVMs.' },
    uhn: { name: 'University Health Network Multidisciplinary Vascular Malformation Clinic', location: 'Toronto, Ontario, Canada', url: 'https://www.uhn.ca', note: 'Adult-care program; confirm the current clinic, condition scope, and referral requirements.' },
    gosh: { name: 'Great Ormond Street Hospital for Children', location: 'London, England', url: 'https://www.gosh.nhs.uk', note: 'Pediatric lead; confirm the exact lesion expertise and age/referral eligibility.' }
};

const specialistGroupMatches = {
    venous: ['mayo', 'chop', 'ucla', 'hopkins', 'chla', 'kkh', 'montpellier', 'uhn'],
    lymphatic: ['mayo', 'chop', 'ucla', 'chla', 'kkh', 'montpellier', 'uhn', 'gosh'],
    capillary: ['mayo', 'chop', 'kki', 'ucla', 'chla'],
    avm: ['mayo', 'chop', 'ucla', 'hopkins', 'chla', 'laribi'],
    combined: ['mayo', 'chop', 'hopkins', 'chla', 'kkh', 'montpellier', 'uhn']
};

const conditionSpecialistMatches = {
    'brbns': { group: 'venous', specialties: 'Vascular anomalies team, gastroenterology, hematology, and interventional radiology.', direct: ['mayo', 'chop'] },
    'facial-vm': { group: 'venous', specialties: 'Vascular anomalies specialist and interventional radiology; dermatology, ENT, ophthalmology, or plastic surgery depending on location.', direct: [] },
    'intramuscular-vm': { group: 'venous', specialties: 'Vascular anomalies specialist and interventional radiology; orthopedics or rehabilitation if muscle function is affected.', direct: [] },
    'gi-vm': { group: 'venous', specialties: 'Gastroenterology experienced in vascular lesions, with a vascular anomalies team and hematology as needed.', direct: [] },
    'extremity-vm': { group: 'venous', specialties: 'Vascular anomalies specialist and interventional radiology; vascular medicine/surgery or orthopedics according to anatomy.', direct: [] },
    'cystic-hygroma': { group: 'lymphatic', specialties: 'Vascular anomalies team and interventional radiology; ENT or pediatric surgery if the neck or airway is involved.', direct: ['mayo'] },
    'tongue-lm': { group: 'lymphatic', specialties: 'ENT/head-and-neck or oral-maxillofacial surgery, interventional radiology, and speech/swallowing support as needed.', direct: [] },
    'axillary-lm': { group: 'lymphatic', specialties: 'Vascular anomalies specialist, interventional radiology, and surgery familiar with axillary anatomy.', direct: [] },
    'retroperitoneal-lm': { group: 'lymphatic', specialties: 'Vascular anomalies specialist, interventional radiology, and abdominal or pediatric surgery.', direct: [] },
    'cervical-lm': { group: 'lymphatic', specialties: 'ENT/head-and-neck surgery, interventional radiology, and a vascular anomalies team; consider airway expertise.', direct: [] },
    'orbital-lm': { group: 'lymphatic', specialties: 'Oculoplastic/orbital surgery and ophthalmology, with interventional radiology and neuro-ophthalmology as needed.', direct: [] },
    'cm-avm': { group: 'capillary', specialties: 'Vascular anomalies specialist and medical genetics; add neurovascular or interventional specialists if an AVM is identified.', direct: ['mayo'] },
    'port-wine': { group: 'capillary', specialties: 'Vascular dermatologist or laser specialist experienced in vascular birthmarks; assess for a syndrome when indicated.', direct: ['mayo'] },
    'salmon-patch': { group: 'capillary', specialties: 'Usually a pediatrician or dermatologist; seek specialist assessment if the diagnosis is uncertain or features are atypical.', direct: [], ids: [], none: 'No center listed here is specifically identified for salmon patches. A local pediatrician or dermatologist is a good starting point.' },
    'sws': { group: 'capillary', specialties: 'Sturge-Weber team, neurology/epileptology, ophthalmology for glaucoma, and vascular dermatology.', direct: ['mayo', 'kki'] },
    'brain-avm': { group: 'avm', specialties: 'Cerebrovascular neurosurgery, neurointerventional radiology, and vascular neurology; seek a multidisciplinary review.', direct: [], ids: ['mayo', 'ucla', 'hopkins'] },
    'skin-avm': { group: 'avm', specialties: 'High-flow vascular-anomalies team, interventional radiology, and vascular surgery.', direct: ['laribi'], ids: ['mayo', 'chop', 'chla'] },
    'limb-avm': { group: 'avm', specialties: 'High-flow vascular-anomalies team, interventional radiology, and vascular surgery; orthopedics may help with function.', direct: [], ids: ['mayo', 'ucla', 'hopkins', 'chop'] },
    'asymptomatic-brain-avm': { group: 'avm', specialties: 'Cerebrovascular neurosurgery, neurointerventional radiology, and vascular neurology for individualized risk review.', direct: [], ids: ['mayo', 'ucla', 'hopkins'] },
    'pulmonary-avm': { group: 'avm', specialties: 'Pulmonology/pulmonary vascular medicine and interventional radiology experienced in pulmonary AVM embolization.', direct: [], ids: [], none: 'No center listed here is specifically identified for pulmonary AVMs. Ask a pulmonary vascular or hereditary hemorrhagic telangiectasia (HHT) program for a referral.' },
    'spinal-avm': { group: 'avm', specialties: 'Spinal vascular neurosurgery and neurointerventional radiology experienced with spinal angiography.', direct: [], ids: [], none: 'No center listed here is specifically identified for spinal AVMs. Ask a spinal cerebrovascular team whether it evaluates this exact AVM type.' },
    'kts': { group: 'combined', specialties: 'Multidisciplinary vascular-anomalies team, vascular medicine/surgery, interventional radiology, and hematology; orthopedics or rehabilitation as needed.', direct: ['mayo'] }
};

function showConditionSpecialistMatches() {
    const select = document.getElementById('specialistCondition');
    const output = document.getElementById('specialistMatchResults');
    if (!select || !output) return;

    const match = conditionSpecialistMatches[select.value];
    if (!match) {
        output.innerHTML = '<p class="case-note">Choose a condition to view matching specialty guidance and center leads.</p>';
        return;
    }

    const ids = match.ids || specialistGroupMatches[match.group];
    const centerCards = ids.map((id) => {
        const center = specialistCenterProfiles[id];
        const directMatch = match.direct.includes(id);
        return `<article class="specialist-match-card"><h3><a href="${center.url}" target="_blank" rel="noopener">${center.name}</a></h3><p class="match-location">${center.location}</p><p><strong>${directMatch ? 'Potential match for this condition; confirm with the center.' : 'Broader program; confirm this condition.'}</strong> ${center.note}</p></article>`;
    }).join('');
    const noMatch = match.none ? `<p class="case-note">${match.none}</p>` : '';

    output.innerHTML = `<h3>Specialties to look for</h3><p>${match.specialties}</p>${noMatch}<h3>Possible care centers</h3>${centerCards}<p class="match-disclaimer">These are starting points, not verified matches to an individual doctor. Confirm the exact malformation, body location, age group, current clinician, and referral route with the center before sharing records.</p>`;
}
