/**
* The Settings Module reads the settings out of settings.json and provides
* this information to the other modules
*/
const path = require("path");
var fs = require("fs");
var jsonminify = require("jsonminify");


//The app title, visible e.g. in the browser window
exports.title = "June Explorer";

//The url it will be accessed from
exports.address = "explorer.junecoin.org";

// logo
exports.logo = "/images/logo.png";
exports.headerlogo = false;


//The app favicon fully specified url, visible e.g. in the browser window
exports.favicon = "favicon.ico";

//Theme
exports.theme = "Cyborg";

//The Port ep-lite should listen to
exports.port = process.env.PORT || 3001;


//coin symbol, visible e.g. MAX, LTC, HVC
exports.symbol = "JUC";


//coin name, visible e.g. in the browser window
exports.coin = "Junecoin";


//This setting is passed to MongoDB to set up the database
exports.dbsettings = {
  "user": "user",
  "password": "password",
  "address": "dbaddress",
  "database": "junecoin"
};


//This setting is passed to the wallet
exports.wallet = { "host" : "127.0.0.1",
  "port" : 6832,
  "username" : "walletusername",
  "password" : "walletpassword"
};


//Locale file
exports.locale = "locale/en.json",


//Menu items to display
exports.display = {
  "api": true,
  "market": true,
  "twitter": true,
  "facebook": false,
  "googleplus": false,
  "youtube": false,
  "search": true,
  "richlist": true,
  "movement": true,
  "network": true,
  "navbar_dark": false,
  "navbar_light": false
};


//API view
exports.api = {
  "blockindex": 0,
  "blockhash": "627264f4b13ab6fd2faa8a9f6817e2f9dc425cc4b2acdf9ae63973ba5cf185d5",
  "txhash": "455baddf10773d1af10378c44f74ab333c16cbe8fc8d1a7ae71d7f3ccdac0212",
  "address": "RBiXWscC63Jdn1GfDtRj8hgv4Q6Zppvpwb",
};

// markets
exports.markets = {
  "coin": "JUC",
  "exchange": "BTC",
  "enabled": ['bittrex'],
  "default": "bittrex"
};

// richlist/top100 settings
exports.richlist = {
  "distribution": true,
  "received": true,
  "balance": true
};

exports.movement = {
  "min_amount": 100,
  "low_flag": 1000,
  "high_flag": 10000
},

//index
exports.index = {
  "show_hashrate": true,
  "show_market_cap": false,
  "show_market_cap_over_price": false,
  "difficulty": "POW",
  "last_txs": 100,
  "txs_per_page": 10
};

// twitter
exports.twitter = "iquidus";
exports.facebook = "yourfacebookpage";
exports.googleplus = "yourgooglepluspage";
exports.youtube = "youryoutubechannel";

exports.confirmations = 6;

//timeouts
exports.update_timeout = 125;
exports.check_timeout = 250;
exports.block_parallel_tasks = 1;


//genesis
exports.genesis_tx = "65f705d2f385dc85763a317b3ec000063003d6b039546af5d8195a5ec27ae410";
exports.genesis_block = "b2926a56ca64e0cd2430347e383f63ad7092f406088b9b86d6d68c2a34baef51";

exports.use_rpc = true;
exports.heavy = false;
exports.lock_during_index = false;
exports.txcount = 100;
exports.txcount_per_page = 50;
exports.show_sent_received = true;
exports.supply = "COINBASE";
exports.nethash = "getnetworkhashps";
exports.nethash_units = "G";

exports.labels = {};

exports.reloadSettings = function reloadSettings() {
  // Discover where the settings file lives
  var settingsFilename = path.resolve(__dirname, "../settings.json");

  var settingsStr;
  try{
    //read the settings sync
    settingsStr = fs.readFileSync(settingsFilename).toString();
  } catch(e){
    console.warn('No settings file found. Continuing using defaults!');
  }

  // try to parse the settings
  var settings;
  try {
    if(settingsStr) {
      settingsStr = jsonminify(settingsStr).replace(",]","]").replace(",}","}");
      settings = JSON.parse(settingsStr);
    }
  }catch(e){
    console.error('There was an error processing your settings.json file: '+e.message);
    process.exit(1);
  }

  //loop trough the settings
  for(var i in settings)
  {
    //test if the setting start with a low character
    if(i.charAt(0).search("[a-z]") !== 0)
    {
      console.warn("Settings should start with a low character: '" + i + "'");
    }

    //we know this setting, so we overwrite it
    if(exports[i] !== undefined)
    {
      // 1.6.2 -> 1.7.X we switched to a new coin RPC with different auth methods
      // This check uses old .user and .pass config strings if they exist, and .username, .password don't.
      if (i == 'wallet')
      {
        if (!settings.wallet.hasOwnProperty('username') && settings.wallet.hasOwnProperty('user'))
        {
          settings.wallet.username = settings.wallet.user;
        }
        if (!settings.wallet.hasOwnProperty('password') && settings.wallet.hasOwnProperty('pass'))
        {
          settings.wallet.password = settings.wallet.pass;
        }
      }
      exports[i] = settings[i];
    }
    //this setting is unkown, output a warning and throw it away
    else
    {
      console.warn("Unknown Setting: '" + i + "'. This setting doesn't exist or it was removed");
    }
  }

};

// initially load settings
exports.reloadSettings();
