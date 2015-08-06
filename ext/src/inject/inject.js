var me = "Arch";
var host = "Arch";
var open = false;
var c1 = "";
var c2 = "";
var b1 = 0;
var b2 = 0;
var o1 = 50;
var o2 = 50;

var getOdds = function() {
  if (b1 == b2) {
    o1 = o2 = 50;
  } else if (b1 == 0) {
    o1 = 0;
    o2 = 100;
  } else if (b2 == 0) {
    o1 = 100;
    o2 = 0;
  } else {
    o1 = b1 / (b1 + b2) * 100;
    o2 = 100 - o1;
  }
}

var runD3 = function() {
  var lastId = -1;
  setInterval(function() {
    var lines = d3.selectAll("li.chat-line");
    lines.each(function(line) {
      var from = d3.select(this).selectAll(".from").node().innerHTML;
      var mess = d3.select(this).selectAll(".message").node().innerHTML;
      
      if (from.endsWith(me)) {
        console.log("It's me!")
      }
      if (from.endsWith(host)) {
        if (mess.startsWith("!gamble open ")) {
          var c = mess.split(" ");
          if (c.length == 7 && !isNaN(parseInt(c[2])) && !isNaN(parseInt(c[3])) && !isNaN(parseInt(c[4]))) {
            c1 = c[5];
            c2 = c[6];
            b1 = b2 = 0;
            open = true;
            getOdds();
            console.log("Characters are " + c1 + " " + c2);
          }
        } else if (mess == "!gamble close") {
          open = false;
        }
      }      
      if (mess.startsWith("!bet ") && open) {
        var c = mess.split(" ");
        if (c.length == 3 && !isNaN(parseInt(c[1])) && (c[2] == "#1" || c[2] == "#2")) {
          var a = parseInt(c[1]);
          if (c[2] == "#1") {
            b1 += a;
          } else {
            b2 += a;
          }
        }
        getOdds();
        
        console.log("Current totals are " + b1 + " for " + c1 + " and " + b2 + " for " + c2);
      }
    });
    lines.remove();
  }, 1000);
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      runD3();
    }
	}, 10);
});