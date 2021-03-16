function Board(container, options) {
    
}

Board.prototype.render = function() {
    this.initTokens();
    this.disableClick();
}

Board.prototype.getTokens = function() {
    return this.tokens;
}

Board.prototype.getTokenMap = function() {
    var tokenMap = []
    for (let i = 0; i < 8; i++) {
        var m = []
        for (let j = 0; j < 8; j++) {
            m.push(undefined);
        }
        tokenMap.push(m);
    }

    this.tokens.flat().forEach(token => {
        tokenMap[token.x][token.y] = token;
    });
    return tokenMap;
}

Board.prototype.initTokens = function() {
    //
}

Board.prototype.disableClick = function() {
    var vm = this;
    vm.disabledTiles();

    vm.tokens.forEach(row => {
        row.forEach(token=>{
            token.disable();
        })
    })
}

Board.prototype.disabledTiles = function() {
    var vm = this;
    vm.tiles.forEach(row => {
        row.forEach(tile=>{
            tile.disable();
            tile.highlight(false);
        })
    })
}

Board.prototype.getTiles = function() {
    return this.tiles;
}

Board.prototype.getTile = function(x, y) {
    if (x < 0) return undefined;
    if (x >= this.tiles.length) return undefined;

    if (y < 0) return undefined;
    if (y >= this.tiles.length) return undefined;

    return this.tiles[x][y];
}


Board.prototype.renderBoard = function() {
    /// renderboard
}

Board.prototype.isEmpty = function(tile) {
    var underToken = this.tokens.flat().filter(token => {
        return (token.x == tile.x) && (token.y == tile.y);
    })

    if (underToken.length > 0) return false;
    return true;
}

Board.prototype.nearBy = function(tile) {
    return [
        this.getTile(tile.x-1, tile.y-1),
        this.getTile(tile.x-1, tile.y+1),
        this.getTile(tile.x+1, tile.y-1),
        this.getTile(tile.x+1, tile.y+1),
    ].filter(tile=>{
        return !!tile;
    })
}

function Tile(x, y, DOM, notifier) {
    var vm = this;
    vm.x = x;
    vm.y = y;

    vm.DOM = DOM
    vm.clickable = false;
    vm.playable = true;
    if (!!notifier) {
        vm.notifier = notifier;
        vm.DOM.on("click", (e) => {
            if (!vm.clickable) {
                e.preventDefault();
                return false;
            }
        
            vm.notifier.publish('tile/click', [vm]);
        });
        
        vm.notifier = notifier;
    }
    
}




function Token(x, y, container, color, notifier, ownBy) {
    //
}

Token.prototype = Object.create(Tile.prototype);



Token.prototype.moveTo = function(tiles) {
    var vm = this;
    vm.deselect();
    
    tiles.forEach((tile, i) => {
        vm.DOM.animate({
            left: (tile.y)*10+"vmin",
            top: (tile.x)*10+"vmin",
          }, {
              duration: 500,
              complete: function() {
                  var _x = vm.x;
                  var _y = vm.y;
                  
                  vm.x = tile.x;
                  vm.y = tile.y;

                  if (i >= tiles.length-1) {
                    pubsub.publish('token/moved', [
                        {x: _x, y: _y}, 
                        {x: tile.x, y:tile.y}, 
                        tiles
                    ]);
                  }
              }
          } )
    })
}


