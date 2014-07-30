// add stuff here!

TTT = {};

function Player(player) {
    this.id = player.id;
    this.name = 'Player ' + player.id;

    $('input[name=name]').val(this.name);

    this.save = function() {
        var name = $('input[name=name]').val();

        $.post('/players/' + this.id, {
            name: name
        });
    };
}

$(function() {
    $.post('/player').then(function(player) {
        TTT.player = new Player(player);
    });

    $.get('/boards').then(function(boards) {
        showBoardList(boards);
    });
});

function showBoardList(boards) {
    boards.forEach(function(board) {
        var $boardListing = $('<a href="#" class="open-board">Board ' + board.id + '</a>');
        $('.boards').append($boardListing);
        $boardListing.on('click', function(e) {
            e.preventDefault();
            loadBoard(board.id);
        });
    });
}

function loadBoard(boardId) {
    $.post('/boards/' + boardId + '/add/' + TTT.player.id)
        .done(function() {
            $.get('/boards/' + boardId).then(function(board) {
                displayBoard(board);
            });
        })
        .fail(function() {
            showMessage('Board is full!');
        });
}


