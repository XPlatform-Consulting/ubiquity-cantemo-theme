window.addEventListener('DOMContentLoaded', function() {
    /*
    var mediabin = document.querySelector('#mediabin-tab-show.mediabin-tab');
    mediabin.addEventListener('click', function() {
        cntmo.app.page.mediaBin.toggle();
    });

    var advancedSearchButton = document.querySelector('#show_advanced');
    advancedSearchButton.addEventListener('click', function() {
        var advancedSearch = document.querySelector('#advanced-search-card');
        advancedSearch.style.display = (advancedSearch.style.display == 'none' ? 'block' : 'none');
    });


    // originally from search/search_advanced.html, button for clear form,onclick attr
    var clearAdvancedForm = document.querySelector('#clear-advanced-form');
    clearAdvancedForm.addEventListener('click', function() {
        var r = confirm('{% trans "Are you sure you wish to clear this form?" %}');
        if (r == true) {
            try {
                SelectBox.move_all('crit_userchooser_to', 'crit_userchooser_from');
            } catch (e) {
                console.log('clearAdvancedForm button click event: ' + e);
            }
            try {
                $('#advancedsearchform .smartselectbox').data().SmartSelectBox.removeAll();
            } catch (e) {
                console.log('clearAdvancedForm button click event: ' + e);
            };
        } else {
            return false;
        }
    });

    // originally from search/search_results_form.html
    $('#searchform').submit(function () {
        $('#searchinputfield').autocomplete('close');
    });
    $('#searchinputfield').autocomplete({
        source: '{% url search:suggest %}'
    }).bind('autocompleteopen', function (event, ui) {
        $(this).autocomplete('widget').addClass('searchinputfieldautocomplete');
    });
    */
});
