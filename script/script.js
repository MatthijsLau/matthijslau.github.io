$(function () {
    var includes = $('[data-include]')
    $.each(includes, function () {
        var file = $(this).data('include') + '.html'
        $(this).load(file)
    })
})

$(function () {
    $('[data-include]').each(function () {
        const file = $(this).data('include') + '.html';
        $(this).load(file);
    });
});

$(document).on('click', '.nav-link', function (e) {
    e.preventDefault();
    const page = $(this).data('page');
    loadPage(page + '.html');
});

function loadPage(file) {
    $('#content').load(file);
}

$(window).on('load', function () {
    loadPage('aboutme.html');
});