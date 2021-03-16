function Game(player1, player2, board) {
    var vm = this;
    
    vm.turn = 0;
    vm.board = board;
}



Game.prototype.start = function() {

    this.getActivePlayer().activate();
    this.getActivePlayer().move();
}

function Checkers(player1, player2, options) {
    var vm = this;
    

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

    pubsub.subscribe("token/moved", function(startTile, endTile) {
        var o = rules.resolve(vm.getOpponent(), startTile, endTile);
        var removedTiles = o.removedToken;
        vm.board.disableClick();
        
        vm.player1.updateStat();
        vm.player2.updateStat();

        
        if (removedTiles.length > 0) {
            var selectedToken = o.selectedToken;
            var nextMoves = rules.nextMoves(vm.getActivePlayer(), selectedToken);
            if (nextMoves.jump) {
                //TODO: this implementation can only move the selected token;
                vm.getActivePlayer().activate();
                vm.getActivePlayer().move();

                return true;
            }
        }

        vm.getActivePlayer().deactivate();
        vm.turn = (vm.turn+1)%2;
        vm.getActivePlayer().activate();
        vm.getActivePlayer().move();
        return true;
    });

    

}
Checkers.prototype = Object.create(Game.prototype);