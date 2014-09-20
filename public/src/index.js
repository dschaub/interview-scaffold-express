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
                $container.html('<tr><td colspan="4">Nothing to show.</td></tr>');
            } else {
                items.forEach(function(item) {
                    $container.append(render(template, item));
                });
            }
        };
    }

    function getTransactionParams(button) {
        var tickerID = $(button).closest('.info-row').data('id'),
            shares = $(button).closest('.info-row').find('[name=shares]').val();

        return {
            type: $(button).is('.buy') ? 'BUY' : 'SELL',
            tickerID: tickerID,
            shares: shares
        };
    }

    function clearInput(button) {
        $(button).closest('.info-row').find('[name=shares]').val('');
    }

    $(function() {
        loadTickers();
        loadCurrentHoldings();
        loadUserInfo();
    });

    $(document).on('click', '.buy, .sell', function() {
        $.post('/transaction', getTransactionParams(this)).then(function() {
            clearInput(this);
            loadCurrentHoldings();
            loadUserInfo();
        }.bind(this));
    });

})(jQuery);
