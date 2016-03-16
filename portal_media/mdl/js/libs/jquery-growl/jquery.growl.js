/**
 *  Modified jquery.growl.js from Cantemo Core theme
 *
 *  The original code had a possible XSS vulnerability that could be exploited
 *
 *  Original Author: Unknown
 *  Modified by: Jared Smith <jared@highwaythreesolutions.com>
 */
! function ($) {
    function create(rebuild) {
        var instance = document.getElementById("growlDock");

        if ( !instance || rebuild ) {
            instance = $('<div></div').attr("id", "growlDock").addClass("growl");
            $("body").append(instance);
        }

        return $(instance);
    }

    function addStyleSheet() {
        if ( !document.querySelector('#growl-style') ) {
            var style = document.createElement('style');
            style.id = 'growl-style';
            var css = `
                #growlDock {
                    position: fixed;
                    top: 56px;
                    right: 10px;
                    z-index: 11000;
                }
                #growlDock > div {
                    display: flex;
                    align-content: stretch;
                    align-items: center;
                    justify-content: space-between;
                    background-color: #fff;
                    margin-bottom: 10px;
                    border-radius: 2px;
                    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
                    max-width: 300px;
                }
                #growlDock .growl-message {
                    flex-grow: 1;
                    border-top-left-radius: 2px;
                    border-bottom-left-radius: 2px;
                    padding: 10px;
                }
                #growlDock .growl-message.error {
                    background-color: rgb(244, 67, 54);
                    color: #fff;
                }
                #growlDock .growl-message.success {
                    background-color: rgb(139, 195, 74);
                    color: #fff;
                }
                #growlDock .close {
                    cursor: pointer;
                    padding: 0 10px;
                }
            `;
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }
    }

    function setup(message, priority) {
        var main = document.createElement('div');
        main.innerHTML = '<div class="alert growl-message" role="alert"></div><i class="close material-icons">close</i>';

        message = document.createTextNode(message); // this is a straightforward way to escape any html tags
        main.firstElementChild.appendChild(message);

        main.firstElementChild.classList.add(priority);

        return main;
    }

    function notify(message, priority, persist) {
        var instance = create();
        addStyleSheet();

        var html = setup(message, priority);
        var notice = $(html).hide()
                            .fadeIn()
                            .css('display', 'flex');

        var close = $(html).find(".close");
        close.click(function () {
            notice.remove()
        });

        $.growl.settings.noticeDisplay(notice);
        instance.append(notice);

        if (!persist) {
            var noticeTimeoutId = window.setTimeout(function () {
                jQuery.growl.settings.noticeRemove(notice, noticeTimeoutId, function () {
                    notice.remove();
                });
            }, 3000);
        }
    }

    $.growl = function (message, priority, persist) {
        notify(message, priority, persist)
    },
    $.growl.version = '1.1.0',
    $.growl.settings = {
        noticeDisplay: function (notice) {
            notice.css({
                opacity: '0'
            }).fadeIn(jQuery.growl.settings.noticeFadeTimeout)
        },
        noticeRemove: function (notice, timeoutId, callback) {
            notice.animate({
                opacity: '0',
                height: '0px'
            }, {
                duration: jQuery.growl.settings.noticeFadeTimeout,
                complete: callback
            });

            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        },
        noticeFadeTimeout: 'slow'
    }
}(jQuery);
