"use strict";
(function($) {

    $.fn.flowchat = function(options) {

        // override options with user preferences

        var settings = $.extend({
            delay: 1500,
            startButtonId: '#btn-submit',
            autoStart: true,
            startMessageId: 1,
            dataJSON: null
        }, options);

        var container = $(this);

        $(function() {
          if(settings.autoStart)
            startChat(container, settings.dataJSON, settings.startMessageId, settings.delay)
        });

        // on click of Start button
        $(document).on('click', settings.startButtonId, function() {

            startChat(container, settings.dataJSON, settings.startMessageId, settings.delay)

        });
    }

    $(document).on('submit', '#form', function(e) {
        e.preventDefault();
        var question = $('#botvalue').val();
        question(container, settings.dataJSON, question, settings.delay);
        $('#botvalue').val('');
    });
    

    function selectOption($this, container, data, delay) {
        $this.parent().hide();
        var $userReply = $('<li class="user"><div class="text">' + $this.html() + '</div></li>');
        container.children('.chat-window').append($userReply);

        // get the next message
        var nextMessageId = $this.attr('data-nextId');
        var nextMessage = findMessageInJsonById(data, nextMessageId);

        // // add next message
        generateMessageHTML(container, data, nextMessage, delay);
    }

    function startChat(container, data, startId, delay) {
        // clear chat window
        container.html(
           " <div class='chatbox__header'>"+
            "<div class='chatbox__image--header'>"+
              "<img src='./src/img/logo.png' alt='image'>"+
                "</div>"+
            "<div class='chatbox__content--header'>"+
                "<h3 class='chatbox__heading--header' id='heading'>बायोगैस</h3>" +
                "<p class='chatbox__description--header' id='description'>नवीन एवं नवीकरणीय ऊर्जा मंत्रालय(MNRE)</p>"+ 
            "</div>"+
        "</div>" +

    
          "<ul class='chat-window'> "+" </ul>" + 

           
       "<div class='chatbox__footer'>" +
        
       "<select id='dynamic_select'onchange='myFunction()'>" +
       "<option value='' selected>Language</option>" +
       "<option value='english'>English</option>" +
       "<option value='hindi'>Hindi</option>" +
       "</select>" +
    "<script>"+
   " function myFunction() {"+
       " var select = document.getElementById('dynamic_select');"+
       " var selectedValue = select.value;"+
      
      "  if (selectedValue === 'english') {"+
         " window.location.href = 'index.html';"+
       " } else if (selectedValue === 'hindi') {"+
          "window.location.href = 'hindi.html';"+
    "    }"+
    "  }"+
      "</script>"+
      

           "<form id='form' method='get' accept-charset='utf-8'>"+
                "<input type='text; name='botvalue' id='botvalue' placeholder='ऊपर दिए गए विकल्प को स्पर्श करें!'' />"+
                "<button type='submit' class='submit'>Send</button>"+
          " </form>" +
       " </div>"+
       

    "</div>"
  
                // "<header class='chatbox__content--header'>" +
                //     "<div class='header-chat'>" +
                    
                //     "<img src='./src/img/logo.png' alt='image'>" +
                    
                //         "<h3 class='chatbox__heading--header' id='heading'>Chatbot</h3>" + "<P class='chatbox__description--header' id='description' >Ministry of New And Renewable Energy(MNRE)</P>" +
                //          "</div>" + "</header>" +

                //         "<ul class='chat-window'> "+" </ul>" + 

                //         "<footer class='footer-chat'>" +
                //     "<div class='footer-content'>" +
                //         "<p>kasper <sup>infotech</sup></p>" +
                //     "</div>" +
                // "</footer>"
               
                
            
            );
        container.append();

        // get the first message
        var message = findMessageInJsonById(data, startId);

        // add message
        generateMessageHTML(container, data, message, delay);
    }

    function findMessageInJsonById(data, id) {

        var messages = data;

        for (var i = 0; messages.length > i; i++)
            if (messages[i].id == id)
                return messages[i];

    }
    

    function addOptions(container, data, delay, m) {

        var $optionsContainer = $('<li class="options"></li>');

        var $optionsList = $('<ul></ul>');

        var optionText = null;

        var optionMessageId = null;

        for (var i = 1; i < 12; i++) {
            optionText = m["option" + i]
            optionMessageId = m["option" + i + "_nextMessageId"]

            if (optionText != "" && optionText != undefined && optionText != null) { // add option only if text exists
                var $optionElem = $("<li data-nextId=" + optionMessageId + ">" + optionText + "</li>");

                $optionElem.click(function() {
                    selectOption($(this), container, data, delay)
                });

                $optionsList.append($optionElem);
            }
        }

        $optionsContainer.append($optionsList);

        return $optionsContainer;
    }

    function toggleLoader(status, container) {
        if (status == "show")
            container.children('.chat-window').append("<li class='typing-indicator'><span></span><span></span><span></span></li>");
        else
            container.find('.typing-indicator').remove();
    }

    function generateMessageHTML(container, messages, m, delay) {
        // create template if text is not null '<img src="' + m.imageUrl + '"><br/>' + m.text + '
        console.log(m.imageUrl);
        if (m.imageUrl != '')
            var $template = $('<li class="bot"><div class="text">' + '<a href="' + m.text + '"></a><br/>' + m.imageUrl + '</div></li>');
        else if (m.text != '')
            var $template = $('<li class="bot"><div class="text">' + m.text + '</div></li>');
        else
            var $template = $('');

        toggleLoader("show", container);

        container.children(".chat-window").scrollTop($(".chat-window").prop('scrollHeight'));

        // add delay to chat message
        setTimeout(function() {

            toggleLoader("hide", container);

            container.children('.chat-window').append($template);

            // if the message is a question then add options
            if (m.messageType == "Question")
                container.children('.chat-window').append(addOptions(container, messages, delay, m));

            container.children(".chat-window").scrollTop($(".chat-window").prop('scrollHeight'));

            // call recursively if nextMessageId exists
            if (m.nextMessageId != "") {
                var nextMessage = findMessageInJsonById(messages, m.nextMessageId)
                generateMessageHTML(container, messages, nextMessage, delay)
            }

        }, delay);
        // end delay
    } // end function
}(jQuery));