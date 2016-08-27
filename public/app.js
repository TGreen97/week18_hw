// Get Articles as a JSON
$.getJSON('/articles', function(data) {
  for (var i=0; i<data.length; i++) {
    $('#articles').append('<div class="card horizontal"> <div class="card-content"> <p data-id="' + data[i]._id + '">'+ data[i].title + '<br />'+ data[i].link + '<a class="modal-trigger" href="#Modal1"></a> </p> </div> </div>');
  }
});

// On-Click for p-Tags
$(function() {
  $(document).on('click', 'p', function() {
    $('#messages').empty();
    $(this).openModal();

    var thisID = $(this).attr('data-id');

    $.ajax({
      method: 'GET',
      url: '/articles/' + thisID,
    })

      .done(function( data ) {
        console.log(data);
        $('#messages').append('<div id="Modal1" class="modal"> <div class="modal-content"> <h3>' + data.title + '</h3> </div> </div>');

        $('#messages').append('<div id="Modal1" class="modal"> <div class="modal-content"> <input id="titleinput" name="title"> </div> </div>');

        $('#messages').append('<div id="Modal1" class="modal"> <div class="modal-content"> <textarea id="bodyinput" name="body"></textarea> </div> </div>');

        $('#messages').append('<div id="Modal1" class="modal modal-footer"> <a href="#!" class="modal-action modal-close" data-id="' + data._id + '" id="savemessage">Save Message</a> </div>');

        if(data.message) {
          $('#titleinput').val(data.message.title);

          $('#bodyinput').val(data.message.body);
        }
      });
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