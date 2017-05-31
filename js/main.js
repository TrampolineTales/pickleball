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

function match(team1Num, team2Num) {
  return {
    team1Num: team1Num,
    team2Num: team2Num,
    court: null,
    time: null
  }
}

function team(name, num) {
  return {
    name: name,
    num: num,
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
    var matches = [[], [], [], [], [], [], []];
    var offset = -1;

    var startTimeMS = $('#start-time').valueAsNumber;

    for (var i = 0; i < $('#courts-num')[0].value; i++) {
      courts.push('Court #' + (i + 1));
    }

    for (var i = 0; i < $('#teams-num')[0].value; i++) {
      teams.push(new team('Team #' + (i + 1), i));
    }

    for (var i = 0; i < 7; i++) {
      for (var n = 0; n < 4; n++) {
        if (teams.length % 2 == 0) {
          matches[i].push(new match(teams.length + offset - 1, teams.length + offset - 2));

          for (var a = 0; a < teams.length / 2 - 2; a++) {
            matches[i].push(new match(((teams.length + offset) + a) % (teams.length - 1), (teams.length + offset - 3 - a) % teams.length));
          }

          matches[i].push(new match((teams.length + offset - teams.length / 2 - 1) >= 0 ? (teams.length + offset - teams.length / 2 - 1) : teams.length - 1 - Math.abs(teams.length + offset - teams.length / 2 - 1), teams.length - 1));

          offset--;

          if (offset == -teams.length - 1) {
            offset = -1;
          }
        }
      }
    }

    for (var i = 0; i < matches[0].length; i++) {
      console.log(matches[0][i].team1Num, matches[0][i].team2Num);
    }

    ////Testing////
    // for (var i = 0; i < teams.length; i++) {
    //   console.log(teams[i].matchesToPlay.map(function(el) {
    //     return el.opponentNum;
    //   }));
    // }
    ///////////////

    // 2. Assign each match to a night and court

    // startTimeMS + timeNum * 900000
    // if (courtNum <= teams.length / 2) {
    //   courtNum = 0;
    //   timeNum++;
    // }

  });
});
