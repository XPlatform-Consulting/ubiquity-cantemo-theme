'use strict';

var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback) {
        if (MutationObserver) {
            // define a new observer
            var obs = new MutationObserver(function (mutations, observer) {
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if (eventListenerSupported) {
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
        else {
            console.log('Something went wrong in observeDOM. No \'MutationObserver\' or \'addEventListener\'.');
        }
    }
})();

window.addEventListener('DOMContentLoaded', function () {
    // this should get all the <a> elements in every mdl-menu
    // on the page that isn't part of the .mdl-menu__item class
    addMdlToMenuItems('.mdl-menu a:not(.mdl-menu__item)');
});
