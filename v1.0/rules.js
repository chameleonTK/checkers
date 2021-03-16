function CheckerRules(board) {
    var vm = this;
    vm.board = board;
}

//visited is for recursive call
CheckerRules.prototype.nextMoves = function(player, token) {
    var vm = this;
    var moves = []
    var vm = this;

    var offsets = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
    var n = 7;

    if (!token.isKing) {
        n = 1;
        if (player.pid==0) {
            offsets = [[1, 1], [1, -1]];
        } else {
            offsets = [[-1, 1], [-1, -1]];
        }
    }

    var tokenMap = vm.board.getTokenMap();
    
    var _moves = [];
    var _jump = []
    offsets.forEach(offset => {
        var tilesOnDir = [];

        var foundObject = false;
        for(i=1;i <=n; i++) {
            var tile = vm.board.getTile(token.x+i*offset[0], token.y+i*offset[1]);
            if (!tile) {
                break;
            }

            var unkownObject = tokenMap[tile.x][tile.y];
            if (!unkownObject) {
                tilesOnDir.push(tile);
                continue;
            }

            foundObject = true;
            //Rule: Cannot jump over your own tokens
            if (unkownObject.ownBy == player.pid) {
                _moves.push(tilesOnDir);
                break;
            } else {
                
                var nextTile = vm.board.getTile(token.x+(i+1)*offset[0], token.y+(i+1)*offset[1]);
                if (!nextTile) {
                    _moves.push(tilesOnDir);
                    break;
                }

                if (!!tokenMap[nextTile.x][nextTile.y]) {
                    _moves.push(tilesOnDir);
                    break;
                }

                _jump.push(nextTile);

                break;
            }
        }

        if (!foundObject) {
            _moves.push(tilesOnDir);
        }
    })


    if (_jump.length == 0) {
        moves = _moves.flat();
        return {
            moves: moves,
            jump: false
        };
    } else {
        //Rule: Must jump if possible
        //TODO: implement a condition that force a player to move a token that it can jump over the opp's tokens;

        moves = _jump;
        return {
            moves: moves,
            jump: true
        };
    }
    
}


CheckerRules.prototype.resolve = function(opponent, startTile, endTile) {
    //TODO: does not work when move through many tiles at the same time;
    var offsetX = Math.sign(startTile.x - endTile.x);
    var offsety = Math.sign(startTile.y - endTile.y);

    var tokenMap = this.board.getTokenMap();
    //Just simple move
    if (Math.abs(startTile.x - endTile.x) == 1) {
        return {removedToken:[]};
    }

    var removingTile = this.board.getTile(endTile.x + offsetX, endTile.y + offsety);
    var removingToken = tokenMap[removingTile.x][removingTile.y];
    if (!removingToken) {
        return {removedToken:[]};
    }

    if (removingToken.ownBy != opponent.pid) {
        alert("500: Someting went wrong")
        return {removedToken:[]};
    }

    opponent.tokens = opponent.tokens.filter(t => {
        return (t.x != removingToken.x) || (t.y != removingToken.y)
    })

    this.board.tokens[opponent.pid] = opponent.tokens;

    removingToken.DOM.remove()
    return {
        selectedToken: tokenMap[endTile.x][endTile.y],
        removedToken: [removingToken],
    };
}

CheckerRules.prototype.validate = function() {
    return false;
}

