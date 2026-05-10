const ICONS = {
    file: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9V3.5L18.5 9H13z"/></svg>',
    github: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    video: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>'
};

const METHODS = [
    {
        name: 'Benchmark design',
        description: 'Operationalize AI capabilities and risks as tasks, datasets, scoring protocols, and validation checks.',
        match: ['benchmark design']
    },
    {
        name: 'Synthetic scenario generation',
        description: 'Create controlled, realistic cases that stress-test model behavior where natural data is sparse.',
        match: ['synthetic scenario generation']
    },
    {
        name: 'Rubric-based LLM judging',
        description: 'Use structured rubrics to inspect risk type, severity, rationale, and agent behavior at scale.',
        match: ['rubric-based LLM judging']
    },
    {
        name: 'Human-subjects studies',
        description: 'Measure how people interpret, verify, trust, and act on AI outputs in realistic workflows.',
        match: ['human-subjects studies']
    },
    {
        name: 'Hypothesis-driven analysis',
        description: 'Turn claims about model or human behavior into empirical comparisons with interpretable outcomes.',
        match: ['hypothesis-driven empirical analysis', 'hypothesis-driven analysis']
    }
];

function externalLink(href, label, icon = '') {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${icon}${label}</a>`;
}

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function publicationId(pub) {
    return `publication-${slugify(pub.title)}`;
}

function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function markdownLinkToHtml(label, href) {
    const orgMarks = {
        'University of Washington': { className: 'uw-logo-inline', src: 'uw-logo.png' },
        'UC Berkeley': { className: 'berkeley-logo-inline', src: 'berkeley-logo.png' }
    };
    const orgMark = orgMarks[label];
    const className = orgMark ? ' class="inline-org-link"' : '';
    const icon = orgMark ? `<img src="${orgMark.src}" alt="" class="inline-org-logo ${orgMark.className}" aria-hidden="true">` : '';
    const labelHtml = orgMark ? `<span>${label}</span>` : label;
    return `<a href="${href}"${className} target="_blank" rel="noopener noreferrer">${icon}${labelHtml}</a>`;
}

function markdownToHtml(text) {
    return text
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => markdownLinkToHtml(label, href))
        .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^\*]+)\*/g, '<em>$1</em>');
}

function formatAuthors(authors) {
    if (!Array.isArray(authors)) {
        return authors || '';
    }
    return authors.map((author) => {
        if (author === 'Ruoxi Shang' || author === 'Ruoxi Shang*') {
            return author.replace('Ruoxi Shang', '<strong>Ruoxi Shang</strong>');
        }
        return author;
    }).join(', ');
}

function formatVenue(pub) {
    let venue = '';
    if (pub.status === 'in_submission' && !pub.venue) {
        venue = 'arXiv';
    } else if (pub.venue) {
        venue = pub.venue;
    }
    if (venue && pub.year) {
        return venue.includes(String(pub.year)) ? `${venue}` : `${venue}, ${pub.year}`;
    }
    if (venue) {
        return venue;
    }
    return pub.year || '';
}

function thumbnailFor(pub) {
    if (pub.thumbnail) {
        return pub.thumbnail.startsWith('figures/') ? pub.thumbnail : `figures/${pub.thumbnail}`;
    }
    if (!pub.title) {
        return 'figures/thumbnail.png';
    }
    const firstWord = pub.title.split(/[\s:]+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    let venueShort = 'arxiv';
    if (pub.venue) {
        venueShort = pub.venue.split(/[\s\d]/)[0].toLowerCase().replace(/[^a-z]/g, '');
    }
    const year = pub.year || 'ongoing';
    return `figures/${firstWord}-${venueShort}-${year}.png`;
}

function buildPublicationLinks(pub) {
    const links = [];
    if (pub.pdf) links.push(externalLink(`pdf/${pub.pdf}`, 'PDF', ICONS.file));
    if (pub.doi_or_url) {
        const label = pub.doi_or_url.includes('doi.org') ? 'DOI' : 'Link';
        links.push(externalLink(pub.doi_or_url, label));
    }
    if (pub.arxiv) links.push(externalLink(pub.arxiv, 'arXiv'));
    if (pub.github) links.push(externalLink(pub.github, 'GitHub', ICONS.github));
    if (pub.video) links.push(externalLink(pub.video, 'Video', ICONS.video));
    return links.length ? `<div class="publication-links">${links.join('')}</div>` : '';
}

function shortPublicationTitle(pub) {
    const title = pub.title || '';
    if (title.startsWith('Mimetic Alignment')) return 'ASPECT';
    if (title.startsWith('BLADE')) return 'BLADE';
    if (title.startsWith('Trusting')) return 'AI Trust Scale';
    if (title.startsWith('How Do Analysts')) return 'AI-Assisted Data Analysis';
    if (title.startsWith('Pluralistic Peer Review')) return 'Pluralistic Peer Review';
    if (title.startsWith('Creative Stimuli')) return 'Creative Stimuli';
    if (title.startsWith('Rethinking Teaching')) return 'Teaching Evaluation Reports';
    if (title.startsWith('Understanding Lay Users')) return 'Counterfactual Explanations';
    if (title.startsWith('PaperTok')) return 'PaperTok';
    return title.split(':')[0].replace(/^"|"$/g, '');
}

function renderPublication(pub) {
    const note = pub.notes ? ` <span class="publication-note">${pub.notes}</span>` : '';
    const methodsAttr = (pub.methods || []).map((m) => slugify(m)).join(' ');
    return `
        <li class="publication-item" id="${publicationId(pub)}" data-methods="${methodsAttr}">
            <img src="${thumbnailFor(pub)}" alt="${pub.title}" class="publication-thumbnail" loading="lazy" onerror="this.src='figures/thumbnail.png'">
            <div class="publication-content">
                <div class="publication-title">${pub.title}</div>
                <div class="publication-authors">${formatAuthors(pub.authors)}${note}</div>
                <div class="publication-meta">${formatVenue(pub)}</div>
                ${buildPublicationLinks(pub)}
            </div>
        </li>
    `;
}

function loadIntro() {
    const intro = document.getElementById('intro-text');
    if (!intro) return;
    return fetch('intro.txt')
        .then((response) => response.text())
        .then((data) => {
            const paragraphs = data.trim().split('\n\n');
            intro.classList.remove('loading');
            intro.innerHTML = paragraphs.map((paragraph) => `<p>${markdownToHtml(paragraph)}</p>`).join('');
        })
        .catch(() => {
            intro.classList.remove('loading');
            intro.innerHTML = '<p>Welcome to my personal website.</p>';
        });
}

function loadNews() {
    const list = document.getElementById('news-list');
    const expandButton = document.getElementById('news-expand-btn');
    if (!list) return;
    fetch('news.json')
        .then((response) => response.json())
        .then((items) => {
            list.innerHTML = items.map((item, index) => `
                <li${index >= 5 ? ' class="hidden-news"' : ''}>
                    <time>${item.date}</time>
                    <span>${markdownToHtml(item.text)}</span>
                </li>
            `).join('');

            if (expandButton && items.length > 5) {
                expandButton.style.display = 'inline-block';
                expandButton.addEventListener('click', () => {
                    const hiddenItems = list.querySelectorAll('.hidden-news');
                    const isExpanded = expandButton.dataset.expanded === 'true';
                    hiddenItems.forEach((item) => {
                        item.style.display = isExpanded ? 'none' : 'grid';
                    });
                    expandButton.dataset.expanded = String(!isExpanded);
                    expandButton.textContent = isExpanded ? 'Show all news' : 'Show less';
                });
            }
        })
        .catch(() => {
            list.innerHTML = '<li class="empty-state">No news available.</li>';
        });
}

function loadPublications() {
    const list = document.getElementById('publications-list');
    if (!list) return Promise.resolve(null);
    return fetch('publications.json')
        .then((response) => response.json())
        .then((publications) => {
            const mode = list.dataset.mode || 'featured';
            const visiblePublications = mode === 'featured'
                ? publications.filter((pub) => pub.featured === true)
                : publications;
            list.innerHTML = visiblePublications.map(renderPublication).join('');
            return publications;
        })
        .catch(() => {
            list.innerHTML = '<li class="empty-state">Publications coming soon.</li>';
            return null;
        });
}

function setupMethodKeywords(publications) {
    const intro = document.getElementById('intro-text');
    if (!intro || !publications) return;

    let html = intro.innerHTML;
    METHODS.forEach((method) => {
        for (const phrase of method.match) {
            const regex = new RegExp(`(${escapeRegExp(phrase)})`, 'i');
            if (regex.test(html)) {
                html = html.replace(
                    regex,
                    `<span class="method-keyword" data-method="${method.name}" tabindex="0" role="button">$1</span>`
                );
                break;
            }
        }
    });
    intro.innerHTML = html;

    const list = document.getElementById('publications-list');
    let activeMethod = null;

    const clearHighlight = () => {
        activeMethod = null;
        document.querySelectorAll('.method-keyword.is-active').forEach((k) => k.classList.remove('is-active'));
        if (!list) return;
        delete list.dataset.highlight;
        list.querySelectorAll('.publication-item').forEach((item) => {
            item.classList.remove('is-related', 'is-flashing');
        });
    };

    const applyHighlight = (methodName, keywordEl) => {
        activeMethod = methodName;
        document.querySelectorAll('.method-keyword.is-active').forEach((k) => k.classList.remove('is-active'));
        if (keywordEl) keywordEl.classList.add('is-active');
        if (!list) return;

        list.dataset.highlight = methodName;
        const slug = slugify(methodName);
        list.querySelectorAll('.publication-item').forEach((item) => {
            const methods = (item.dataset.methods || '').split(' ');
            const isRelated = methods.includes(slug);
            item.classList.toggle('is-related', isRelated);
            item.classList.remove('is-flashing');
            if (isRelated) {
                // force reflow so the animation can re-trigger on repeat clicks
                void item.offsetWidth;
                item.classList.add('is-flashing');
            }
        });

        const rightPanel = document.querySelector('.right-panel');
        const firstMatch = list.querySelector('.publication-item.is-related');
        if (rightPanel && firstMatch) {
            const offset = firstMatch.offsetTop - 64;
            rightPanel.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
        }
    };

    document.querySelectorAll('.method-keyword').forEach((keyword) => {
        const handle = (event) => {
            event.preventDefault();
            const methodName = keyword.dataset.method;
            if (activeMethod === methodName) {
                clearHighlight();
            } else {
                applyHighlight(methodName, keyword);
            }
        };
        keyword.addEventListener('click', handle);
        keyword.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                handle(event);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && activeMethod) {
            clearHighlight();
        }
    });
}

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const image = lightbox.querySelector('img');

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('publication-thumbnail')) {
            image.src = event.target.src;
            image.alt = event.target.alt;
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
        }
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupLightbox();
    loadNews();
    Promise.all([loadIntro(), loadPublications()]).then(([_, publications]) => {
        if (document.getElementById('intro-text') && publications) {
            setupMethodKeywords(publications);
        }
    });
});
