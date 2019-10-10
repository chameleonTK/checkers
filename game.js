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
        colors: [player1.color, player2.color],
        notifiers: [player1.notifier, player2.notifier]
    });

    var rules = new CheckerRules(vm.board);
    Game.call(vm, player1, player2, vm.board);

    pubsub.subscribe('token/selected', function(token) {
        vm.board.disabledTiles();
        if (!!token) {
            var playableTiles = rules.nextMoves(token, vm.board.getTiles());
            playableTiles.forEach(tile => {
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