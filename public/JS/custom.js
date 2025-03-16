$(document).ready(function() {
    // go to top button
    $(window).on("scroll", function(event) {
        if ($(this).scrollTop() > 600) {
            $(".back-to-top").fadeIn(200);
        } else {
            $(".back-to-top").fadeOut(200);
        }
    });
    $(".back-to-top").on("click", function(event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, '300');
    });

    // cart drawer js
    jQuery(function($) {
        $('.js-menu__open').on('touchend click', function() {
            var menu = $(this).attr('data-menu');
            $(menu).toggleClass('js-menu__expanded');
            $(menu).parent().toggleClass('js-menu__expanded');
        });

        $('.js-menu__context, .js-menu__close').on('touchend click', function(event) {
            if ($(event.target).hasClass('js-menu__context') || $(event.target).hasClass('js-menu__close')) {
                $('.js-menu__expanded').removeClass('js-menu__expanded');
            }
        });
    });

    // shop by cetegory//

    $('.product_catagery').each(function(i) {
        var main_category_slider = $(this).find('.category-sider').addClass('slide-number-' + (i + 1));
        var main_category_slider_arrow = $(this).find('.product_catagery_svg .slick-category-sider').addClass('product_catagery_' + (i + 1));
        $(main_category_slider).slick({
            slidesToShow: 7,
            slidesToScroll: 1,
            autoplay: !0,
            autoplaySpeed: 3000,
            arrows: !0,
            dots: !1,
            infinite: !1,
            appendArrows: $(main_category_slider_arrow),
            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></button>',
            responsive: [
                { breakpoint: 1250, settings: { slidesToShow: 6, slidesToScroll: 1 } },
                { breakpoint: 992, settings: { slidesToShow: 5, slidesToScroll: 1 } },
                { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
                { breakpoint: 576, settings: { slidesToShow: 2, slidesToScroll: 1 } },
                { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            ],
        });
    });

    // banner-1///
    $(".banner_slider").slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: !0,
        arrows: !0,
        dots: !1,
        infinite: !1,
        appendArrows: $(".slick_banner_arrow"),
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></svg></button>',
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 800, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    });




    //  hot trending product slider//
    $(".hot_trending_product").slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: !0,
        autoplaySpeed: 3000,
        arrows: !0,
        dots: !1,
        infinite: !1,
        appendArrows: $(".slick-hot_arrow"),
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></button>',
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 6, slidesToScroll: 1 } },
            { breakpoint: 1199, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    });


    $(".hot_trending_product-2").slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: !0,
        autoplaySpeed: 3000,
        arrows: !0,
        dots: !1,
        infinite: !1,
        appendArrows: $(".slick-hot_arrow-2"),
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></button>',
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 6, slidesToScroll: 1 } },
            { breakpoint: 1199, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    });

    //  feature product slider//
    $(".feature_product_slider").slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: !0,
        autoplaySpeed: 3000,
        arrows: !0,
        dots: !1,
        infinite: !1,
        appendArrows: $(".slick-brand_arrow"),
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></button>',
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 6, slidesToScroll: 1 } },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: true,
                    loop: true
                }
            },
            { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    });

    $(".deal-product-slider").slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: !0,
        autoplaySpeed: 3000,
        arrows: !0,
        dots: !1,
        infinite: !1,
        appendArrows: $(".slick-deal-product"),
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></button>',
        responsive: [
            { breakpoint: 1199, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    });


    $(".feature-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: !0,
        rows: 3,
        autoplaySpeed: 3000,
        arrows: !0,
        dots: !1,
        infinite: !1,
        appendArrows: $(".slick-feature"),
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></button>',
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 1199, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    });
    // leatest blog slider//
    $(".blog_slider").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: !0,
        autoplaySpeed: 2000,
        arrows: !0,
        dots: !1,
        infinite: !1,
        appendArrows: $(".slick-brand"),
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></button>',
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 1199, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    });

    // brand logo //    
    $(".brand-bar").slick({
        slidesToShow: 7,
        slidesToScroll: 3,
        autoplay: !0,
        autoplaySpeed: 2000,
        arrows: !0,
        dots: !1,
        infinite: !1,
        appendArrows: $(".slick-logo"),
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></button>',
        responsive: [
            { breakpoint: 1199, settings: { slidesToShow: 5, slidesToScroll: 1 } },
            { breakpoint: 992, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        ],
    });

    $(".related-product-real").slick({
        slidesToShow: 3,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        dots: true,
        infinite: true,
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 1199, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    });

    $(".releted-product-slider").slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        infinite: true,
        appendArrows: $(".slick-related-product"),
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></button>',
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 6, slidesToScroll: 1 } },
            { breakpoint: 1199, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    });

    $(".recently-product-slider2").slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        infinite: true,
        appendArrows: $(".slick-recently-product"),
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="txt_blue feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></button>',
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 6, slidesToScroll: 1 } },
            { breakpoint: 1199, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    });

    // mobile menu toggle js
    if ($(window).width() <= 991) {
        $(".navbar__menu li.has-mega-menu").click(function() {
            $(".navbar__menu li.has-mega-menu").removeClass("open-menu");
            $(this).toggleClass("open-menu");
        });
    }

    // login/register page js
    const sign_in_btn = $('#sign-in-btn');
    const sign_up_btn = $('#sign-up-btn');
    const container = $('.container');

    sign_up_btn.click(() => {
        container.addClass('sign-up-mode');
    });

    sign_in_btn.click(() => {
        container.removeClass('sign-up-mode');
    });



    // number count for stats, using jQuery animate
    $('.counting').each(function() {
        var $this = $(this),
            countTo = $this.attr('data-count');
        $({ countNum: $this.text() }).animate({
            countNum: countTo
        }, {
            duration: 5000,
            easing: 'linear',
            step: function() {
                $this.text(Math.floor(this.countNum));
            },
            complete: function() {
                $this.text(this.countNum);
            }
        });
    });

    // JS for Price Range slider
    const rangeInput = document.querySelectorAll(".range-input input"),
        priceInput = document.querySelectorAll(".price-input input"),
        range = document.querySelector(".price-slider .progress");
    let priceGap = 1000;

    priceInput.forEach((input) => {
        input.addEventListener("input", (e) => {
            let minPrice = parseInt(priceInput[0].value),
                maxPrice = parseInt(priceInput[1].value);

            if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
                if (e.target.className === "input-min") {
                    rangeInput[0].value = minPrice;
                    range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
                } else {
                    rangeInput[1].value = maxPrice;
                    range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
                }
            }
        });
    });
    rangeInput.forEach((input) => {
        input.addEventListener("input", (e) => {
            let minVal = parseInt(rangeInput[0].value),
                maxVal = parseInt(rangeInput[1].value);

            if (maxVal - minVal < priceGap) {
                if (e.target.className === "range-min") {
                    rangeInput[0].value = maxVal - priceGap;
                } else {
                    rangeInput[1].value = minVal + priceGap;
                }
            } else {
                priceInput[0].value = minVal;
                priceInput[1].value = maxVal;
                range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
            }
        });
    });

    // quantity button js
    var input = document.querySelector('#qty');
    var btnminus = document.querySelector('.qtyminus');
    var btnplus = document.querySelector('.qtyplus');
    if (input !== undefined && btnminus !== undefined && btnplus !== undefined && input !== null && btnminus !== null && btnplus !== null) {

        var min = Number(input.getAttribute('min'));
        var max = Number(input.getAttribute('max'));
        var step = Number(input.getAttribute('step'));

        function qtyminus(e) {
            var current = Number(input.value);
            var newval = (current - step);
            if (newval < min) {
                newval = min;
            } else if (newval > max) {
                newval = max;
            }
            input.value = Number(newval);
            e.preventDefault();
        }

        function qtyplus(e) {
            var current = Number(input.value);
            var newval = (current + step);
            if (newval > max) newval = max;
            input.value = Number(newval);
            e.preventDefault();
        }
        btnminus.addEventListener('click', qtyminus);
        btnplus.addEventListener('click', qtyplus);
    }

});