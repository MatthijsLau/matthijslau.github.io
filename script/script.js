// --- GLOBALS -------------------------------------------------

const images = [
    "/assets/images/banners/banner-fisciano.png",
    "/assets/images/banners/banner-siena.png",
    "/assets/images/banners/banner-skadar.png"
];

// Initialize to a random image so the first banner is randomized
let currentImage = images[Math.floor(Math.random() * images.length)]; // renamed from randomImage to avoid conflicts

// --- Simple in-memory cache for loaded pages to avoid repeat fetches
const pageCache = Object.create(null);


// --- IMAGE HELPERS -----------------------------------------
// Preload a single image and return a promise that resolves when loaded (or rejects on error)
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        if (!src) return reject(new Error('no-src'));
        try {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(new Error('failed'));
            img.src = src;
        } catch (e) {
            reject(e);
        }
    });
}

// Read the currently-declared background URL of .banner-header (if present)
function getDeclaredBannerUrl() {
    const el = document.querySelector('.banner-header');
    if (!el) return null;
    const bg = el.style.backgroundImage || '';
    const m = bg.match(/url\(['"]?(.*?)['"]?\)/);
    return m ? m[1] : null;
}


// --- RANDOM BANNER -------------------------------------------

function randBanner() {
    // avoid repeating previous banner
    const available = images.filter(img => img !== currentImage);

    const chosen = available[Math.floor(Math.random() * available.length)];
    currentImage = chosen;

    $(".banner-header").css(
        "background-image",
        `linear-gradient(rgba(248, 247, 242, 0.2), rgba(248, 247, 242, .8)), url('${chosen}')`
    );
}


// --- PAGE LOADER ---------------------------------------------

function loadPage(file) {
    const $content = $('#content');

    // Use cached HTML if available
    if (pageCache[file]) {
        $content.html(pageCache[file]);
        return;
    }

    // Fetch, cache, then insert
    $.get(file).done(html => {
        pageCache[file] = html;
        $content.html(html);
    }).fail(() => {
        $content.html('<p>Failed to load page.</p>');
    });
}


// --- NAVIGATION HANDLING -------------------------------------

$(document).on('click', '.nav-link', function (event) {
    event.preventDefault();

    if ($(this).attr('id') === 'name') {
        randBanner();
    }

    const page = $(this).data('page') + '.html';
    loadPage(page);
});


// --- INITIAL PAGE LOAD & HTML INCLUSION -----------------------

// Load HTML snippets into elements with `data-include` and
// run initial setup (banner + page load) after all includes settle.
$(function () {
    const includes = $('[data-include]');
    if (includes.length === 0) {
        randBanner();
        loadPage('aboutme.html');
        return;
    }

    const promises = [];
    includes.each(function () {
        const $el = $(this);
        const file = $el.data('include') + '.html';
        const p = $.get(file).then(html => {
            $el.html(html);
        }).catch(() => {
            $el.html('');
        });
        promises.push(p);
    });

    Promise.all(promises).finally(() => {
        // All includes attempted; proceed with initial setup.
        // Only preload the banner image that is already declared in the DOM
        const declared = getDeclaredBannerUrl();
        if (declared) {
            preloadImage(declared).then(() => {
                // keep current background (already declared) and then load initial page
                loadPage('aboutme.html');
            }).catch(() => {
                // if preload fails, still load the page
                loadPage('aboutme.html');
            });
        } else {
            // no declared banner — fall back to running randBanner and load page
            randBanner();
            loadPage('aboutme.html');
        }
    });
});
