App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },
  
  initWeb3: function() {
    // metamask and mist inject their own web3 instances, so just 
    // set the provider if it exists
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);

    } else {
      // set the provider you want from Web3.providers
      web3 = new Web3(App.web3Provider);
      App.web3Provider = new web3.providers.HttpProvider("http://localhost:8545");
      $('#noMetaMaskModal').modal();
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('RockPaperEth.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var RockPaperEthArtifact = data;
      App.contracts.RockPaperEth = TruffleContract(RockPaperEthArtifact);

      // Set the provider for our contract.
      App.contracts.RockPaperEth.setProvider(App.web3Provider);

      // Get a list of stuff from the contract
      App.whoIsthePlayer1();
      App.whoIsthePlayer2();
      App.whatIsGamePhase();
      App.whatIsGamePhaseGlobal();
      App.whatArePlayerPhases();
      App.solidityEventListener();

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        if(accounts[0] != 0x0){
          document.getElementById("currentaddress").innerHTML = accounts[0];
          }
        });


             
      });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-wincheck', App.runAWinnerCheck);
    $(document).on('click', '.btn-register', App.handleRegister);
    $(document).on('click', '.rock', App.pickRock);
    $(document).on('click', '.paper', App.pickPaper);
    $(document).on('click', '.scissors', App.pickScissors);
    $(document).on('click', '.rrock', App.revealRock);
    $(document).on('click', '.rpaper', App.revealPaper);
    $(document).on('click', '.rscissors', App.revealScissors);

  },
  pickRock: function() {
    var secret = document.getElementById("secret-phrase-input").value;
    var rpsethInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.RockPaperEth.deployed().then(function(instance) {
        rpsethInstance = instance;
        return rpsethInstance.encrypt("rock",secret,{from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
 pickPaper: function() {
    var secret = document.getElementById("secret-phrase-input").value;
    var rpsethInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.RockPaperEth.deployed().then(function(instance) {
        rpsethInstance = instance;
        return rpsethInstance.encrypt("paper",secret,{from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  pickScissors: function() {
    var secret = document.getElementById("secret-phrase-input").value;
    var rpsethInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.RockPaperEth.deployed().then(function(instance) {
        rpsethInstance = instance;
        return rpsethInstance.encrypt("scissors",secret,{from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  revealRock: function() {
    var secret = document.getElementById("secret-phrase-input2").value;
    var rpsethInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.RockPaperEth.deployed().then(function(instance) {
        rpsethInstance = instance;
        return rpsethInstance.decrypt("rock",secret,{from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
 revealPaper: function() {
    var secret = document.getElementById("secret-phrase-input2").value;
    var rpsethInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.RockPaperEth.deployed().then(function(instance) {
        rpsethInstance = instance;
        return rpsethInstance.decrypt("paper",secret,{from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  revealScissors: function() {
    var secret = document.getElementById("secret-phrase-input2").value;
    var rpsethInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.RockPaperEth.deployed().then(function(instance) {
        rpsethInstance = instance;
        return rpsethInstance.decrypt("scissors",secret,{from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleRegister: function() {
    var rpsethInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.RockPaperEth.deployed().then(function(instance) {
        rpsethInstance = instance;
        return rpsethInstance.register({from: account,value:web3.toWei(0.1,'ether')});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  whoIsthePlayer1: function() {
    var rpsethInstance;

    App.contracts.RockPaperEth.deployed().then(function(instance) {
      rpsethInstance = instance;
      return rpsethInstance.whoIsPlayer1();
    }).then(function(result) {
      if(result != 0x0){
      document.getElementById("whoIsthePlayer1").innerHTML = JSON.stringify(result);
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  whoIsthePlayer2: function() {
    var rpsethInstance;

    App.contracts.RockPaperEth.deployed().then(function(instance) {
      rpsethInstance = instance;
      return rpsethInstance.whoIsPlayer2();
    }).then(function(result) {
      if(result != 0x0){
      document.getElementById("whoIsthePlayer2").innerHTML = JSON.stringify(result);
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  runAWinnerCheck: function() {
    var rpsethInstance;

    App.contracts.RockPaperEth.deployed().then(function(instance) {
      rpsethInstance = instance;
      return rpsethInstance.finish();
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  whatIsGamePhaseGlobal: function() {
    var rpsethInstance;
    App.contracts.RockPaperEth.deployed().then(function(instance) {
      rpsethInstance = instance;
      return rpsethInstance.whatPhaseIsIt();
    }).then(function(result) {
      if(result == 0) {
        document.getElementById("statusGlobal").innerHTML = "Waiting on players";
        document.getElementById("gamePhaseGlobal").innerHTML = "We are waiting for players!";
      }
      else if(result == 1) {
        document.getElementById("statusGlobal").innerHTML = "Waiting on player hands";
        document.getElementById("gamePhaseGlobal").innerHTML = "Waiting on player hands";
      }
      else if(result == 2) {
        document.getElementById("statusGlobal").innerHTML = "Waiting on player reveals";
        document.getElementById("gamePhaseGlobal").innerHTML = "Waiting on player reveals";
      }
      else if(result == 3) {
        document.getElementById("statusGlobal").innerHTML = "Waiting on game finalisation";
        document.getElementById("gamePhaseGlobal").innerHTML = "Waiting on game finalisation";
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  whatIsGamePhase: function() {
    var rpsethInstance;
    App.contracts.RockPaperEth.deployed().then(function(instance) {
      rpsethInstance = instance;
      return rpsethInstance.whatPhaseAmI();
    }).then(function(result) {
      if(result == 1) {
        document.getElementById("playButton").style.display = "";
        document.getElementById("registerButton").style.display = "none";
        $('#playModal').modal();
      }
      else if(result == 2) {
        document.getElementById("revealButton").style.display = "";
        document.getElementById("registerButton").style.display = "none";
        $('#revealModal').modal();
      }
      else if(result == 3) {
        document.getElementById("finalButton").style.display = "";
        document.getElementById("registerButton").style.display = "none";
        $('#finalModal').modal();
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  whatArePlayerPhases: function() {
    var rpsethInstance;
    App.contracts.RockPaperEth.deployed().then(function(instance) {
      rpsethInstance = instance;
      return rpsethInstance.whatPhaseAreThePlayers();
    }).then(function(result) {
      if(result[0] == 0) {
        document.getElementById("player1status").innerHTML = "No player yet!";
       }
      else if(result[0]  == 1) {
        document.getElementById("player1status").innerHTML = "Waiting on player hand";
       }
      else if(result[0]  == 2) {
          document.getElementById("player1status").innerHTML = "Waiting on player reveal";
       }
      else if(result[0]  == 3) {
        document.getElementById("player1status").innerHTML = "Waiting on player finalisation";
      }
      if(result[1]  == 0) {
        document.getElementById("player2status").innerHTML = "No player yet!";
      }
      else if(result[1] == 1) {
        document.getElementById("player2status").innerHTML = "Waiting on player hand";
      }
      else if(result[1] == 2) {
        document.getElementById("player2status").innerHTML = "Waiting on player reveal";
      }
      else if(result[1] == 3) {
        document.getElementById("player2status").innerHTML = "Waiting on player finalisation";
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  solidityEventListener: function() {
    var rpsethInstance;
    App.contracts.RockPaperEth.deployed().then(function(instance) {
      rpsethInstance = instance.PlayerPhase();
      rpsethInstance.watch(function(err, result) {
        if (err) {
         console.log(err);
         return;
        }
        console.log(result);
      });
    }).catch(function(err) {
      console.log(err.message);
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
