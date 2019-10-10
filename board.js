function Board(container, options) {
    var vm = this;
    vm.container = container;
    vm.tokens = [];
    vm.colors = options.colors;
    vm.notifiers = options.notifiers;

    vm.tiles = [];
}

Board.prototype.render = function() {
    this.renderBoard();
    this.initTokens();
    this.disableClick();
}

Board.prototype.getTokens = function() {
    return this.tokens;
}

Board.prototype.initTokens = function() {
    var p1 = [
        [0, 1], [0, 3], [0, 5], [0, 7],
        [1, 0], [1, 2], [1, 4], [1, 6],
    ]

    var p2 = [
        [6, 1], [6, 3], [6, 5], [6, 7],
        [7, 0], [7, 2], [7, 4], [7, 6],
    ]

    this.tokens = []
    tokens = [];
    for (let i = 0; i < 8; i++) {
        var token = new Token(p1[i][0], p1[i][1], this.container, this.colors[0], this.notifiers[0]);
        tokens.push(token)
    }
    this.tokens.push(tokens);

    tokens = [];
    for (let i = 0; i < 8; i++) {
        var token = new Token(p2[i][0], p2[i][1], this.container, this.colors[1], this.notifiers[1]);
        tokens.push(token)
    }
    this.tokens.push(tokens);
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
    var vm = this;
    vm.container.empty();
    vm.tiles = [];
    for (let i = 1; i <= 8; i++) {

        var tilesInARow = []
        var DOMs = $("<div>")
                    .addClass("tiles")
                    .addClass("tile-row-"+i)

        for (let j = 1; j <= 8; j++) {
            var tile = $("<div>")
                        .addClass("tile")
                        .addClass("tile-col-"+j)
            
            var tileInACol = new Tile(i-1, j-1, tile, pubsub);

            if ((i+j)%2==0) {
                tileInACol.playable = false;
                tile.addClass("tile-white")
            } else {
                tile.addClass("tile-black")
            }

            tile.css("left", ((j-1)*10)+"vmin")
            tile.css("top", ((i-1)*10)+"vmin")

            tilesInARow.push(tileInACol);
            tile.appendTo(DOMs)
        }

        vm.tiles.push(tilesInARow);
        DOMs.appendTo(vm.container);    
    }

    
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

Tile.prototype.highlight = function(flag) {
    if (flag) {
        this.DOM.css("background-color", "#efe0ae")
    } else {
        this.DOM.css("background-color", "")
    }
}

Tile.prototype.enable = function() {
    this.clickable = true;
    this.DOM.css("cursor", "pointer")
}

Tile.prototype.disable = function() {
    this.clickable = false;
    this.DOM.css("cursor", "")
}


function Token(x, y, container, color, notifier) {
    var vm = this;
    vm.x = x;
    vm.y = y;
    
    vm.notifier = notifier;
    vm.isKing = false;
    vm.selected = false;

    vm.color = color;
    vm.DOM = $("<div>").addClass("token")
    var innerDOM = $("<div>").addClass("token-inner")
    innerDOM.appendTo(vm.DOM)
    innerDOM.css("background-color", color);
    innerDOM.css("border-color", color);

    vm.DOM.css("top", vm.x*10+"vmin");
    vm.DOM.css("left", vm.y*10+"vmin");

    vm.DOM.on("click", (e) => {
        if (!vm.clickable) {
            e.preventDefault();
            return false;
        }
    
        vm.notifier.publish('token/click', [vm]);
        e.preventDefault();
    });
    
    vm.container = container;
    vm.DOM.appendTo(container);

    Tile.call(this, x, y, vm.DOM, undefined);
}

Token.prototype = Object.create(Tile.prototype);

Token.prototype.select = function() {
    this.selected = true;
    this.DOM.find(".token-inner").css("box-shadow", "0px 0px 20px 0px "+this.color);
}

Token.prototype.deselect = function() {
    this.selected = false;
    this.DOM.find(".token-inner").css("box-shadow", "");
}

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
                  if (i >= tiles.length-1) {
                    pubsub.publish('token/moved', []);
                  }

                  vm.x = tile.x;
                  vm.y = tile.y;
              }
          } )
    })
}


