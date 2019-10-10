function CheckerRules(board) {
    var vm = this;
    vm.board = board;
}

CheckerRules.prototype.nextMoves = function(token, tiles) {
    var vm = this;
    var moves = vm.board.nearBy(token)
                .filter(tile => tile.playable)
                .filter(tile => vm.board.isEmpty(tile))

    if (!token.isKing) {
        //TODO: if can only move forward
    }
    return moves;
}

CheckerRules.prototype.resolve = function() {
    return false;
}

CheckerRules.prototype.validate = function() {
    //TODO: implement
    return false;
}
