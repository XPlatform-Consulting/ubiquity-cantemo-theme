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

function modAdvancedSearchButton(searchReact) {
    /**
     *  Modifying the advanced search link to use a glyph (icon)
     *  @param {HTMLElement} searchReact - The React Component
     *  @return {Boolean} - Returns false if querying for the search button isn't found
    **/
    var showAdvanced = searchReact.querySelector('#show_advanced');

    if (!showAdvanced) {
        return false;
    }

    showAdvanced.classList.add('mdl-button', 'mdl-js-button', 'mdl-button--icon');
    showAdvanced.textContent = '';

    var icon = createIcon('expand_more');

    showAdvanced.appendChild(icon);

    componentHandler.upgradeElement(showAdvanced);

    return true;
}

function modSearchButton(searchReact) {
    /**
     *  Modifying the search button to use a glyph (icon)
     *  @param {HTMLElement} searchReact - The React Component
     *  @return {Boolean} - Returns false if querying for the search button isn't found
    **/
    var searchButton = searchReact.querySelector('#searchinputbutton');

    if (!searchButton) {
        return false;
    }

    var iconWrap = document.createElement('label');
    iconWrap.classList.add('mdl-button', 'mdl-js-button', 'mdl-button--icon');
    iconWrap.setAttribute('for', 'searchinputbutton');

    var icon = createIcon('search');

    iconWrap.appendChild(icon);
    searchButton.parentElement.appendChild(iconWrap);

    componentHandler.upgradeElement(searchButton);

    return true;
}

function createIcon(iconName) {
    /**
     *  Helper function for creating an icon for material-icons
     *  @param {string} iconName - The icon name from material-icons
     *  @return {HTMLElement} icon - Returns the new element for the iconName
    **/
    var icon = document.createElement('i');
    icon.classList.add('material-icons');
    icon.textContent = iconName;

    return icon;
}

function cloneNodeDiffTag(orgElement, tagName) {
    /**
     *  Clone an element but using a different tag name instead,
     *  eg input -> button reason: i need the input to use a glyph but input can't handle glyphs
     *  @param {HTMLElement} orgElement - The original element to clone from
     *  @param {string} tagName - The tag name for the new element
     *  @return {false|HTMLElement} newElement - Returns false if @param orgElement isn't an HTMLElement object
    **/
    if (! orgElement instanceof HTMLElement) {
        return false;
    }

    var newElement = document.createElement(tagName);
    for (var i = 0; i < orgElement.attributes.length; ++i) {
        var nodeName  = orgElement.attributes.item(i).nodeName;
        var nodeValue = orgElement.attributes.item(i).nodeValue;

        newElement.setAttribute(nodeName, nodeValue);
    }

    newElement.innerHTML = orgElement.innerHTML;

    // could be dangerous
    orgElement.parentElement.replaceChild(newElement, orgElement);

    return newElement;
}

window.addEventListener('load', function () {
    // this eventlistner is for modifying react components because they are available in the load state
    var searchReact = document.getElementById('react-search-form');

    if (!searchReact) {
        return false;
    }

    modSearchButton(searchReact);

    modAdvancedSearchButton(searchReact);

    // Observe a specific DOM element:
    observeDOM(document.querySelector('.searchform'), function () {
        console.log('.searchform dom changed');

        var options = searchReact.querySelectorAll('.searchcritera ul li.choice_wrapper .field_container');

        if (!options.length) {
            return;
        }

        for (var i = 0; i < options.length; i++) {
            var fieldContainer = options.item(i);

            if ( fieldContainer.tagName != 'LABEL' || !fieldContainer.classList.contains('mdl-radio') ) {
                fieldContainer = cloneNodeDiffTag(fieldContainer, 'label');

                fieldContainer.classList.add('mdl-radio', 'mdl-js-radio', 'mdl-js-ripple-effect');
                fieldContainer.setAttribute('for', fieldContainer.firstElementChild.id);
            }

            for (var j = 0; j < fieldContainer.children.length; j++) {
                var item = fieldContainer.children.item(j);

                if (item.tagName == 'LABEL') {
                    item = cloneNodeDiffTag(item, 'span');
                    item.classList.add('mdl-radio__label');
                }

                if (item.tagName == 'INPUT') {
                    item.classList.add('mdl-radio__button');
                }
            }

            componentHandler.upgradeElement(fieldContainer);
        }
    });
});
