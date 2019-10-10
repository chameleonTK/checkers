function Game(player1, player2, board) {
    var vm = this;
    vm.players = [player1, player2];
    vm.player1 = player1;
    vm.player2 = player2;

    vm.turn = 0;
    vm.board = board;
}

Game.prototype.getActivePlayer = function() {
    return this.players[this.turn];
}

Game.prototype.getOpponent = function() {
    return this.players[(this.turn+1)%2];
}

Game.prototype.start = function() {
    this.board.render();

    var tokens = this.board.getTokens();
    this.player1.setTokens(tokens[0])
    this.player2.setTokens(tokens[1])

    this.player1.updateStat();
    this.player2.updateStat();

    this.getActivePlayer().activate();
    this.getActivePlayer().move();
}

function Checkers(player1, player2, options) {
    var vm = this;
    vm.board = new Board(options["game-container"], {
        players: [{
            ownBy: player1.pid,
            color: player1.color,
            notifier: player1.notifier,
            tokenPos: [
                [0, 4]
                
                // [0, 1], [0, 3], [0, 5], [0, 7],
                // [1, 0], [1, 2], [1, 4], [1, 6],
            ],
        },
        {
            ownBy: player2.pid,
            color: player2.color,
            notifier: player2.notifier,
            tokenPos: [
                [1, 3], [3, 1], [5, 1], [4, 4], [2, 4]
                // [2, 1], [3, 2], [5, 2],
                // [6, 1], [6, 3], [6, 5], [6, 7],
                // [7, 0], [7, 2], [7, 4], [7, 6],
            ],
        }]
    });

    var rules = new CheckerRules(vm.board);
    Game.call(vm, player1, player2, vm.board);

    pubsub.subscribe('token/selected', function(token) {
        vm.board.disabledTiles();
        if (!!token) {
            var playableTiles = rules.nextMoves(vm.getActivePlayer(), token);
            playableTiles.moves.forEach(tile => {
                tile.highlight(true)
                tile.enable();
            })
        }
    });

    pubsub.subscribe('token/moving', function() {
        vm.board.disableClick();
    });

    pubsub.subscribe("token/moved", function() {

        
        //TODO: resolve => remove tokens
        rules.resolve(vm.board);
        vm.board.disableClick();
        
        vm.player1.updateStat();
        vm.player2.updateStat();

        vm.getActivePlayer().deactivate();
        vm.turn = (vm.turn+1)%2;
        vm.getActivePlayer().activate();
        vm.getActivePlayer().move();
    });

    

}
Checkers.prototype = Object.create(Game.prototype);