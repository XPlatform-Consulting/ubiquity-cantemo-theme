(function($) {

    $('html').on('click',function(e){
        // add stuff
        if ($('.cantemo-search-bar').is(e.target) || $('.cantemo-search-bar').has(e.target).length > 0 ){ // if the target of the click isn't the container nor a descendant of the container
            $('#main-row').addClass('search-active');
        }

        if($('button.cantemo-settings-button').is(e.target) || $('button.cantemo-settings-button').has(e.target).length > 0 ){
            $('.cantemo-settings-card-popup').toggleClass('active-popup');            
        }
        
        if($('button.cantemo-notifications-button').is(e.target) || $('button.cantemo-notifications-button').has(e.target).length > 0 ){
            $('.cantemo-notifications-card-popup').toggleClass('active-popup');            
        }

        // remove stuff

        if (!$('.cantemo-notifications-button').is(e.target) && !$('.cantemo-notifications-card-popup').is(e.target) && $('.cantemo-notifications-card-popup').has(e.target).length === 0 && $('.cantemo-notifications-button').has(e.target).length === 0 ){ // if the target of the click isn't the container nor a descendant of the container
            $('.cantemo-notifications-card-popup').removeClass('active-popup');
        }

        if (!$('.cantemo-search-bar').is(e.target) && $('.cantemo-search-bar').has(e.target).length === 0 ){ // if the target of the click isn't the container nor a descendant of the container
            $('#main-row').removeClass('search-active');
            // remove search content too
        }
        // close accout settigns popup 
        if (!$('.cantemo-settings-button').is(e.target) && !$('.cantemo-settings-card-popup').is(e.target) && $('.cantemo-settings-card-popup').has(e.target).length === 0 && $('.cantemo-settings-button').has(e.target).length === 0 ){ // if the target of the click isn't the container nor a descendant of the container
            $('.cantemo-settings-card-popup').removeClass('active-popup');
        }
    });
    
})(jQuery);
