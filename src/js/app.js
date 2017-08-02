/*----------- slick slider init -------------*/
$(document).ready(function () {
    if($().slick === undefined) return;

    $('.js_slick_slider').slick({
        dots: true,
        arrows: false,
        fade: true,
        autoplay: true,
        autoplaySpeed: 8000
    });
});

/*----------- slick slider gallery view -------------*/
var galleryToggleDuration = 540;
function gallerySlickToggle() {
    $('.media_holder').addClass('fade_out');

	setTimeout(function() {
		$('.media_holder').removeClass('fade_out');
	}, galleryToggleDuration);

	setTimeout(function () {
	    $(window).resize();
	}, galleryToggleDuration - 100);
}

$('.js_gallery_toggle').on('click', function() {
    if($('html').attr('data-gallery') == 'animating') { }
    else {
		if ($('html').hasClass('gallery_view')) {
			$('html').removeClass('gallery_view')
			gallerySlickToggle();
		} else {
			$('html').addClass('gallery_view')
			gallerySlickToggle();
		}
		$('html').attr('data-gallery', 'animating')

		setTimeout(function() {
			$("html[data-gallery='animating'").attr('data-gallery', '');
		}, galleryToggleDuration);
	}
});

function historyPushState(target) {
	if(history.pushState) history.pushState(null, null, target);
	else location.hash = target;
}

/*----------- scroll link function -------------*/
function scrollLinker() {
    $(".js_scroll_link").click(function () {
        var scroll_distance,
            target = $(this).attr("href");

		if(target == "#home") scroll_distance = 0;
        else {
		    scroll_distance = $(target).offset().top - $('.site_header').height() - 30;
		}
		$('html, body').animate({
			scrollTop: scroll_distance
		}, 600);
		return false;
	});
}

$(document).ready(scrollLinker);

/*----------- nav click in page scroll -------------*/
$(".site_header .dropdown a").click(function () {
    var page = window.location.pathname,
        pageNoHash = page.substring(0, page.indexOf('#')),
        href = $(this).attr("href"),
        scroll_distance;

	if(href.indexOf(page) !== -1) {
	    var target = href.substring(href.lastIndexOf('#'));

        if(target == "#home") scroll_distance = 0;
        else {
            scroll_distance = $(target).offset().top - $('.site_header').height() - 30;
        }
        $('html, body').animate({
        	scrollTop: scroll_distance
        }, 600);

		// change url
	    historyPushState(target);
		return false;
	} 
});

/*----------- side nav active class show hide -------------*/
/* function listAnchorActiveToggle() {
    if ($(this).hasClass('is_active')) {}
    else{
		$(this).closest('ul').find('a').removeClass('is_active')
		$(this).addClass('is_active')
	}
} */

$('.side_nav ul a').on("click",function(e){
    //	listAnchorActiveToggle.call(this);

    // Hook up to slick slider for matching principals photo
    if(window.location.pathname.indexOf('/principals') !== -1) {
        if (e.target.href.indexOf('section1') !== -1) $('.js_slick_slider').slick('slickGoTo', 0);
        else if (e.target.href.indexOf('section2') !== -1) $('.js_slick_slider').slick('slickGoTo', 1);
        else if (e.target.href.indexOf('section3') !== -1) $('.js_slick_slider').slick('slickGoTo', 2);
    }
	historyPushState($(this).attr('href'))
});

/*----------- page change - fixed header link  -------------*/
function hashCheckAndScroll() {
	if(window.location.hash) {
	    var targetHash = window.location.hash;
	    var $target = $(targetHash);
	    if ($target.length === 0) return;
		var scroll_distance;

		//change active side nav item
		$('.side_nav ul a').removeClass('is_active');
		$('.side_nav ul a[href=\"' + targetHash + '\"]').addClass('is_active');

		if(targetHash == "#home") scroll_distance = 0;
		else {
		    scroll_distance = $target.offset().top - $('.site_header').height() - 30;
		}

        $(window).scrollTop(scroll_distance);
    }
}

$(document).ready(function() {
    hashCheckAndScroll();
});

$('.js_menu_toggle').on('click', function() {
    $('html').toggleClass('show_menu');
});

/*----------- show / hide post content -------------*/
function addPostContent() {
	var title = $(this).closest('.news_block').find('.news_content_hidden .news_title').html();
	var date = $(this).closest('.news_block').find('.news_content_hidden .news_date').html();
	var content = $(this).closest('.news_block').find('.news_content_hidden .news_content').html();
	$('.post_content .news_title').html(title);
	$('.post_content .news_date').html(date);
	$('.post_content .news_content').html(content);
	window.location.hash = title.replace(/\s/g, '');
}

$('.js_show_post').on('click', function() {
    $('html').addClass('show_post');
	addPostContent.call(this);
});

$('.js_hide_post').on('click', function() {
    $('html').removeClass('show_post');
});

//if(document.referrer.indexOf('/' + window.location.hostname) !== -1) {
//    document.documentElement.classList.add('selfRefer');
//}

//window.addEventListener('beforeunload', function (e) {
  //  $(document.documentElement).addClass('unload');
//});

$(document).ready(function () {
    var loc = window.location;
    $(document.documentElement).addClass('ready');

    fE.sectionControl.visChangePolicy = function (sec) {
        if (sec.bVisible) $(sec.e).addClass('in_view');

        // Side menu highlighting
        for (var i = 0; i < this.sections.length; i++) {
            if (this.sections[i].bVisible) {
                $('.js_scroll_link').removeClass('is_active');

                // Avoid processing side nav links when scrolling through about-us timeline
                if($(this.sections[i].e).is('li')) {
                    $(".js_scroll_link[href='#section4']").addClass('is_active');
                    return;
                }

                // General page sections
                $(".js_scroll_link[href='#" + this.sections[i].id  + "']").addClass('is_active');
                return;
            }
        }
    };

    fE.sectionControl.add($('#section1, #section2, #section3, #section4, #section5, #section6'));

    // About us page
    if(loc.pathname.indexOf('/about') !== -1) {
        fE.sectionControl.add($('.timeline li'));
    }

    // News page
    else if(loc.pathname.indexOf('/news') !== -1) {
        if(loc.hash !== '' && loc.hash !== '#') {
            var $h2,
                $newsBlocks = $('.news_block'),
                hash = loc.hash.substr(1),
                title;

            for(var i = 0; i < $newsBlocks.length; i++) {
                $h2 = $newsBlocks.eq(i).find('h2');
                title = $h2.html().replace(/\s/g, '');
                if(title === hash) {
                    addPostContent.call($h2);
                    $('html').addClass('show_post');
                    break;
                }
            }
        }
    }

    else if (loc.pathname.indexOf('/principals') !== -1) {
        $('.js_slick_slider').slick('pause');
    }
});

/* FlameEngine (Lite). 1.05. Flaming Bucket App Engine Lite.
Edward Cant. opticswerve.com. @opticswerve. */

'use strict';

/*------------|
| FlameEngine |
|------------*/
var fE = new function () {
    this.addModule = function (module) {
        fE[module.id.substr(0, 1).toLowerCase() + module.id.substr(1)] = module;
    };
};

/* SectionControl 0.45. Viewport intersection processing.
Optic Swerve. opticswerve.com. @opticswerve. */

/*---------------+
| SectionControl |
+---------------*/
function SectionControl() {
    this.id = 'SectionControl';
    this.sections = [];

    $(document).ready(function () {
        fE.sectionControl.resize();
    });

    window.addEventListener('load', function () {
        fE.sectionControl.resize();
    });

    window.addEventListener('resize', function () {
        fE.sectionControl.resize();
    });

    window.addEventListener('scroll', function () {
        fE.sectionControl.process();
    });
}

SectionControl.prototype = {
    destroy: function () { },

    add: function (elements) {
        var e, i = 0;

        elements.addClass('sec_control');

        for (; i < elements.length; i++) {
            e = elements[i];

            this.sections.push({
                bVisible: undefined,
                e: e,
                height: 0,
                id: e.id,
                pageX: 0,
                pageY: 0,
                stage: -1,
                width: 0
            });
        }
    },

    process: function () {
        var self = this,
        bVisible,
        clientHeight = document.documentElement.clientHeight,
        eViewX,
        eViewY,
        pageX = window.pageXOffset,
        pageY = window.pageYOffset,
        sec,
        sections = self.sections,
        i = sections.length;

        while (i--) {
            sec = sections[i];
            eViewX = sec.pageX - pageX;
            eViewY = sec.pageY - pageY;

            bVisible = sec.bVisible;
            sec.bVisible = false;

            // Section BEFORE viewport
            if (eViewY + sec.height <= 0) sec.stage = 1;

                // Section AFTER viewport
            else if (eViewY > clientHeight) sec.stage = -1;

                // Section VISIBLE
            else {
                sec.bVisible = true;
                sec.stage = (clientHeight - eViewY) / (sec.height + clientHeight);
                if (self.visPolicy !== undefined) self.visPolicy(sec);
            }

            // Visibility change
            if (bVisible !== sec.bVisible) self.visChangePolicy(sec);
        }
    },

    resize: function () {
        var self = this,
        clientRect,
        i = self.sections.length,
        pageXOffset = window.pageXOffset,
        pageYOffset = window.pageYOffset,
        sec;

        // Cache section position, dimensions.
        while (i--) {
            sec = self.sections[i];
            clientRect = sec.e.getBoundingClientRect();
            sec.pageX = clientRect.left + pageXOffset;
            sec.pageY = clientRect.top + pageYOffset;
            sec.height = clientRect.bottom - clientRect.top;
            sec.width = clientRect.right - clientRect.left;
        }

        self.process();
        if (self.resizePolicy !== undefined) self.resizePolicy();
    }
};

fE.addModule(new SectionControl());