jQuery.fn.center = function() {
        return this.css("margin-left", ($(window).width() - this.outerWidth()) / 2 + $(window).scrollLeft()), this.addClass("JqueryCentered"), this
    }, jQuery.fn.getCheckboxVal = function() {
        var vals = [],
            i = 0;
        return this.each(function() {
            vals[i++] = jQuery(this).val()
        }), vals
    }, jQuery.fn.highlight = function(pat) {
        function innerHighlight(node, pat) {
            var skip = 0;
            if (3 == node.nodeType) {
                var pos = node.data.toUpperCase().indexOf(pat);
                if (pos >= 0) {
                    var spannode = document.createElement("span");
                    spannode.className = "highlight";
                    var middlebit = node.splitText(pos),
                        middleclone = (middlebit.splitText(pat.length), middlebit.cloneNode(!0));
                    spannode.appendChild(middleclone), middlebit.parentNode.replaceChild(spannode, middlebit), skip = 1
                }
            } else if (1 === node.nodeType && node.childNodes && !/(script|style)/i.test(node.tagName))
                for (var i = 0; i < node.childNodes.length; ++i) i += innerHighlight(node.childNodes[i], pat);
            return skip
        }
        return this.each(function() {
            innerHighlight(this, pat.toUpperCase())
        })
    }, jQuery.fn.removeHighlight = function() {
        function newNormalize(node) {
            for (var i = 0, children = node.childNodes, nodeCount = children.length; nodeCount > i; i++) {
                var child = children[i];
                if (1 != child.nodeType) {
                    if (3 == child.nodeType) {
                        var next = child.nextSibling;
                        if (null !== next && 3 === next.nodeType) {
                            var combined_text = child.nodeValue + next.nodeValue;
                            new_node = node.ownerDocument.createTextNode(combined_text), node.insertBefore(new_node, child), node.removeChild(child), node.removeChild(next), i--, nodeCount--
                        }
                    }
                } else newNormalize(child)
            }
        }
        return this.find("span.highlight").each(function() {
            var thisParent = this.parentNode;
            thisParent.replaceChild(this.firstChild, this), newNormalize(thisParent)
        }).end()
    }, jQuery.fn.isOnScreen = function(allOfIt) {
        var win = $(window),
            viewport = {
                top: win.scrollTop(),
                left: win.scrollLeft()
            };
        viewport.right = viewport.left + win.width(), viewport.bottom = viewport.top + win.height();
        var bounds = this.offset();
        return bounds.right = bounds.left + this.outerWidth(), bounds.bottom = bounds.top + this.outerHeight(), void 0 === allOfIt ? !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom) : viewport.top < bounds.top && viewport.bottom > bounds.bottom
    }, jQuery.fn.zoom = function(options) {
        $.fn.zoom.defaults = {
            zoomWidth: 5,
            zoomHeight: 5,
            duration: 150
        }, options = $.extend($.fn.zoom.defaults, options);
        var selector = this,
            oriH = 0,
            oriW = 0,
            opac = 1;
        return this.each(function() {
            oriH = $(this).height(), oriW = $(this).width(), opac = $(this).css("opacity"), $(selector).stop(!0, !1).animate({
                opacity: 0,
                height: options.zoomHeight + "px",
                width: options.zoomWidth + "px",
                marginTop: (oriH - options.zoomHeight) / 2 + "px",
                marginLeft: (oriW - options.zoomWidth) / 4 + "px"
            }, options.duration, "linear").animate({
                marginLeft: 0,
                marginRight: 0
            }, 100, "linear", function() {
                $(selector).remove()
            })
        })
    }, $(document).ajaxSend(function(event, xhr, settings) {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && "" !== document.cookie)
                for (var cookies = document.cookie.split(";"), i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == name + "=") {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break
                    }
                }
            return cookieValue
        }
        /^http:.*/.test(settings.url) || /^https:.*/.test(settings.url) || xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"))
    }).addClass("JS"), jQuery.fn.collapse = function(options) {
        var defaults = {
            closed: !1
        };
        return settings = jQuery.extend({}, defaults, options), this.each(function() {
            $(this).find(".collapsible_icon").remove();
            var obj = jQuery(this),
                img_placeholder = '<div class="collapsible_icon">';
            obj.find("legend:first").unbind("click").addClass("collapsible").click(function() {
                jQuery(this).removeClass("collapsed"), obj.children().not("legend").toggle("fast", function() {
                    jQuery(this).is(":visible") ? (obj.removeClass("collapsed").addClass("collapsible"), obj.find("legend:first").removeClass("collapsed").addClass("collapsible")) : obj.addClass("collapsed").find("legend").addClass("collapsed")
                })
            }).prepend(img_placeholder), settings.closed ? (obj.addClass("collapsed").find("legend:first").addClass("collapsed"), obj.children().not("legend:first").css("display", "none")) : (obj.removeClass("collapsed").find("legend:first").removeClass("collapsed"), obj.children().not("legend:first").show())
        })
    }, jQuery.fn.editinplace = function(options) {
        var defaults = {};
        return settings = $.extend({}, defaults, options), this.each(function() {
            {
                var obj = jQuery(this);
                obj.text()
            }
            return $.fn.editinplace.addclick(obj), obj.addClass("editinplace_editable"), !1
        })
    }, jQuery.fn.editinplace.addclick = function(obj) {
        return obj.bind("click.editinplace", function() {
            var originalWidth = $(this).width();
            obj.removeClass("editinplace_editable");
            var editinplacehldr = $("<div>").css({
                    "display": "flex",
                    "min-width": (originalWidth + 200) + "px"
                }),
                saveedit = $('<input type="submit" value="' + gettext("Save") + '" class="button editinplace mdl-button js-mdl-button js-mdl-button--ripple mdl-button--raised mdl-button--accent">').click(function() {
                    var newinput = $(this).parent().find("input.editinplaceval").val();
                    $.ajax({
                        url: $(obj).attr("rel"),
                        data: {
                            field_value: newinput
                        },
                        type: "POST",
                        traditional: !0,
                        success: function() {
                            return $.growl(gettext("Saved title"), "success"), obj.html(newinput).addClass("editinplace_editable"), $.fn.editinplace.addclick(obj), !1
                        },
                        error: function() {
                            return $.growl(gettext("Error updating title"), "error"), !1
                        }
                    })
                }).css({
                    "margin-right": "16px"
                }),
                canceledit = $('<input type="reset" value ="' + gettext("Cancel") + '" class="button editinplace mdl-button js-mdl-button js-mdl-button--ripple mdl-button--raised mdl-button--accent">').click(function() {
                    return obj.html($(this).data("original_value")).addClass("editinplace_editable"),
                            $.fn.editinplace.addclick(obj),
                            $(this).parent().find(".editinplace").remove(),
                            !1
                }).data("original_value", obj.text()),
                editobj = $('<input class="editinplaceval mdl-textfield__input">').attr("value", obj.text()).css({
                    "line-height": "inherit",
                    background: "transparent",
                    color: "#fff",
                    "min-width": (originalWidth - 40) + "px",
                    "border-bottom": "1px solid rgb(255,64,129)",
                    "margin-right": "16px",
                    "width": "auto"
                }).keydown(function(event) {
                    $(this).val($(this).val().replace(/\v+/g, "")),
                    13 === event.keyCode ? ($(this).unbind(),
                                            $(this).parent().find("input:submit").click(),
                                            event.preventDefault())
                                         : 27 === event.keyCode && ($(this).parent().find("input:reset").click(), event.preventDefault())
                });
            return $(editinplacehldr).append(editobj).append(saveedit).append(canceledit),
                    obj.unbind(".editinplace").html(editinplacehldr),
                    editobj.focus(),
                    !1
        }), !0
    }, jQuery.fn.tablerowcheckbox = function(callbck) {
        return this.each(function() {
            $("tbody tr", this).filter(":has(:checkbox:checked)").addClass("selected").end().on("click", function(event) {
                $(this).find(":has(:checkbox)").length > 0 && $(this).toggleClass("selected"), "checkbox" !== event.target.type && "radio" !== event.target.type && ($(":checkbox", this).attr("checked", function() {
                    return !this.checked
                }).trigger("change"), $(":radio", this).attr("checked", "checked").trigger("change"), $.isFunction(callbck) && callbck.call(this))
            })
        })
    }, jQuery.extend(jQuery.easing, {
        easeOutBounce: function(x, t, b, c, d) {
            return (t /= d) < 1 / 2.75 ? 7.5625 * c * t * t + b : 2 / 2.75 > t ? c * (7.5625 * (t -= 1.5 / 2.75) * t + parseFloat(".974375")) + b : 2.5 / 2.75 > t ? c * (7.5625 * (t -= 2.25 / 2.75) * t + parseFloat(".994375")) + b : c * (7.5625 * (t -= 2.625 / 2.75) * t + parseFloat(".984375")) + b
        }
    }),
    function(jQuery) {
        function keyHandler(handleObj) {
            if ("string" == typeof handleObj.data) {
                var origHandler = handleObj.handler,
                    keys = handleObj.data.toLowerCase().split(" ");
                handleObj.handler = function(event) {
                    if (this === event.target || !/textarea|select/i.test(event.target.nodeName) && "text" !== event.target.type) {
                        var special = "keypress" !== event.type && jQuery.hotkeys.specialKeys[event.which],
                            character = String.fromCharCode(event.which).toLowerCase(),
                            modif = "",
                            possible = {};
                        event.altKey && "alt" !== special && (modif += "alt+"), event.ctrlKey && "ctrl" !== special && (modif += "ctrl+"), event.metaKey && !event.ctrlKey && "meta" !== special && (modif += "meta+"), event.shiftKey && "shift" !== special && (modif += "shift+"), special ? possible[modif + special] = !0 : (possible[modif + character] = !0, possible[modif + jQuery.hotkeys.shiftNums[character]] = !0, "shift+" === modif && (possible[jQuery.hotkeys.shiftNums[character]] = !0));
                        for (var i = 0, l = keys.length; l > i; i++)
                            if (possible[keys[i]]) return origHandler.apply(this, arguments)
                    }
                }
            }
        }
        jQuery.hotkeys = {
            version: "0.8",
            specialKeys: {
                8: "backspace",
                9: "tab",
                13: "return",
                16: "shift",
                17: "ctrl",
                18: "alt",
                19: "pause",
                20: "capslock",
                27: "esc",
                32: "space",
                33: "pageup",
                34: "pagedown",
                35: "end",
                36: "home",
                37: "left",
                38: "up",
                39: "right",
                40: "down",
                45: "insert",
                46: "del",
                96: "0",
                97: "1",
                98: "2",
                99: "3",
                100: "4",
                101: "5",
                102: "6",
                103: "7",
                104: "8",
                105: "9",
                106: "*",
                107: "+",
                109: "-",
                110: ".",
                111: "/",
                112: "f1",
                113: "f2",
                114: "f3",
                115: "f4",
                116: "f5",
                117: "f6",
                118: "f7",
                119: "f8",
                120: "f9",
                121: "f10",
                122: "f11",
                123: "f12",
                144: "numlock",
                145: "scroll",
                191: "/",
                224: "meta"
            },
            shiftNums: {
                "`": "~",
                1: "!",
                2: "@",
                3: "#",
                4: "$",
                5: "%",
                6: "^",
                7: "&",
                8: "*",
                9: "(",
                0: ")",
                "-": "_",
                "=": "+",
                ";": ": ",
                "'": '"',
                ",": "<",
                ".": ">",
                "/": "?",
                "\\": "|"
            }
        }, jQuery.each(["keydown", "keyup", "keypress"], function() {
            jQuery.event.special[this] = {
                add: keyHandler
            }
        })
    }(jQuery);
