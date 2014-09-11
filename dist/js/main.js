/* ===== Zeste de Savoir ====================================================
   Managment of accessibility links
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function($, undefined){
    "use strict";
    
    $("#accessibility a").on("focus", function(){
        $(".dropdown:visible").parent().find(".active").removeClass("active");
        $("#accessibility").addClass("focused");
    });
    $("#accessibility a").on("blur", function(){
        $("#accessibility").removeClass("focused");
    });
})(jQuery);

/* ===== Zeste de Savoir ====================================================
   Accordeon for sidebar
   ---------------------------------
   Author: Alex-D
   ========================================================================== */

(function($, undefined){
    "use strict";

    function accordeon($elem){
        $("h4 + ul, h4 + ol", $elem).each(function(){
            if($(".current", $(this)).length === 0)
                $(this).hide();
        });

        $("h4", $elem).click(function(e){
            $("+ ul, + ol", $(this)).slideToggle(100);

            e.preventDefault();
            e.stopPropagation();
        });
    }
    
    $(document).ready(function(){
        $(".main .sidebar.accordeon, .main .sidebar .accordeon")
        .each(function(){
            accordeon($(this));
        })
        .on("DOMNodeInserted", function(e){
            accordeon($(e.target));
        });
    });
})(jQuery);

/* ===== Zeste de Savoir ====================================================
   Add autocomplete for members names
   ---------------------------------
   Author: Sandhose / Quentin Gliech
   ========================================================================== */

(function($, undefined) {
    "use strict";

    function AutoComplete(input, options) {
        this.$wrapper = buildDom($(input));
        this.$input = this.$wrapper.find(".autocomplete-input");
        this.$dropdown = this.$wrapper.find(".autocomplete-dropdown");

        this.$dropdown.css({
            "marginTop": "-" + this.$input.css("margin-bottom"),
            "left": this.$input.css("margin-left")
        });

        this.$input.on("keyup", this.handleInput.bind(this));
        this.$input.on("keydown", this.handleKeydown.bind(this));
        this.$input.on("blur", this.hideDropdown.bind(this));

        this.selected = -1;

        this._lastInput = "";

        this.options = options;
    }

    AutoComplete.prototype = {
        cache: {},

        handleKeydown: function(e){
            var $tmp;
            switch(e.which){
                case 38: // Up
                    e.preventDefault();
                    e.stopPropagation();

                    if(this.selected === -1){
                        this.select(this.$dropdown.find("ul li").last().attr("data-autocomplete-id"));
                    } else {
                        $tmp = this.$dropdown.find("ul li[data-autocomplete-id=" + this.selected + "]").prev("li");
                        this.select($tmp.length === 1 ? $tmp.attr("data-autocomplete-id") : -1);
                    }
                    break;
                case 40: // Down
                    e.preventDefault();
                    e.stopPropagation();

                    if(this.selected === -1){
                        this.select(this.$dropdown.find("ul li").first().attr("data-autocomplete-id"));
                    } else {
                        $tmp = this.$dropdown.find("ul li[data-autocomplete-id=" + this.selected + "]").next("li");
                        this.select($tmp.length === 1 ? $tmp.attr("data-autocomplete-id") : -1);
                    }
                    break;
                case 13: // Enter
                    e.preventDefault();
                    e.stopPropagation();

                    this.enter();
                    break;
            }
        },

        handleInput: function(e){
            if(e && (e.which === 38 || e.which === 40 || e.which === 13)){ 
                e.preventDefault();
                e.stopPropagation();
            }

            var input = this.$input.val();

            if(this._lastInput === input)
                return;

            this._lastInput = input;

            var search = this.parseInput(input),
                self = this;

            if(!search || search === this._lastAutocomplete){
                this.hideDropdown();
            } else {
                this.fetchUsers(search)
                    .done(function(data){
                        self.updateCache(data);
                        self.updateDropdown(self.sortList(data, search));
                    })
                    .fail(function(){
                        console.error("[Autocompletition] Something went wrong...");
                    })
                ;
                this.updateDropdown(this.sortList(this.searchCache(search), search));
                this.showDropdown();
            }
        },

        showDropdown: function(){
            if(this.$input.is("input"))
                this.$dropdown.css("width", this.$input.outerWidth());
            this.$dropdown.show();
        },

        hideDropdown: function(){
            this.$dropdown.hide();
        },

        select: function(id){
            this.selected = id;
            this.$dropdown.find("ul li.active").removeClass("active");
            this.$dropdown.find("ul li[data-autocomplete-id=" + this.selected + "]").addClass("active");
        },

        enter: function(selected){
            selected = selected || this.selected;
            var input = this.$input.val();
            var lastChar = input.substr(-1);
            if((lastChar === "," || selected === -1) && this.options.type === "multiple")
                return false;

            var completion = this.getFromCache(selected);
            if(!completion)
                return false;

            if(this.options.type === "multiple") {
                var lastComma = input.lastIndexOf(",");
                if(lastComma !== -1){
                    input = input.substr(0, lastComma + 2) + completion.value + ", ";
                    this.$input.val(input);
                } else {
                    this.$input.val(completion.value + ", ");
                }
            }
            else {
                this.$input.val(completion.value);
            }

            this._lastAutocomplete = completion.value;
        },

        updateCache: function(data){
            for(var i = 0; i < data.length; i++){
                this.cache[data[i].value] = data[i];
            }
        },

        extractWords: function(input){
            //input = input.replace(/ /g, ","); // Replace space with comas
            var words = $.grep(
                $.map(input.split(","), $.trim),  // Remove empty
                function(e){
                    return e === "" || e === undefined;
                },
                true
            );

            return words;
        },

        parseInput: function(input){
            if(this.options.type === "multiple") {
                if(input.substr(-1) === "," || input.substr(-2) === ", ")
                    return false;

                var words = this.extractWords(input);
                if(words.length === 0) return false;

                return words[words.length - 1]; // last word in list
            }
            else {
                return input;
            }
        },

        searchCache: function(input){
            var regexp = new RegExp(input, "ig");
            return $.grep(
                this.cache,
                function(e){
                    return e.value.match(regexp);
                }
            );
        },

        getFromCache: function(id){
            for(var i in this.cache){
                if(parseInt(this.cache[i].id) === parseInt(id))
                    return this.cache[i];
            }
            return false;
        },

        updateDropdown: function(list){
            var self = this;
            var onClick = function(e){
                e.preventDefault();
                e.stopPropagation();
                self.enter($(this).attr("data-autocomplete-id"));
                self.$input.focus();
                self.handleInput();
            };

            if(list.length > this.options.limit) list = list.slice(0, this.options.limit);

            var $list = $("<ul>"), $el, selected = false;
            for(var i in list){
                $el = $("<li>").text(list[i].value);
                $el.attr("data-autocomplete-id", list[i].id);
                if(list[i].id === this.selected){
                    $el.addClass("active");
                    selected = true;
                }

                $el.mousedown(onClick);
                $list.append($el);
            }
            this.$dropdown.children().remove();
            this.$dropdown.append($list);

            if(!selected)
                this.select($list.find("li").first().attr("data-autocomplete-id"));
        },

        sortList: function(list, search) {
            var bestMatches = [], otherMatches = [];

            for(var i = 0; i < list.length; i++) {
                if(list[i].value.indexOf(search) === 0) {
                    bestMatches.push(list[i]);
                }
                else {
                    otherMatches.push(list[i]);
                }
            }

            var sortFn = function(a, b) {
                var valueA = a.value.toLowerCase(), valueB = b.value.toLowerCase();
                if (valueA < valueB)
                    return -1 ;
                if (valueA > valueB)
                    return 1;
                return 0;
            };

            bestMatches.sort(sortFn);
            otherMatches.sort(sortFn);

            return bestMatches.concat(otherMatches);
        },

        fetchUsers: function(input) {
            return $.getJSON(this.options.url.replace("%s", input));
        }
    };

    function buildDom(input) {
        var $input = $(input),
            $wrapper = $("<div/>", {
                "class": "autocomplete-wrapper"
            }),
            $dropdown = $("<div/>", {
                "class": "autocomplete-dropdown"
            })
        ;

        return $input.addClass("autocomplete-input")
            .attr("autocomplete", "off")
            .wrap($wrapper)
            .parent()
            .append($dropdown)
        ;
    }

    $.fn.autocomplete = function(options) {
        var defaults = {
            type: "single", // single|multiple|mentions
            url: "/membres/?q=%s",
            limit: 4
        };

        if(!options) {
            options = $(this).data("autocomplete");
        }

        return new AutoComplete(this, $.extend(defaults, options));
    };

    $(document).ready(function() {
        $("[data-autocomplete]").autocomplete();
        $("#content").on("DOMNodeInserted", "input", function(e){
            var $input = $(e.target);
            if($input.is("[data-autocomplete]"))
                $input.autocomplete();
        });
    });
})(jQuery);

/* ===== Zeste de Savoir ====================================================
   Close alert-boxes
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function($, undefined){
    "use strict";
    
    $(".main").on("click", ".close-alert-box:not(.open-modal)", function(e) {
        $(this).parents(".alert-box:first").slideUp(150, function(){
            $(this).remove();
        });
        e.preventDefault();
    });
})(jQuery);

/* ===== Zeste de Savoir ====================================================
   Manage tracking cookies message
   ---------------------------------
   Authors: Sandhose
            Alex-D / Alexandre Demode
   ========================================================================== */

(function(document, undefined) {
    var $banner = $("#cookies-banner");

    function checkHasConsent(){
        if(document.cookie.indexOf("hasconsent=true") > -1){
            $("#gtm").after(
                "<script>" +
                    "dataLayer = [{'gaTrackingId': 'UA-27730868-1'}];" +
                    "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':" +
                    "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0]," +
                    "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=" +
                    "'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);" +
                    "})(window,document,'script','dataLayer','GTM-WH7642');" +
                "</script>"
            );
        } else if(document.cookie.indexOf("hasconsent=false") === -1){
            // Accept for the next page
            setHasConsent(true);
            
            // Show the banner
            $banner.show();
        }
    }
    checkHasConsent();


    function setHasConsent(hasconsent){
        document.cookie = "hasconsent="+hasconsent+"; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/";
    }

    $("#reject-cookies").on("click", function(){
        setHasConsent(false);
        $banner.slideUp(200);
    });

    $("#accept-cookies").on("click", function(){
        checkHasConsent();
        $banner.slideUp(200);
    });
})(document);

/* ===== Zeste de Savoir ====================================================
   Simulate click on element from another
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function($, undefined){
    "use strict";
    
    var dropdownMouseDown = false;
    
    $("body")
    .on("mousedown", "[data-click]", function(){
        dropdownMouseDown = true;
    })
    .on("mouseup", "[data-click]", function(){
        dropdownMouseDown = false;
    })
    .on("click focus", "[data-click]", function(e){
        if(e.type === "focus" && dropdownMouseDown)
            return false;

        if(!($(this).hasClass("dont-click-if-sidebar") && $(".header-container .mobile-menu-btn").is(":visible"))){
            e.preventDefault();
            e.stopPropagation();
            $("#" + $(this).attr("data-click")).trigger("click");
        }
    });
})(jQuery);

/* ===== Zeste de Savoir ====================================================
   Dropdown menu open/close
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function($, undefined){
    "use strict";
    
    var dropdownMouseDown = false;

    $(".dropdown").each(function(){
        var $elem = $(this).parent().find("> a");

        if(!$elem.parents(".logbox").length)
            $elem.addClass("has-dropdown");

        $elem
        .on("mousedown", function(){
            dropdownMouseDown = true;
        })
        .on("mouseup", function(){
            dropdownMouseDown = false;
        })
        .on("click", function(e){
            if(($(this).parents(".header-menu-list").length > 0 && parseInt($("html").css("width")) < 960))
                return true;

            e.preventDefault();
            e.stopPropagation();

            if(!$(this).hasClass("active")){
                activeDropdown($(this));
                $(this).off("blur");
            } else {
                $(this).removeClass("active");
                triggerCloseDropdown($(this));
            }
        })
        .on("focus", function(e){
            e.preventDefault();

            if(!dropdownMouseDown && !$(this).hasClass("active")){
                activeDropdown($(this));
                
                $(this)
                .one("blur", function(){
                    $elem = $(this);
                    setTimeout(function(){
                        if($(":tabbable:focus", $elem.parent().find(".dropdown")).length){
                            $(":tabbable:last", $elem.parent().find(".dropdown")).one("blur", function(){
                                $elem.removeClass("active");
                                triggerCloseDropdown($elem);
                            });
                        } else {
                            $elem.removeClass("active");
                            triggerCloseDropdown($elem);
                        }
                    }, 10);
                })
                .one("mousemove", function(){
                    $(this).off("blur");
                });
            }
        });
    });

    $(".dropdown-list").on("focus", function(){
        $(this).find(":tabbable:first").focus();
    });

    $("body").on("keydown", function(e){
        if(e.which === 27)
            $(".has-dropdown.active, .ico-link.active, #my-account.active").focus().removeClass("active");
    });

    function activeDropdown($elem){
        $("body").trigger("click");
        $elem.addClass("active");
        $elem.parent().find(".dropdown-list").scrollTop(0);

        if($elem.is("[data-active]"))
            $("#" + $elem.attr("data-active")).addClass("active");

        if($elem.parents(".logbox").length)
            $("html").addClass("dropdown-active");

        triggerCloseDropdown($elem);
    }
    function triggerCloseDropdown($that){
        if($that.hasClass("active")){
            $("body").one("click", function(e){
                if(!$(e.target).hasClass("dropdown") && !$(e.target).parents(".dropdown").length) {
                    $that.removeClass("active");
                    $that.next(":tabbable").focus();

                    if($that.is("[data-active]"))
                        $("#" + $that.attr("data-active")).removeClass("active");
                }
                
                triggerCloseDropdown($that);
            });
        } else {
            $("html").removeClass("dropdown-active");
            $("body").off("click");
            $(".dropdown :tabbable").off("blur");

            if($that.is("[data-active]"))
                $("#" + $that.attr("data-active")).removeClass("active");
        }
    }
})(jQuery);


(function(){
    "use strict";
    
    var zForm = {
        buttons: "bold,italic,strike,abbr,key#sup,sub#center,right#ul,ol#titles,blockcode,image,quote,link#infoblocks",
        isExecuted: false,
        selection: null,
        
        addEvent: function(elem, evt, listener) {
            if (elem.addEventListener) {
                elem.addEventListener(evt, listener, false);    
            } else {
                elem.attachEvent("on" + evt, listener); 
            }
        },
        
        tags: {
            bold:       { title: "Gras",                        start: "**",                end: "**"   },
            italic:     { title: "Italique",                    start: "*",                 end: "*"    },
            strike:     { title: "Barré",                       start: "~~",                end: "~~"   },
            sup:        { title: "Exposant",                    start: "^",                 end: "^"    },
            sub:        { title: "Indice",                      start: "~",                 end: "~"    },
            abbr:       { title: "Abréviation" },
            key:        { title: "Touche",                      start: "||",                end: "||"   },
            
            titles:     { title: "Titres",                      action: "buildTitles"                   },
            
            ul:         { title: "Liste à puces"                                                        },
            ol:         { title: "Liste ordonnée"                                                       },
            
            center:     { title: "Aligner au centre",           start: "-> ",               end: " <-"  },
            right:      { title: "Aligner à droite",            start: "-> ",               end: " ->"  },
            
            quote:      { title: "Citation"                                                             },
            image:      { title: "Image"                                                                },
            link:       { title: "Lien"                                                                 },
            
            table:      { title: "Tableau"                                                              },
            
            infoblocks: { title: "Blocs spéciaux",              action: "buildInfoblocks"               },
            information:{ title: "Bloc Information"                                                     },
            question:   { title: "Bloc Question"                                                        },
            attention:  { title: "Bloc Attention"                                                       },
            error:      { title: "Bloc Erreur"                                                          },
            secret:     { title: "Bloc masqué"                                                          },
            
            monospace:  { title: "Code inline",                 start: "`",                 end: "`"    },
            blockcode:  { title: "Bloc de code coloré",         action: "buildCode"                     },
            
            math:       { title: "Formule mathématique",        start: "$",                 end: "$"    },
            hr:         { title: "Ligne horizontalle",          start: "\n\n------\n\n",    end: ""     },
            
            footnote:   { title: "Note en bas de page"                                                  }
        },
        
        codes: {
            Web: [
                ["html",    "HTML"],
                ["css",     "CSS"],
                ["js",      "Javascript"],
                ["php",     "PHP"],
                ["jfx",     "JavaFX"],
                ["cf",      "ColdFusion"],
                ["as3",     "Actionscript 3"],
                ["pl",      "Perl"],
                ["sql",     "SQL"],
                ["xml",     "XML"]
            ],
            Prog: [
                ["c",       "C"],
                ["cpp",     "C++"],
                ["csharp",  "C#"],
                ["java",    "Java"],
                ["delphi",  "Delphi"],
                ["py",      "Python"],
                ["ruby",    "Ruby"],
                ["pascal",  "Pascal"],
                ["vb",      "Visual Basic"],
                ["vbnet",   "VB.NET"],
            ],
            Autres: [
                ["bash",    "Bash"],
                ["diff",    "Diff"],
                ["erl",     "Erlang"],
                ["scala",   "Scala"],
                ["groovy",  "Groovy"],
                ["ps",      "PowerShell"],
                ["text",    "Autre"]
            ]
        },
        
        titles: {
            "link" :    "Lien hypertexte",
            "abbr" :    "Abréviation",
            "image":    "Image" 
        },
        
        init: function() {
            var listTexta = document.getElementsByTagName("textarea");
            
            for (var i=0, c=listTexta.length; i<c; i++) {
                if (/md.editor/.test(listTexta[i].className)) {
                    this.setup(listTexta[i].id);    
                }
            }
            
            var overlay = document.body.appendChild(document.createElement("div"));
                overlay.id = "zform-modal-overlay";
                
            var wrapper = document.body.appendChild(document.createElement("div"));
                wrapper.id = "zform-modal-wrapper";         
            
            wrapper.innerHTML = 
            "<div>" + 
                "<header id=\"zform-modal-header\"></header>" +

                "<section class=\"zform-modal\" id=\"zform-modal-link\">" +
                    "<div>" + 
                        "<label for=\"zform-modal-link-href\">Lien :</label>" +
                        "<input type=\"text\" id=\"zform-modal-link-href\" />" +
                    "</div>" +
                    
                    "<div>" +
                        "<label for=\"zform-modal-link-text\">Texte :</label>" +
                        "<input type=\"text\" id=\"zform-modal-link-text\" />" +
                    "</div>" +
                "</section>" +
        
                "<section class=\"zform-modal\" id=\"zform-modal-image\">" +
                    "<div>" +
                        "<label for=\"zform-modal-image-src\">URL :</label>" +
                        "<input type=\"text\" id=\"zform-modal-image-src\" />" +
                    "</div>" +
                    
                    "<div>" +
                        "<label for=\"zform-modal-image-text\">Texte :</label>" +
                        "<input type=\"text\" id=\"zform-modal-image-text\" />" +
                    "</div>" +           
                "</section>" +
        
                "<section class=\"zform-modal\" id=\"zform-modal-abbr\">" +
                    "<div>" +
                        "<label for=\"zform-modal-abbr-abbr\">Abréviation :</label>" +
                        "<input type=\"text\" id=\"zform-modal-abbr-abbr\" />" +
                    "</div>" +
                    
                    "<div>" +
                        "<label for=\"zform-modal-abbr-text\">Texte :</label>" +
                        "<input type=\"text\" id=\"zform-modal-abbr-text\" />" +
                    "</div>" + 
                "</section>" +
        
                "<section class=\"zform-modal\" id=\"zform-modal-footnote\">" +
                    "<div>" +
                        "<label for=\"zform-modal-footnote-guid\">Identifiant :</label>" +
                        "<input type=\"text\" id=\"zform-modal-footnote-guid\" />" +
                    "</div>" +
                    
                    "<div>" +
                        "<label for=\"zform-modal-footnote-text\">Texte :</label>" +
                    "</div>" +
                    
                    "<div>" +
                        "<textarea id=\"zform-modal-footnote-text\"></textarea>" +
                    "</div>" +  
                "</section>" +
        
                "<footer><a id=\"zform-modal-validate\" class=\"btn btn-submit\">Valider</a> <a id=\"zform-modal-cancel\" class=\"btn btn-cancel secondary tiny\">Annuler</a></footer>" +
            "</div>";
            
            this.addEvent(document.getElementById("zform-modal-validate"), "click", (function(_this) {
                return function() {
                    _this.validatePopup();
                };
            }) (this));
                
            this.addEvent(document.getElementById("zform-modal-cancel"), "click", (function(_this) {
                return function() {
                    _this.closePopup();
                };
            }) (this));
        },
        
        setup: function(textareaId) {
            var elemTexta = document.getElementById(textareaId);
            var elemTools = document.createElement("ul");
            elemTools.className = "zform-toolbar hide-for-small";
            
            elemTexta.parentNode.insertBefore(elemTools, elemTexta);
            
            if (!this.isExecuted) {
                this.addEvent(document, "click", function(event) {
                    if (~event.target.className.indexOf("zform-button") && !(~event.target.className.indexOf("zform-subbutton"))) {
                        return event.stopPropagation();
                    }
                    
                    var menus = document.getElementsByClassName("zform-popup"), i = 0;
                    
                    while (menus[i]) {
                        if (menus[i].getAttribute("data-zform-info") !== "dontclose" || event.target.nodeName.toLowerCase() === "textarea") {
                            menus[i].style.display = "none";
                        }
                        i++;
                    }                   
                }, false);
                
                this.isExecuted = true;
            }
            
            var groups = this.buttons.split("#");
            var buttons;
            
            var elemButtonLi, elemButton, currentButton;
            var elemPopup;
            
            for (var g=0, cg=groups.length; g<cg; g++) {
                buttons = groups[g].split(",");
                
                for (var b=0, cb=buttons.length; b<cb; b++) {
                    if (!(currentButton = this.tags[buttons[b]])) {
                        alert("La valeur '" + buttons[b] + "' n\'est pas reconnue comme étant une valeur correcte pour un bouton de zForm ! Corrigez votre syntaxe.");
                        continue;   
                    }

                    elemButtonLi = elemTools.appendChild(document.createElement("li"));
                    elemButton = elemButtonLi.appendChild(document.createElement("a"));
                    elemButton.style.position = "relative";
                    
                    elemButton.className = "ico-after zform-button zform-button-" + buttons[b];
                    elemButton.setAttribute("data-zform-textarea", textareaId);
                    elemButton.title = currentButton.title;
                    elemButton.innerText = currentButton.title;
                    
                    if (currentButton.action) {
                        elemButton.href = "#";
                        this.addEvent(elemButton, "click", function(event, elemPopup) {
                            event.preventDefault();
                        
                            if (elemPopup = this.getElementsByTagName("div")[0]) {
                                elemPopup.style.display = "block";  
                            }                       
                        });
                        
                        elemPopup = elemButton.appendChild(document.createElement("div"));
                        elemPopup.className = "zform-popup";
                        elemPopup.style.position = "absolute";
                        elemPopup.style.display = "none";
                        elemPopup.style.left = "0";
                        elemPopup.style.width = "auto";
                        elemPopup.style.whiteSpace = "nowrap";
                        elemPopup.style.textAlign = "left";
                    
                            elemPopup = this[currentButton.action](elemPopup, currentButton, textareaId);
                    } else {
                        elemButton.addEventListener("click", (function(_button, _textareaId, _this, _tagtype) {
                            return function() {
                                _this.wrap(_button.start, _button.end, _textareaId, _tagtype);
                            };
                        }) (currentButton, textareaId, this, buttons[b]), false);   

                    }
                }
                
                elemButton.style.marginRight = "20px";
            }       
        },
        
        openPopup: function(popupGuid) {
            this.closePopup();
            
            document.getElementById("zform-modal-overlay").style.display = "block";
            document.getElementById("zform-modal-wrapper").style.display = "block";
            
            document.getElementById("zform-modal-header").innerHTML = this.titles[popupGuid] || "Markdown";
            
            document.getElementById("zform-modal-" + popupGuid).style.display = "block";
            
            return false;
        },
        
        closePopup: function() {
            var modals = document.getElementsByTagName("section");
            
            for (var i=0, c=modals.length; i<c; i++) {
                if (modals[i].className === "zform-modal") {
                    modals[i].style.display = "none";
                }   
            }
            
            document.getElementById("zform-modal-overlay").style.display = "none";
            document.getElementById("zform-modal-wrapper").style.display = "none";  
        },
        
        validatePopup: function() {
            //var wrapper = document.getElementById("zform-modal-wrapper");
            
            if (this.selection && this.selection.type) {
                this.wrap("___", "+++", this.selection.textareaId, this.selection.type, null, true);
            }
            
            this.closePopup();
        },
        
        buildTitles: function(elemPopup, currentButton, textareaId, elemItem) {
            for (var i=1; i<=4; i++) {
                elemItem = elemPopup.appendChild(document.createElement("a"));
                elemItem.className = "ico-after zform-button zform-subbutton zform-button-title" + i;
                elemItem.title = "Titre de niveau " + i;
                elemItem.innerText = "Titre de niveau " + i;
                this.addEvent(elemItem, "mousedown", (function(_this, _textareaId, _options) {
                    return function(event) {
                        event.preventDefault(); // IE madafaker
                        _this.wrap("", "", _textareaId, _options);
                    };
                }) (this, textareaId, "title" + i), false);
            }
            
            return elemPopup;
        },
        
        buildInfoblocks: function(elemPopup, currentButton, textareaId, elemItem) {
            var ids = ["information", "question", "attention", "error", "secret"];
            
            for (var i=0; i<5; i++) {
                elemItem = elemPopup.appendChild(document.createElement("a"));
                elemItem.className = "ico-after zform-button zform-subbutton zform-button-" + ids[i];
                elemItem.title = this.tags[ids[i]].title;
                elemItem.innerText = this.tags[ids[i]].title;
                this.addEvent(elemItem, "mousedown", (function(_this, _textareaId, _options) {
                    return function(event) {
                        event.preventDefault(); // IE
                        _this.wrap("", "", _textareaId, _options);
                    };
                }) (this, textareaId, ids[i]), false);
            }
            
            return elemPopup;
        },
        
        buildCode: function(elemPopup, currentButton, textareaId) {
            var elemCol, elemItem, elemStg, i, c;   
            
            for (var category in this.codes) {
                elemCol = elemPopup.appendChild(document.createElement("div"));
                elemCol.className = "zform-code-col";
                elemStg = elemCol.appendChild(document.createElement("b"));             
                elemStg.style.display = "block";
                elemStg.style.fontWeight = "bold";
                elemStg.innerHTML = category;
                
                for (i=0, c=this.codes[category].length; i<c; i++) {
                    elemItem = elemCol.appendChild(document.createElement("span"));
                    elemItem.innerHTML = this.codes[category][i][1];
                    
                    this.addEvent(elemItem, "mousedown", (function(_this, _textareaId, _options) {
                        return function(event) {
                            event.preventDefault();
                            _this.wrap("", "", _textareaId, "blockcode", _options);
                        };
                    }) (this, textareaId, this.codes[category][i][0]));
                }
            }
            
            return elemPopup;           
        },
        
        wrap: function(startTag, endTag, textareaId, type, options, isFromPopup) {
            var field       = document.getElementById(textareaId);
            var scroll      = field.scrollTop;
            var selection   = (!isFromPopup) ? {
                before:     null,
                current:    null,
                after:      null,
                range:      null,
                startTag:   startTag,
                endTag:     endTag,
                textareaId: textareaId,
                type:       type,
                options:    options
            } : this.selection;
            
            field.focus();
            
            if (field.setSelectionRange) {
                if (!isFromPopup) {
                    selection.before    = field.value.substring(0, field.selectionStart);
                    selection.current   = field.value.substring(field.selectionStart, field.selectionEnd);
                    selection.after     = field.value.substring(field.selectionEnd);
                }
                
                field.blur();
                
                if (selection = this.tagType(selection, selection.type, selection.options, isFromPopup)) {  
                    field.value = selection.before + selection.startTag + selection.current + selection.endTag + selection.after;
                    field.focus();
                    field.setSelectionRange(selection.before.length + selection.startTag.length, selection.before.length + selection.startTag.length + selection.current.length);
                }
            } else { // IE < 9 with IE-only stuff
                if (!isFromPopup) {
                    selection.range     = document.selection.createRange();
                    selection.current   = selection.range.text;
                }
                
                if (selection = this.tagType(selection, selection.type, selection.options, isFromPopup)) {
                    selection.range.text = selection.startTag + selection.current + selection.endTag;
                    selection.range.moveStart("character",  -selection.endTag.length - selection.current.length);
                    selection.range.moveEnd("character",    -selection.endTag.length);
                    selection.range.select();
                }
            }
            
            field.scrollTop = scroll;
        },
        
        tagType: function(selection, type, options, isFromPopup) {
            if (!type)
                return selection;

            this.selection = selection;
            
            var input = "", href, text, regex;
            
            function iterateRows(txt, char) {
                var spltd = txt.split("\n");
                var order = (char === 0);
                
                for (var i=0, c=spltd.length; i<c; i++) {
                    spltd[i] = ((order) ? ++char + "." : char) + " " + spltd[i];
                }
                
                return spltd.join("\n");
            }
            
            switch (type) {
                case "link":
                    if (isFromPopup) {
                        href = document.getElementById("zform-modal-link-href").value;
                        text = document.getElementById("zform-modal-link-text").value;
                        
                        selection.current = "[" + text + "](" + href + ")";
                    } else {
                        regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
                        
                        if (regex.test(selection.current)){
                            
                            document.getElementById("zform-modal-link-href").value = selection.current;
                            document.getElementById("zform-modal-link-text").value = "";
                            document.getElementById("zform-modal-link-text").focus();
                        } else {
                            document.getElementById("zform-modal-link-text").value = selection.current;
                            document.getElementById("zform-modal-link-href").value = "";
                            document.getElementById("zform-modal-link-href").focus();                           
                        }
                        
                        return this.openPopup(type);
                    }
                    break;
                    
                case "image":
                    if (isFromPopup) {
                        var src   = document.getElementById("zform-modal-image-src").value;
                        text  = document.getElementById("zform-modal-image-text").value || "Image utilisateur";

                        selection.current = "![" + text + "](" + src + ")";
                    } else {
                        regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
                        
                        if (regex.test(selection.current)){
                            document.getElementById("zform-modal-image-src").value = selection.current;
                            document.getElementById("zform-modal-image-text").value = "";
                        } else {
                            document.getElementById("zform-modal-image-text").value = selection.current;
                            document.getElementById("zform-modal-image-src").value = "";                            
                        }
                        
                        return this.openPopup(type);
                    }
                    break; 

                case "quote":
                    selection.current = iterateRows(selection.current, ">");
                    break;

                case "information":
                case "attention":
                case "question":
                case "secret":          
                    selection.current = "[[" + type + "]]\n" + iterateRows(selection.current, "|");
                    break;

                case "error":
                    selection.current = "[[erreur]]\n" + iterateRows(selection.current, "|");
                    break;

                case "ul":
                    selection.current = iterateRows(selection.current, "-");
                    break;

                case "ol":
                    selection.current = iterateRows(selection.current, 0);
                    break;
                
                case "title1":
                case "title2":
                case "title3":
                case "title4":
                    for (var i=0, c=parseInt(type.charAt(5)); i<c; i++) {
                        input += "#";   
                    }
                    
                    selection.current = selection.current.replace(/^\s*?/, input + " ");
                    break;
                
                case "footnote":
                    if (!selection.current) return;
                    
                    if (input = prompt("Entrez la signification de cette abréviation")) {
                        selection.after += "\n\n*[" + selection.current +"]: " + input;
                    }
                    break;

                case "abbr":
                    if (isFromPopup) {
                        var valtext = document.getElementById("zform-modal-abbr-text").value;
                        if (valtext.trim() === "") {
                            valtext = document.getElementById("zform-modal-abbr-abbr").value;
                        }
                        selection.after += "\n\n*[" + document.getElementById("zform-modal-abbr-abbr").value + "]: "+ valtext;
                    } else {
                        if (selection.current.length < 10) {
                            document.getElementById("zform-modal-abbr-abbr").value = selection.current;
                            document.getElementById("zform-modal-abbr-text").value = "";
                        } else {
                            document.getElementById("zform-modal-abbr-text").value = selection.current;
                            document.getElementById("zform-modal-abbr-abbr").value = "";
                        }
                        
                        return this.openPopup(type);
                    }
                    break;

                case "blockcode":
                    selection.startTag = "```" + selection.options + ((selection.current.indexOf("\n") === 0) ? "" : "\n");
                    selection.endTag = "\n```";
                    break;  
            }
            
            if (!selection.startTag)
                selection.startTag = "";

            if (!selection.endTag)
                selection.endTag = "";
            
            return selection;                   
        }
    };
    
    zForm.addEvent(window, "load", (function(_this) {
        return function() {
            _this.init();
        };
    }) (zForm));
})();


/* ===== Zeste de Savoir ====================================================
   Search for solved topics when create a new topic
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function($, undefined){
    "use strict";

    var $solvedTopicsElem = $("main [data-solved-topics-url]");
    if($solvedTopicsElem.length > 0){
        //var solvedTopicsUrl = $solvedTopicsElem.attr("data-solved-topics-url");
        // TODO : le back fonctionne désormais
    }
})(jQuery);

/* ===== Zeste de Savoir ====================================================
   Gallery list and grid views management
   ---------------------------------
   Author: Sandhose / Quentin Gliech
   ========================================================================== */

(function($, undefined){
    "use strict";

    var $btn = $(".toggle-gallery-view"),
        $galleryView = $(".gallery");

    var updateBtn = function(){
        $btn.text($galleryView.hasClass("list-view") ? "Vue grille" : "Vue liste");
    };

    if($btn.length > 0){
        $btn.on("click", function(){
            if($galleryView.hasClass("list-view")) 
                $galleryView.removeClass("list-view").addClass("grid-view");
            else 
                $galleryView.removeClass("grid-view").addClass("list-view");
            updateBtn();
        });

        updateBtn();
    }

    var updateCheckbox = function(){
        if(this.checked) $(this).parents(".gallery-item").addClass("selected");
        else $(this).parents(".gallery-item").removeClass("selected");
    };

    if($galleryView.length > 0){
        $(".gallery-item input[type=checkbox]")
            .on("change", updateCheckbox)
            .each(updateCheckbox)
        ;
    }
})(jQuery);

/* ===== Zeste de Savoir ====================================================
   Manage karma AJAX requests (+1/-1 on messages)
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function($, undefined){
    "use strict";

    $(".topic-message").on("click", ".upvote, .downvote", function(e){
        var $thumb = $(this),
            $form = $(this).parents("form:first"),
            $karma = $thumb.parents(".message-karma:first"),
            $otherThumb = $thumb.hasClass("downvote") ? $karma.find(".upvote") : $karma.find(".downvote");

        var message = $form.find("input[name=message]").val(),
            csrfmiddlewaretoken = $form.find("input[name=csrfmiddlewaretoken]").val();

        $.ajax({
            url: $form.attr("action"),
            type: "POST",
            dataType: "json",
            data: {
                "message": message,
                "csrfmiddlewaretoken": csrfmiddlewaretoken
            },
            success: function(data){
                if(data.upvotes > 0){
                    $karma.find(".upvote").addClass("has-vote").text("+" + data.upvotes);
                } else {
                    $karma.find(".upvote").removeClass("has-vote").empty();
                }
                if(data.downvotes > 0){
                    $karma.find(".downvote").addClass("has-vote").text("-" + data.downvotes);
                } else {
                    $karma.find(".downvote").removeClass("has-vote").empty();
                }
                $thumb.toggleClass("voted");
                $otherThumb.removeClass("voted");
            }
        });

        e.stopPropagation();
        e.preventDefault();
    });
})(jQuery);


/* ===== Zeste de Savoir ====================================================
   Keyboard navigation in navigables lists, with j/k keys
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function(document, $, undefined){
    "use strict";
    
    $(document).ready(function(){
        var $lists = $("#content .navigable-list");

        if($lists.length > 0){
            var $navigableElems = $lists.find(".navigable-elem");

            $("body").on("keydown", function(e){
                if(!$(document.activeElement).is(":input") && (e.which === 74 || e.which === 75)){
                    var $current = $lists.find(".navigable-elem.active"),
                        nextIndex = null;

                    if($current.length === 1){
                        var currentIndex = $navigableElems.index($current);
                        if(e.which === 75){ // J
                            if(currentIndex > 0)
                                nextIndex = currentIndex - 1;
                        } else { // K
                            if(currentIndex + 1 < $navigableElems.length)
                                nextIndex = currentIndex + 1;
                        }
                    } else {
                        nextIndex = 0;
                    }

                    if(nextIndex !== null){
                        $current.removeClass("active");
                        activeNavigableElem($navigableElems.eq(nextIndex));
                    }
                }
            });

            $("#content .navigable-list")
            .on("focus", ".navigable-link", function(){
                if(!$(this).parents(".navigable-elem:first").hasClass("active")){
                    $lists.find(".navigable-elem.active").removeClass("active");
                    activeNavigableElem($(this).parents(".navigable-elem"));
                }
            })
            .on("blur", ".navigable-link", function(){
                $(this).parents(".navigable-elem:first").removeClass("active");
            });
        }

        function activeNavigableElem($elem){
            $elem
                .addClass("active")
                .find(".navigable-link")
                    .focus();
        }

        $("#content").on("DOMNodeInserted", ".navigable-list, .navigable-elem", function(){
            $lists = $("#content .navigable-list");
        });
    });
})(document, jQuery);

/* ===== Zeste de Savoir ====================================================
   Ugly markdown help block management
   TEMP : Add this to the future awesome Markdown editor directly
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function(document ,$, undefined){
    "use strict";

    function addDocMD($elem){
        $elem.each(function(){
            var $help = $("<div/>", {
                "class": "markdown-help",
                "html": "<div class=\"markdown-help-more\">" +
                        "<p>Les simples retours à la ligne ne sont pas pris en compte. Pour créer un nouveau paragraphe, pensez à <em>sauter une ligne</em> !</p>" +
                        "<pre><code>**gras** \n*italique* \n[texte de lien](url du lien) \n> citation \n+ liste a puces </code></pre>" +
                        "<a href=\"//zestedesavoir.com/tutoriels/221/rediger-sur-zds/\">Voir la documentation complète</a></div>" +
                        "<a href=\"#open-markdown-help\" class=\"open-markdown-help btn btn-grey ico-after view\">"+
                            "<span class=\"close-markdown-help-text\">Masquer</span>" +
                            "<span class=\"open-markdown-help-text\">Afficher</span> l'aide Markdown" +
                        "</a>"
            });
            $(this).after($help);
            $(".open-markdown-help, .close-markdown-help", $help).click(function(e){
                $(".markdown-help-more", $help).toggleClass("show-markdown-help");
                e.preventDefault();
                e.stopPropagation();
            });
        });
    }
    

    $(document).ready(function(){
        addDocMD($(".md-editor"));
        $("#content").on("DOMNodeInserted", ".md-editor", function(e){
            addDocMD($(e.target));
        });
    });
})(document, jQuery);

/* ===== Zeste de Savoir ====================================================
   Toggle message content for staff
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function($, undefined){
    "use strict";
    
    $("#content [href^=#show-message-hidden]").on("click", function(e){
        $(this).parents(".message:first").find(".message-hidden-content").toggle();
		e.preventDefault();
    });
})(jQuery);

/* ===== Zeste de Savoir ====================================================
   Mobile sidebar menu, swipe open/close
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function(window, document, $, undefined){
    "use strict";

    /**
     * Add class for mobile navigator does not support fixed position
     */
    var navU = navigator.userAgent;

    // Android Mobile
    var isAndroidMobile = navU.indexOf("Android") > -1 && navU.indexOf("Mozilla/5.0") > -1 && navU.indexOf("AppleWebKit") > -1;

    // Android Browser (not Chrome)
    var regExAppleWebKit = new RegExp(/AppleWebKit\/([\d.]+)/);
    var resultAppleWebKitRegEx = regExAppleWebKit.exec(navU);
    var appleWebKitVersion = (resultAppleWebKitRegEx === null ? null : parseFloat(regExAppleWebKit.exec(navU)[1]));
    var disableMobileMenu = isAndroidMobile && appleWebKitVersion !== null && appleWebKitVersion < 537;

    if(disableMobileMenu)
        $("html").removeClass("enable-mobile-menu");



    /**
     * Get prefix to support CSS transform
     */
    var transform = "";
    var prefixedPropertyNames = ["transform", "msTransform", "MozTransform", "WebkitTransform", "OTransform"];
    var prefixes = ["", "-ms-", "-moz-", "-webkit-", "-o-"];
    var tempDiv = document.createElement("div");
    for(var i = 0; i < prefixedPropertyNames.length; ++i){
        if(typeof tempDiv.style[prefixedPropertyNames[i]] !== "undefined"){
            transform = prefixes[i];
            break;
        }
    }
    transform = transform+"transform";



    /**
     * Manage mobile sidebar on resize
     */
    $(window).on("resize", function(){
        if(parseInt($("html").css("width")) < 960 && !disableMobileMenu){
            $(".page-container").css("width", $("html").css("width"));

            if(!$("#mobile-menu").hasClass("initialized")){
                $("#mobile-menu").addClass("initialized");


                /**
                 * Manage menu button
                 */
                $(".mobile-menu-btn").on("click", function(e){
                    if(!$("html").hasClass("show-mobile-menu")){
                        toggleMobileMenu(true);

                        e.preventDefault();
                        e.stopPropagation();
                    }
                });



                /**
                 * Build sidebar menu from page
                 */
                appendToSidebar($("#search"), true);
                appendToSidebar($(".logbox .my-account"), true);
                appendToSidebar($(".header-menu"));

                $(".page-container .mobile-menu-bloc .mobile-menu-bloc").each(function(){
                    appendToSidebar($(this));
                });
                $(".page-container .mobile-menu-bloc:not(.my-account-dropdown)").each(function(){
                    appendToSidebar($(this));
                });

                appendToSidebar($(".my-account-dropdown"));
            }


            /**
             * Manage touch events for mobile sidebar
             */
            if(!$("#mobile-menu").hasClass("initialized-events")){
                var beginTouchDown = 0;
                var borderWidth    = 50;
                var swipping       = false;

                $("body")
                .on("touchstart", function(e){
                    beginTouchDown = parseInt(e.originalEvent.touches[0].pageX, 10) - $(".page-container").offset().left;
                });

                $(".page-container")
                .on("touchmove", function(e){
                    if(swipping || parseInt(e.originalEvent.touches[0].pageX, 10) - $(this).offset().left < borderWidth){
                        e.preventDefault();
                        $("body:not(.swipping)").addClass("swipping");
                        
                        swipping   = true;

                        var toMove = parseInt(e.originalEvent.touches[0].pageX, 10) - beginTouchDown;
                        toMove     = (toMove * 100) / parseInt($("html").width());

                        if(toMove > 0 && toMove < 90){
                            var props = {};
                            props[transform] = "translate3d("+toMove+"%, 0, 0)";
                            $(this).css(props);

                            toMove  = ((toMove * 20) / 90) - 20;
                            props[transform] = "translate3d("+toMove+"%, 0, 0)";
                            $("#mobile-menu").css(props);
                        }
                    }
                })
                .on("touchend touchleave touchcancel", function(){
                    if(swipping){
                        var offset  = parseInt($(this).offset().left);
                        var width   = parseInt($("html").width());
                        var visible = (offset > width/3 && !$("html").hasClass("show-mobile-menu")) || (offset > width-width/3 && $("html").hasClass("show-mobile-menu"));
                        toggleMobileMenu(visible);

                        swipping = false;
                        $("body").removeClass("swipping");

                        var props = {};
                        props[transform] = "";
                        $(".page-container, #mobile-menu").css(props);
                    }
                });

                
                $(".page-container").on("click", function(e){
                    if($("html").hasClass("show-mobile-menu")){
                        toggleMobileMenu(false);

                        e.preventDefault();
                        e.stopPropagation();
                    }
                });


                $("#mobile-menu").addClass("initialized-events");
            }
        } else {
            $("html").removeClass("show-mobile-menu");
            $("#mobile-menu").removeClass("initialized-events");
            $(".page-container").removeAttr("style");
            $(".page-container").off("click touchstart touchmove touchend");
        }
    });
    $(window).trigger("resize");



    function appendToSidebar($elem, force){
        if($elem.hasClass("mobile-menu-imported"))
            return;

        if(force){
            $elem.addClass("mobile-menu-imported");
            $elem.clone().removeAttr("id").appendTo("#mobile-menu");
            return;
        }

        var $div = $("<div/>");
        $div.addClass("mobile-menu-bloc");
        $div.attr("data-title", $elem.attr("data-title"));

        if($elem.hasClass("mobile-show-ico"))
            $div.addClass("mobile-show-ico");

        var $links = ($elem.hasClass("mobile-all-links")) ? $("a, button, span.disabled", $elem).not(".action-hover").addClass("mobile-menu-link") : $(".mobile-menu-link", $elem);

        $links.each(function(){
            if($(this).parents(".mobile-menu-imported, .modal").length === 0){
                var $elem = $(this).clone().addClass("light");
                var formId;

                if($(this).is("button")){
                    var $form = $(this).parents("form:first");
                    if(!$form.attr("id")){
                        formId = "form" + $(".identified-form").length;
                        $form.attr("id", formId).addClass("identified-form");
                    } else {
                        formId = $form.attr("id");
                    }
                    $elem.attr("form", formId);
                }

                $div.append($elem);
            }
        });

        $elem.addClass("mobile-menu-imported");

        $div.appendTo($("#mobile-menu"));
    }





    /**
     * Toggle sidebar for mobiles
     */
    function toggleMobileMenu(visible){
        var scrollTop;
        if(visible === null)
            visible = !$("html").hasClass("show-mobile-menu");

        $("body").removeClass("swipping");

        var viewportmeta = document.querySelector("meta[name=\"viewport\"]");

        if(visible){
            if(!$("html").hasClass("show-mobile-menu")){
                scrollTop = $(document).scrollTop();
                $(".page-container").css({
                    "margin-top": "-" + scrollTop + "px",
                    "padding-bottom": scrollTop + "px"
                });
                $("html").addClass("show-mobile-menu");

                viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0";
            }

            // Manage back button to close sidebar
            /*
            if(history && history.pushState){
                history.pushState(null, document.title, this.href);

                $(window).off("popstate").one("popstate", function(e){
                    if($("html").hasClass("show-mobile-menu"))
                        toggleMobileMenu(false);
                    else
                        window.history.back();
                });
            }
            */
        } else {
            $("html").removeClass("show-mobile-menu");

            // Reset CSS modifications for restore scroll
            scrollTop = parseInt($(".page-container").css("padding-bottom"));
            $(".page-container").css({
                "margin-top": "",
                "padding-bottom": ""
            });
            if(scrollTop > 0)
                $(document).scrollTop(scrollTop);

            // Stop swipping
            $("body").removeClass("swipping");

            setTimeout(function(){
                // Reinit mobile menu at top
                $("#mobile-menu").scrollTop(0);

                // Restore zoom
                viewportmeta.content = "width=device-width, minimum-scale=1.0, initial-scale=1.0";

                // Bugfix <html> element
                $("html").css({
                    "position": "absolute",
                    "left": "0"
                });
                setTimeout(function(){
                    $("html").removeAttr("style");
                }, 500);
            }, 200);
        }
    }




    /**
     * Manage actions buttons, move them at the top af core of page
     */
    $(window).on("resize", function(){
        if(parseInt($("html").css("width")) < 960 && !disableMobileMenu){
            var $newBtns = $(".sidebar .new-btn:not(.mobile-btn-imported)");
            if($newBtns.length > 0){
                var $prevElem = $("#content")
                    .find("> .content-wrapper, > .full-content-wrapper, > .content-col-2")
                    .first()
                    .find("h1, h2")
                    .first();
                if($prevElem.next(".license").length > 0)
                    $prevElem = $prevElem.next(".license");
                if($prevElem.next(".subtitle").length > 0)
                    $prevElem = $prevElem.next(".subtitle");
                if($prevElem.next(".taglist").length > 0)
                    $prevElem = $prevElem.next(".taglist");

                var $newBtnContainer = $("<div/>", {
                    "class": "new-btn-container"
                });
                $newBtns.each(function(){
                    $newBtnContainer.append($(this).clone().removeAttr("id").removeClass("blue"));
                    $(this).addClass("mobile-btn-imported");
                });
                $prevElem.after($newBtnContainer);
            }
        }
    });
    $(window).trigger("resize");
})(window, document, jQuery);

/* ===== Zeste de Savoir ====================================================
   Manage modals boxes
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function(document, $, undefined){
    "use strict";
    
    var $overlay = $("<div/>", {
        "id": "modals-overlay"
    }).on("click", function(e){
        closeModal();
        e.preventDefault();
        e.stopPropagation();
    });

    var $modals = $("<div/>", { "id": "modals" });
    $("body").append($modals);
    $modals.append($overlay);

    function buildModals($elems){
        $elems.each(function(){
            $modals.append($(this).addClass("tab-modalize"));
            $(this).append($("<a/>", {
                class: "btn btn-cancel " + ($(this).is("[data-modal-close]") ? "btn-modal-fullwidth" : ""),
                href: "#close-modal",
                text: $(this).is("[data-modal-close]") ? $(this).attr("data-modal-close") : "Annuler",
                click: function(e){
                    closeModal();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }));
            var $link = $("[href=#"+$(this).attr("id")+"]:first");
            var linkIco = $link.hasClass("ico-after") ? " light " + $link.attr("class").replace(/btn[a-z-]*/g, "") : "";
            $(this).prepend($("<span/>", {
                class: "modal-title" + linkIco,
                text: $link.text()
            }));
        });
    }

    $("body").on("click", ".open-modal", function(e){
        $overlay.show();
        $($(this).attr("href")).show(0, function(){
            $(this).find("input:visible, select, textarea").first().focus();
        });
        if(!$("html").hasClass("enable-mobile-menu"))
            $("html").addClass("dropdown-active");

        e.preventDefault();
        e.stopPropagation();
    });

    $("body").on("keydown", function(e){
        // Escape close modal
        if($(".modal:visible", $modals).length > 0 && e.which === 27){
            closeModal();
            e.stopPropagation();
        }
    });

    function closeModal(){
        $(".modal:visible", $modals).fadeOut(150);
        $overlay.fadeOut(150);
        $("html").removeClass("dropdown-active");
    }


    $(document).ready(function(){
        buildModals($(".modal"));
        $("#content").on("DOMNodeInserted", ".modal", function(e){
            buildModals($(e.target));
        });
    });
})(document, jQuery);

/* ===== Zeste de Savoir ====================================================
   Auto submit forms
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function($, undefined){
    "use strict";
    
    $("body").on("change", ".select-autosubmit", function() {
        $(this).parents("form:first").submit();
    });
})(jQuery);

/* ===== Zeste de Savoir ====================================================
   Toggle spoiler content
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function(document, $, undefined){
    "use strict";
    
    function buildSpoilers($elem){
        $elem.each(function(){
            $(this).before($("<a/>", {
                text: "Afficher/Masquer le contenu masqué",
                class: "spoiler-title ico-after view",
                href: "#",
                click: function(e){
                    $(this).next(".spoiler").toggle();
                    e.preventDefault();
                }
            }));
        });
    }

    $(document).ready(function(){
        buildSpoilers($("#content .spoiler"));
        $("#content").on("DOMNodeInserted", ".spoiler", function(e){
            buildSpoilers($(e.target));
        });
    });
})(document, jQuery);

/* ===== Zeste de Savoir ====================================================
   Keyboad accessibility for overlayed boxes (modals, etc)
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function($, undefined){
    "use strict";
    
    $("body").on("keydown", function(e){
        var $modal = $(".tab-modalize:visible");
        if($modal.length > 0){
            // Tab do not go out modal
            if(e.which === 9){
                var $current = $modal.find(":focus"),
                    $tabbables = $modal.find(":tabbable"),
                    nextIndex = e.shiftKey ? $tabbables.length - 1 : 0;

                if($current.length === 1){
                    var currentIndex = $tabbables.index($current);
                    if(e.shiftKey){
                        if(currentIndex > 0)
                            nextIndex = currentIndex - 1;
                    } else {
                        if(currentIndex + 1 < $tabbables.length)
                            nextIndex = currentIndex + 1;
                    }
                }

                $tabbables.eq(nextIndex).focus();
                e.stopPropagation();
                e.preventDefault();
            }
        }
    });
})(jQuery);

/* ===== Zeste de Savoir ====================================================
   Zen mode for content-pages
   ---------------------------------
   Author: Alex-D / Alexandre Demode
   ========================================================================== */

(function($, undefined){
    "use strict";

    if($(".article-content").length > 0){
        $(".content-container .taglist ~ .authors").before($("<button/>", {
            class: "btn btn-grey ico-after view open-zen-mode",
            text: "Lecture zen",
            click: function(e){
                $(".content-container").toggleClass("zen-mode tab-modalize");
                $(this).blur();
                e.preventDefault();
                e.stopPropagation();
            }
        }));

        $("body").on("keydown", function(e){
            // Escape close modal
            if($(".zen-mode").length > 0 && e.which === 27){
                $(".content-container").toggleClass("zen-mode tab-modalize");
                $(this).blur();
                e.stopPropagation();
            }
        });
    }
})(jQuery);