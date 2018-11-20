(function (window, document, undefined) {

    var quotes = {
        "list": [
            "Software Engineer at American Gaming Systems"
        ]
    };

    function randInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }

    function insertQuote () {
        var quote = quotes.list[randInt(quotes.list.length)];
        document.getElementById('raqo-container').innerHTML = quote;
    }

    var raqo = {
        insertQuote: insertQuote
    }

    window.onload = function () {insertQuote();};
    window.raqo = raqo;

})(window, document);