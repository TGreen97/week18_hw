// Get Articles as a JSON
$.getJSON('/articles', function(data) {
  for (var i=0; i<data.length; i++) {
    $('#articles').append('<p data-id="' + data[i]._id + '">'+ data[i].title + '<br />'+ data[i].link + '</p>');
  }
});

// On-Click for p-Tags
$(document).on('click', 'p', function() {
  $('#messages').empty();

  var thisID = $(this).attr('data-id');

  $.ajax({
    method: 'GET',
    url: '/articles/' + thisID,
  })

    .done(function( data ) {
      console.log(data);
      $('#messages').append('<h2>' + data.title + '</h2>');

      $('#messages').append('<input id="titleinput" name="title" >');

      $('#messages').append('<textarea id="bodyinput" name="body"></textarea>');

      $('#messages').append('<button data-id="' + data._id + '" id="savemessage">Save Message</button>');

      if(data.message) {
        $('#titleinput').val(data.message.title);

        $('#bodyinput').val(data.message.body);
      }
    });
});

$(document).on('click', '#savemessage', function(){
  var thisID = $(this).attr('data-id');

  $.ajax({
    method: 'POST',
    url: '/articles/' + thisID,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      console.log(data);
      $('#messages').empty();
    });
// Removes values entered into the input and textarea for Message entry
  $('#titleinput').val("");
  $('#bodyinput').val("");
});