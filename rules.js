function CheckerRules(board) {
    var vm = this;
    vm.board = board;
}

CheckerRules.prototype.nextMoves = function(player, token, tiles) {
    var vm = this;
    var moves = vm.board.nearBy(token)
                .filter(tile => tile.playable)
                .filter(tile => vm.board.isEmpty(tile))

    if (!token.isKing) {
        if (player.pid==0) {
            moves = moves.filter(tile => tile.x > token.x);
        } else {
            moves = moves.filter(tile => tile.x < token.x);
        }
    }

    //TODO: implement a condition that force a player to move over the opp if he can
    return moves;
}

CheckerRules.prototype.resolve = function() {
    return false;
}

CheckerRules.prototype.validate = function() {
    return false;
}
