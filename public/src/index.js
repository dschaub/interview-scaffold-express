// add stuff here!

(function($) {

    var $userContainer = $('.user-info'),
        $tickerContainer = $('.tickers'),
        $holdingsContainer = $('.current-holdings');

    var tickersByID = {};

    function loadUserInfo() {
        $.get('/me').then(function(user) {
            user.balance = accounting.formatMoney(user.balance);
            $userContainer.html(render('user', user));
        });
    }

    function loadTickers() {
        $tickerContainer.empty();

        $.get('/tickers')
            .then(function(tickers) {
                tickers.forEach(function(ticker) {
                    tickersByID[ticker.id] = ticker;
                    ticker.price = accounting.formatMoney(ticker.price);
                });

                return tickers;
            })
            .then(renderAll($tickerContainer, 'ticker'))
            .fail(function() {
                $tickerContainer.html('Could not get tickers.');
            });
    }

    function loadCurrentHoldings() {
        $holdingsContainer.empty();

        $.get('/holdings')
            .then(function(holdings) {
                holdings.forEach(function(holding) {
                    holding.ticker = tickersByID[holding.tickerID];
                    holding.balance = accounting.formatMoney(holding.balance);
                });

                return holdings;
            })
            .then(renderAll($holdingsContainer, 'holding'))
            .fail(function() {
                $holdingsContainer.html('Could not get current holdings.');
            });
    }

    function render(template, args) {
        var html = $('#' + template).html();
        Mustache.parse(html);
        return Mustache.render(html, args);
    }

    function renderAll($container, template) {
        return function(items) {
            if (items.length === 0) {
                $container.html('Nothing to show.');
            } else {
                items.forEach(function(item) {
                    $container.append(render(template, item));
                });
            }
        };
    }

    $(function() {
        loadTickers();
        loadCurrentHoldings();
        loadUserInfo();
    });

})(jQuery);
