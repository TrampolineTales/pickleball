function msToTimeString(ms) {
  var str = (Math.floor(ms / 1000 / 60 / 60) % 12) + ':';

  if ((ms / 1000 / 60 % 60) < 10) {
    str += '0';
  }

  str += ms / 1000 / 60 % 60;

  if (Math.floor(ms / 1000 / 60 / 60) < 12) {
    return str + ' AM';
  } else {
    return str + ' PM';
  }
}

function match(opponentNum) {
  return {
    opponentNum: opponentNum,
    court: null,
    time: null
  }
}

function team(name, num) {
  return {
    name: name,
    num: num,
    matchesToPlay: [],
    counter: num
  }
}

$(document).ready(function() {
  var $tableContainer = $('<div>');
  $tableContainer.appendTo('body');

  $('#generate-button').click(function() {
    $tableContainer.empty();

    var courtNum = 0;
    var timeNum = 0;

    var courts = [];
    var teams = [];
    var matches = [];

    var startTimeMS = $('#start-time').valueAsNumber;

    for (var i = 0; i < $('#courts-num')[0].value; i++) {
      courts.push('Court #' + (i + 1));
    }

    for (var i = 0; i < $('#teams-num')[0].value; i++) {
      teams.push(new team('Team #' + (i + 1), i));
    }

    function getAvailableOpponentNum(team1Num) {
      var num = -1;
      for (var i = 0; i < teams.length; i++) {
        num = teams[team1Num].counter % teams.length;

        ////CHECKS IF BEING MATCHED AGAINST SELF OR TEAM WITH MORE MATCHES////
        if ((num == team1Num) || (teams[num].matchesToPlay.length == 28)) {
          num = -1;
          continue;
        }
        //////////////////////////////////////////////////////////////////////

        if (num != -1) {
          break;
        }
      }

      if (num == -1) {
        teams[team1Num].counter++;
        return getAvailableOpponentNum(team1Num);
      } else {
        return num;
      }
    }

    // 1. Generate games for each team, making sure the amount of playing is equal

    while (teams.map(function(el) {
      return el.matchesToPlay.length;
    }).some(function(el) {
      return el < 28;
    })) {
      for (var i = 0; i < teams.length; i++) {
        if (teams[i].matchesToPlay.length < 28) {
          do {
            var opponentNum = getAvailableOpponentNum(i);

            teams[i].matchesToPlay.push(new match(opponentNum));
            teams[i].counter++;

            teams[opponentNum].matchesToPlay.push(new match(i));
            teams[opponentNum].counter += 2;
          } while (teams[i].matchesToPlay.length % teams.length != 0);
        }
      }
    }

    for (var i = 0; i < teams.length; i++) {
      console.log(teams[i].matchesToPlay.map(function(el) {
        return el.opponentNum;
      }));
    }

    // 2. Assign each match to a night and court

    // startTimeMS + timeNum * 900000
    // if (courtNum <= teams.length / 2) {
    //   courtNum = 0;
    //   timeNum++;
    // }

  });
});
