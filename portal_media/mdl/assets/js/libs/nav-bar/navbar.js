(function($) {

    $('html').on('click',function(e){
        if ($('.cantemo-search-bar').is(e.target) || $('.cantemo-search-bar').has(e.target).length > 0 ){ // if the target of the click isn't the container nor a descendant of the container
            $('#main-row').addClass('search-active');
        }
    });

	$('html').on('click',function(e){
        if (!$('.cantemo-search-bar').is(e.target) && $('.cantemo-search-bar').has(e.target).length === 0 ){ // if the target of the click isn't the container nor a descendant of the container
            $('#main-row').removeClass('search-active');
            // remove search content too
        }
    });
    
})(jQuery);
