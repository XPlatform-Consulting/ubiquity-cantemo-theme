'use strict';

function addMdlToMenuItems(query) {
    /**
     *  Add the 'mdl-menu__item' class to all the elements found in the query
     *  @param {string} query - CSS query
     *  @return {Boolean} - Returns false if there's no items found in the query
    **/
    var allItems = document.querySelectorAll(query);

    if (!allItems) {
        return false;
    }

    for (var i = 0; i < allItems.length; i++) {
        var item = allItems.item(i);

        item.classList.add('mdl-menu__item');
    }

    return true;
}

window.addEventListener('DOMContentLoaded', function() {
    // this should get all the <a> elements in every mdl-menu
    // on the page that isn't part of the .mdl-menu__item class
    addMdlToMenuItems('.mdl-menu a:not(.mdl-menu__item)');
});
