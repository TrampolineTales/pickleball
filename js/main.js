function msToTimeString(ms) {
  var str = (((Math.floor(ms / 1000 / 60 / 60) % 12) == 0) ? '12' : (Math.floor(ms / 1000 / 60 / 60) % 12)) + ':';

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
  var $schedule = $('<table id="pickleball">');
  $schedule.appendTo('body');

  $('#minute').on('input', function() {
    if ($('#minute')[0].value == '0') {
      $('#minute')[0].value = '00';
    }
  });

  $('#generate-button').click(function() {
    if ($('#teams-num')[0].value == '') {
      alert('Please enter a number of teams.');
    } else if ($('#courts-num')[0].value == '') {
      alert('Please enter a number of courts.');
    } /*else if (isNaN($('#start-time')[0].valueAsNumber)) {
      alert('Please enter a start time.');
    } */else {
      $schedule.empty();

      var timeNum = -1;

      var teamsArr = $('#teams').val().split('\n');

      function getTeamName(num) {
        if (num <= teamsArr.length - 1) {
          return teamsArr[num];
        } else {
          return 'Team #' + (num + 1);
        }
      }

      var courts = [];
      var teams = [];
      var matches = [[], [], [], [], [], [], []];
      var offset = -1;

      var startTimeMS = (parseInt($('#hour')[0].value) * 60 + parseInt($('#minute')[0].value)) * 60 * 1000;

      if ($('#ampm')[0].value == 'AM') {
        startTimeMS -= 12 * 60 * 60 * 1000;
      }

      for (var i = 0; i < $('#courts-num')[0].value; i++) {
        courts.push('Court #' + (i + 1));
      }

      for (var i = 0; i < $('#teams-num')[0].value; i++) {
        teams.push(new team('Team #' + (i + 1), i));
      }

      for (var i = 0; i < 7; i++) {
        if (teams.length % 2 == 0) {
          for (var n = 0; n < 4; n++) {
            matches[i].push(new match(((teams.length + offset - 1) % teams.length >= 0) ? (teams.length + offset - 1) : teams.length - Math.abs((teams.length + offset - 2)), ((teams.length + offset - 2) % teams.length >= 0) ? (teams.length + offset - 2) : teams.length - Math.abs((teams.length + offset - 3))));

            for (var a = 0; a < teams.length / 2 - 2; a++) {
              matches[i].push(new match(((teams.length + offset) + a) % (teams.length - 1),((teams.length + offset - 3 - a) % teams.length >= 0) ? ((teams.length + offset - 3 -a) % teams.length) : teams.length - Math.abs((teams.length + offset - 4 - a) % teams.length)));
            }

            matches[i].push(new match((teams.length + offset - teams.length / 2 - 1) >= 0 ? (teams.length + offset - teams.length / 2 - 1) : teams.length - 1 - Math.abs(teams.length+ offset - teams.length / 2 - 1), teams.length - 1));

            offset--;

            if (offset == -teams.length - 1) {
              offset = -1;
            }
          }
        } else {
          var counts = [];
          while (!counts.some(function(el) {
            return el >= 4;
          })) {
            counts = [];
            for (var c = 0; c < teams.length; c++) {
              counts.push(0);
            }

            for (var a = 0; a < Math.floor(teams.length / 2); a++) {
              matches[i].push(new match(((teams.length + offset) + a) % teams.length, ((teams.length + offset - 1 - a) % teams.length >= 0) ? ((teams.length + offset - 1 - a) % teams.length) : teams.length - Math.abs((teams.length + offset - 1 - a) % teams.length)));
            }

            offset--;

            if (offset == -teams.length - 1) {
              offset = -1;
            }

            for (var m = 0; m < matches[i].length; m++) {
              counts[matches[i][m].team1Num]++;
              counts[matches[i][m].team2Num]++;
            }

          }

          var lastNums = [];

          for (var c = 0; c < counts.length; c++) {
            if (counts[c] != 4) {
              lastNums.push(c);
            }
          }

          for (var l = 0; l < lastNums.length / 2; l++) {
            matches[i].push(new match(lastNums[l], lastNums[l + 2]));
          }
        }
      }

      // 2. Assign each match to a night and court

      var courtCounter = courts.length;

      $schedule.append($('<tr>').html('<th>Date</th><th>Time</th><th>Division</th><th>Team 1</th><th>Team 2</th><th>Court</th>'));

      var date = new Date(parseInt($('#year').val()), parseInt($('#month').val()) - 1, parseInt($('#day').val()));

      for (var i = 0; i < 7; i++) {
        for (var a = 0; a < matches[i].length; a++) {
          if (courtCounter == courts.length) {
            timeNum++;
            courtCounter = 0;
          }
          var $tr = $('<tr>');
          $tr.append($('<td>').html(date.toDateString()));
          $tr.append($('<td>').html(msToTimeString(startTimeMS + timeNum * 900000)));
          $tr.append($('<td>'));
          $tr.append($('<td>').html(getTeamName(matches[i][a].team1Num)));
          $tr.append($('<td>').html(getTeamName(matches[i][a].team2Num)));
          $tr.append($('<td>').html(courtCounter + 1));
          $tr.appendTo($schedule);
          courtCounter++
        }
        date = new Date(date.valueOf() + 604800000);
      }
    }

  });
});
