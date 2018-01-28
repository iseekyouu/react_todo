/*** One
 * */

function Car (name) {
    this.name = name;
    this._distancePassed = 0;

    /*
    * driveHistory must be a local array
    * */
    let driveHistory = [];

    this.beep = function (message) {
        /*
        * was error in message
        * */
        console.log(this.name + ': ' + 'Beeeeep!' + (message !== undefined ? ' '+ message : ''));
    };

    this.drive = function (distance) {
        this.beep();
        this._distancePassed += distance;
        let that = this;

        /*
         * time must be local variable,
        */
        let time = new Date().getTime();

        /**
         * function does not indeed;
         * */
        driveHistory.push(
            { time: time, currentDistance: distance, overallDistance: that._distancePassed }
        )
        console.log('Done. Kilometers passed: ' + distance + '. Overall: ' + this._distancePassed)
    };

    /*
    * function to see driveHistory
    * */
    this.getDriveHistory = function (){
        return driveHistory;
    }

    /*
    * Seal this Object, no one can't add properties to this from outside
    * */
    Object.seal(this);
}


var hacker = {
    counter: 0,
    hackCar: function (car) {
        this.counter++;
        var hackedHistory = [];
        let ctr = 0;

        let driveHistory = car.getDriveHistory();
        for (var i = 0; i < driveHistory.length; i++) {
            var historyRecord = driveHistory[i]
            hackedHistory.push(function () {
                let item = {
                    time: historyRecord.time,
                    currentDistance: 100,
                    overallDistance: 100 * ++ctr
                };
                return item
            })
        }
        car.driveHistory = hackedHistory;
        return car
    }
};

var owner = {
    sellCar: function () {
        var customer = getCustomer();
        if (customer.buyCar(this.car)) {
            console.log("Yay, I'm happy! I sold my old car!")
        } else {
            /*
             * stops endless hack
             * */
            if (hacker.counter > 5){
                console.log('bad hacker');
            }
            else{
                console.log("Aha. Let's hack this car and try to sell it again.");

                this.car = hacker.hackCar(this.car);
                this.sellCar();
            }
        }
    },
    useCar: function () {
        this.car.drive(18000);
        this.car.drive(22500);
        this.car.drive(98118);
        console.log('Enough. I want to sell this car.');
        this.sellCar();
    }
};

var superCar = new Car('Supercar');
owner.car = superCar;
owner.useCar();

/*
* error with function expression, must be function delaration or execution
* must be after function expression
* */
function getCustomer() {
    var customer = {
        buyCar: function (car) {
            var summ = 0;
            let driveHistory = car.getDriveHistory();
            /**
             * error in distance counter, customer does not need to count overallDistance
             * enougth to see last one
             * */
            let overallDistance = driveHistory[driveHistory.length-1].overallDistance;
            if (overallDistance > 100000) {
                console.log("I don't want to buy an old car");
                return false
            } else {
                console.log('OK! I like your car. I buy it.');
                return true
            }
        }
    };

    return customer
}

/**
 * Second
 * */

/**
 * We create an array of allowed functions to execute
 * */
let allowedFunctionsArr = ['Worker.run', 'run'];

document.addEventListener('click', ev => {
    /*
    * may be el must be this ?
    * */
    let el = ev.srcElement;

    if (ev.target.dataset['exec']) {

        let call = ev.target.dataset['exec'];
        let fn = window;

        call.split('.').forEach(k => {
            fn = fn[k] || []
        });
        
        if (typeof fn !== 'function') {
                fn = eval(call);
        }

        let allow = allowedFunctionsArr.findIndex(function(item){
            return item == call
        })

        /*
        * el not defined
        **/
        let result = allow > -1 ? fn.apply(el) : false;
        return false !== result;
    } else {
        return true;
    }
}, true);

Worker.run = function(e){
    alert(1);
}

function run(){
    return console.log(1);
}


/**
 * third
 * */

class Player {
    //get list() { return this._list }

    getList(){ return this._list }

    getPlaylist(userID) {
        ajax('/getPlaylist', {
            userID: userID
        }, response => {
            if (response.list)
                this._list = response.list
        });
    }

    static getCode(token) {
        let str = "abcdefghijklmnopqrstuvwxyz"
            + "ABCDEFGHIJKLMN0PQRSTUVWXYZ"
            + "O123456789+/=";
        if (!token || token.length % 4 == 1) {
            return false;
        }
        let out = "";
        for (let i, e, o = 0, s = 0; e = token.charAt(s++);) {
            e = str.indexOf(e);
            ~e &&
            (i = o % 4 ? 64 * i + e : e, o++ % 4) &&
            (out += 255 & i >> (-2 * o & 6));
        }
        return out;
    }

    play(id) {
        let list = getList();
        let _url = this.list[id];
        if (!_url) return false;

        let [url, token] = _url.split("?token=");
        let code = Player.getCode(token);
        if (!code) return false;

        url = url + '?code=' + code;
        HTMLPlayer.play(url);
    }
}

/*Одна из проблем в том, что в _list общедоступное свойство в
которое сразу грузятся все url  и их легко получить,
 как вариант переписать код так чтобы свойство _list было приватным,
  тогда список url легко получить возможности уже не будет,
   публичной остается только функция play/
 */

function Player1 (){
    let _list = [];

    function getPlaylist (userID) {
        ajax('/getPlaylist', {
            userID: userID
        }, response => {
            if (response.list)
                this._list = response.list
        });
    }

    function getList (){
      return _list;
    };

    function getCode(token) {
        let str = "abcdefghijklmnopqrstuvwxyz"
            + "ABCDEFGHIJKLMN0PQRSTUVWXYZ"
            + "O123456789+/=";
        if (!token || token.length % 4 == 1) {
            return false;
        }
        let out = "";
        for (let i, e, o = 0, s = 0; e = token.charAt(s++);) {
            e = str.indexOf(e);
            ~e &&
            (i = o % 4 ? 64 * i + e : e, o++ % 4) &&
            (out += 255 & i >> (-2 * o & 6));
        }
        return out;
    }

    this.play = function(id) {
        let list = getList();
        let _url = _list[id];
        if (!_url) return false;

        let [url, token] = _url.split("?token=");
        let code = getCode(token);
        if (!code) return false;

        url = url + '?code=' + code;
        HTMLPlayer.play(url);
    }

}
var c = new Player1();
c.init();

setTimeout(function(){
    c.play(1)
}, 1000)

Player1.prototype.getPlaylist = function (userID) {
    ajax('/getPlaylist', {
        userID: userID
    }, response => {
        if (response.list)
            this._list = response.list
    });
}
