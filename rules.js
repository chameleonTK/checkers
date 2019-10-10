function CheckerRules(board) {
    var vm = this;
    vm.board = board;
}

//visited is for recursive call
CheckerRules.prototype.nextMoves = function(player, token, visited) {
    var vm = this;
    var moves = []
    var vm = this;

    var offsets = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
    var n = 7;

    if (token.isKing) {
        n = 1;
        if (player.pid==0) {
            offsets = [[1, 1], [1, -1]];
        } else {
            offsets = [[-1, 1], [-1, -1]];
        }
    }

    var tokenMap = vm.board.getTokenMap();

    //From recursive call: remove opp's tokens that have been removed from the prev calls
    if (!!visited) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (visited[i][j] >= 2) {
                    tokenMap[i][j] = undefined;
                }
            }
        }
    }
        
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

                _jump.push({
                    nextTile: nextTile,
                    oppToken: unkownObject
                });


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


        if (!visited) {
            //Start recursive
            visited = [];
            for (let i = 0; i < 8; i++) {
                var m = []
                for (let j = 0; j < 8; j++) {
                    m.push(0);
                }
                visited.push(m);
            }
        }


        moves = vm.recursivelyJump(player, _jump, visited);
        return {
            moves: moves,
            jump: true
        };
    }
    
    
}

CheckerRules.prototype.recursivelyJump = function(player, candidates, visited) {

    var moves = []
    while(candidates.length > 0) {
        var jmp = candidates.shift();
        
        var tile = jmp.nextTile;
        var oppToken = jmp.oppToken;

        if (visited[tile.x][tile.y]%2 == 1) {
            continue;
        }

        //TODO: simplify this logic

        // value in visited[i][j] 
        //     * +1 => visited
        //     * +2 => an opp's tokens has been removed in that pos
        visited[tile.x][tile.y] += 1;
        visited[oppToken.x][oppToken.y] += 2;

        moves.push(tile);

        var _moves = this.nextMoves(player, tile, visited);
        visited[oppToken.x][oppToken.y] -= 2;
        if (_moves.jump) {
            moves.push(_moves.moves);
            moves = moves.flat()
        }
    }

    return moves;
    
}

CheckerRules.prototype.resolve = function() {
    return false;
}

CheckerRules.prototype.validate = function() {
    return false;
}

