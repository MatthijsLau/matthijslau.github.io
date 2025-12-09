// Banner loader: simple and without preloading logic

// List of banner images
const images = [
    '/assets/images/banners/banner-fisciano.png',
    '/assets/images/banners/banner-siena.png',
    '/assets/images/banners/banner-skadar.png',
    '/assets/images/banners/banner-sg.png',
    '/assets/images/banners/banner-blacklake.png'
];

// Track which banner is currently displayed
let currentBanner = null;

// Set the banner background immediately (no preloading or Image objects).
function setBanner(url) {
    const $banner = $('.banner-header');
    if (!$banner.length) return;
    $banner.css('background-image', "linear-gradient(rgba(248,247,242,0.5), rgba(248,247,242,0.8)), url('" + url + "')");
    currentBanner = url;
}

// Choose a random banner different from current (when possible) and set it.
function randBanner() {
    if (!images || images.length === 0) return;
    let candidates = images.filter(function (s) { return s !== currentBanner; });
    if (!candidates.length) candidates = images.slice();
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    setBanner(chosen);
}

// Load a page fragment into #content
function loadPage(file) { $('#content').load(file); }

// On ready: include header/footer fragments, then set initial banner and page.
$(function () {
    const includes = $('[data-include]');
    const jobs = [];
    includes.each(function () {
        const $el = $(this);
        const file = $el.data('include') + '.html';
        jobs.push($.get(file).then(function (html) { $el.html(html); }).catch(function () { $el.html(''); }));
    });

    Promise.all(jobs).then(function () {
        const el = document.querySelector('.banner-header');
        let declared = null;
        if (el && el.style && el.style.backgroundImage) {
            const m = el.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
            declared = m ? m[1] : null;
        }

        if (declared) setBanner(declared);
        else randBanner();

        loadPage('aboutme.html');
    }).catch(function () { randBanner(); loadPage('aboutme.html'); });
});

// Navigation: clicking .nav-link loads pages; clicking the #name link also switches banner.
$(document).on('click', '.nav-link', function (e) {
    e.preventDefault();
    const page = $(this).data('page');
    if (!page) return;
    if ($(this).attr('id') === 'name') randBanner();
    loadPage(page + '.html');
});