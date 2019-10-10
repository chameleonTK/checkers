function Player(pid, name, color, options) {
    var vm = this;
    vm.pid = pid;
    vm.name = name;
    vm.color = color;
    vm.tokens = []
    vm.stat = options["stat-container"];
    vm.active = false;
    this.deactivate();
}

Player.prototype.setTokens = function(tokens) {
    this.tokens = tokens;
}

Player.prototype.updateStat = function() {
    var nKing = 0;
    for (const token in this.tokens) {
        if (token.isKing) {
            nKing++;
        }
    }
    this.stat.find(".knight").html(this.tokens.length-nKing);
    this.stat.find(".king").html(nKing);
}

Player.prototype.activate = function() {
    this.active = true;
    this.stat.css("background-color", this.color);
    this.stat.css("color", "#fff");
}

Player.prototype.deactivate = function() {
    this.active = false;
    this.stat.css("background-color", "");
    this.stat.css("border-color", this.color);
    this.stat.css("color", this.color);
}

Player.prototype.move = function() {
    alert("501: Not implemented")
}

Player.prototype.moving = function(token, tile) {
    pubsub.publish('token/moving', []);
    token.moveTo([tile]);
}

Player.prototype.moved = function() {
    
}

function ComPlayer(pid, name, color, options) {
    Player.call(this, pid, name, color, options);
}
ComPlayer.prototype = Object.create(Player.prototype);

ComPlayer.prototype.move = function() {}

function ManPlayer(pid, name, color, options) {
    var vm = this;
    Player.call(this, pid, name, color, options);

    vm.notifier = options.notifier;
    vm.notifier.subscribe('token/click', function(token) {
        if(token.selected) {
            token.deselect();
            pubsub.publish('token/selected', [undefined]);
            return true;
        }

        vm.tokens.forEach((t) => {
            t.deselect();
        })

        token.select();
        pubsub.publish('token/selected', [token]);
    });

    pubsub.subscribe("tile/click", function(tile) {
        if (!vm.active) {
            return false;
        }

        var token = vm.tokens.find(tile => tile.selected);
        if (!token) {
            alert("500: Something went wrong")
            return false;
        }

        //TODO: it is possible that token moves many steps until it reached the goal.
        vm.moving(token, tile);
    })

}
ManPlayer.prototype = Object.create(Player.prototype);
ManPlayer.prototype.move = function() {
    this.tokens.forEach(function(token){
        token.enable();
    })
}


