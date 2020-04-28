import * as $ from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import '@scss/main.scss'

import '../js/babel'

$(function() {

    $(document).ready(function() {

        //preloader
        setTimeout(function() {
            var preloader = $('#page-preloader');
            if ( !preloader.hasClass('done') ) {
                preloader.addClass('done');
            }
        }, 1000);

        //mobile menu expand
        $('.header').on('click', '.header__nav-toggle', function(){
            let header_menu = $(this).closest('.header').find('.header-menu');
            if ( $('.header').hasClass('expand') ) {
                header_menu.slideUp(300);
                setTimeout(function() {
                    $('.header').removeClass('expand');
                }, 300);
            } else {
                header_menu.slideDown(300);
                $('.header').addClass('expand');
            }
        });

        //upload photo
        $('.custom-file-input').on('change', function(){
            $('.profile-photo__img').show();
        });


        //slider on mobile
        $('.owl-carousel').owlCarousel({
            items: 1
        });

        //gallery on desktop
        $('.user-profile__gallery').on('click', '.user-profile__gallery-img', function(){
            var url = $(this).css('background-image');
            url = url.replace('url(','').replace(')','').replace(/\"/gi, "");
            $('.user-profile__image').css('background-image', 'url(' + url + ')');
        });

    });


});