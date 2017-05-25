$(document).ready(function() {
  var $tableContainer = $('<div>');
  $tableContainer.appendTo('body');

  $('#generate-button').click(function() {
    $tableContainer.empty();
    var courts = $('#courts-num')[0].value;
    var teams = $('#teams-num')[0].value;
    for (var i = 0; i < courts; i++) {
      
    }
  });
});
