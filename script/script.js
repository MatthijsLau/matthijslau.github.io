// Load HTML snippets from data-include attributes
$(function () {
    $('[data-include]').each(function () {
        const file = $(this).data('include') + '.html';
        $(this).load(file);
    });
});

// Load page into #content
function loadPage(file) {
    $('#content').load(file);
}

// Navigation clicks
$(document).on('click', '.nav-link', function (e) {
    e.preventDefault();
    const page = $(this).data('page') + '.html';
    loadPage(page);
});

// Initial page load + random banner
$(window).on('load', function () {

    const images = [
        "/assets/images/banners/banner-fisciano.png",
        "/assets/images/banners/banner-siena.png",
        "/assets/images/banners/banner-skadar.png"
    ];

    const randomImage = images[Math.floor(Math.random() * images.length)];

    $(".banner-header").css("background-image",
        `linear-gradient(rgba(248, 247, 242, 0.5), rgba(248, 247, 242, 0.8)), url('${randomImage}')`
    );

    // Load default page
    loadPage('aboutme.html');
});
