$(document).ready(function() {
    fitternity.createCarousel('mumbaiservices', 'mumbaiservices-controls', '', true, false);
    fitternity.createCarousel('puneservices', 'puneservices-controls', '', true, false);
    fitternity.createCarousel('bangaloreservices', 'bangaloreservices-controls', '', true, false);
    fitternity.createCarousel('delhiservices', 'delhiservices-controls', '', true, false);
    fitternity.createCarousel('blogs', 'blogs-controls', '', true, false);
    if (window.innerWidth > 768) {} else {
        fitternity.createCarousel('celeb', 'celeb-controls', '', true, false);
    }
    // Each review rating
    $.each($('.reviewrate'), function() {
        $(this).rateYo({
            rating: $(this).attr("data-rating"),
            starWidth: "20px",
            readOnly: true,
        });
    });
    $('.excerpt').readmore({
        speed: 75,
        lessLink: '<a href="#">Read less</a>'
    });
});