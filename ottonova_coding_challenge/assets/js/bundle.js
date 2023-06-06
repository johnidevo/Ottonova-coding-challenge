(function(){
  "use strict";
  console.info('ottonova coding challenge setup');
  var aStart = []; //

  var set_time_headers = function (date) 
  {
    var i;
    var aHeader = [];
    var aHtml = [];
    var aSlots = [];
    const aDate = [date.getFullYear(), date.getMonth(), date.getDate()];

    for (i = -2; i < 4; i++) {
      var m = i * 24 * 60 * 60 *1000;
      var o = new Date(aDate[0], aDate[1], aDate[2]).getTime();
      o = new Date(o + m);
      aHeader.push(o.getDate() +'/'+ (o.getMonth()+1) +'/'+ o.getFullYear()); 
      aSlots.push(o.getTime()); 
    } 

    $.each( aSlots, function( key, iSlots ) {
      var sClass = '';
      const oSlots = new Date(iSlots);
      const sDate = oSlots.toDateString();//+'-'+(oSlots.getMonth()+1)+'-'+oSlots.getDate();

      for (i = 7; i < 20; i++) {
        if (aStart[oSlots.getFullYear()] !== undefined)
        {
          if (aStart[oSlots.getFullYear()][oSlots.getMonth()+1] !== undefined)
          {
            if (aStart[oSlots.getFullYear()][oSlots.getMonth()+1][oSlots.getDate()] !== undefined)
            {
              if (aStart[oSlots.getFullYear()][oSlots.getMonth()+1][oSlots.getDate()][i] !== undefined)
              {
                sClass += '<label >'+ i +':00</label>'+"\n";

                if (aStart[oSlots.getFullYear()][oSlots.getMonth()+1][oSlots.getDate()][i][0] !== undefined)
                {
                  sClass += '<span class="slot slot-top" data-date="'+sDate+'" data-time="'+ i +':00"></span>'+"\n";
                }
                else 
                {
                  sClass += '<span class="time-slot-not-available slot slot-top"></span>'+"\n";
    
                }
                if (aStart[oSlots.getFullYear()][oSlots.getMonth()+1][oSlots.getDate()][i][30] !== undefined)
                {
                  sClass += '<span class="slot slot-bottom" data-date="'+sDate+'" data-time="'+ i +':30"></span>'+"\n";
                }
                else 
                {
                  sClass += '<span class="time-slot-not-available slot slot-bottom"></span>'+"\n";
                }
              }
              else {
                sClass += '<label>'+ i +':00</label>'+"\n";
                sClass += '<span class="time-slot-not-available slot slot-top"></span>'+"\n";
                sClass += '<span class="time-slot-not-available slot slot-bottom"></span>'+"\n";
              }
            }
            else {
              sClass += '<label>'+ i +':00</label>'+"\n";
              sClass += '<span class="time-slot-not-available slot slot-top"></span>'+"\n";
              sClass += '<span class="time-slot-not-available slot slot-bottom"></span>'+"\n";
            }
          }
          else {
            sClass += '<label>'+ i +':00</label>'+"\n";
            sClass += '<span class="time-slot-not-available slot slot-top"></span>'+"\n";
            sClass += '<span class="time-slot-not-available slot slot-bottom"></span>'+"\n";
          }
        }
        else {
          sClass += '<label>'+ i +':00</label>'+"\n";
          sClass += '<span class="time-slot-not-available slot slot-top"></span>'+"\n";
          sClass += '<span class="time-slot-not-available slot slot-bottom"></span>'+"\n";
        } 
      } 
      aHtml[key] = sClass;
    });

    $('.time-picker .col-md-2').each(function( key, val ) {
      $(this).html(aHtml[key]);
    });

    $('.time-picker-header .col-md-2').each(function( key, val ) {
      $(this).html('<h6>'+ aHeader[key] +'</h6>');
    });
  };

  var set_available_slots = function ()
  {
    $('.slot').click(function () {
      if (!$(this).hasClass('time-slot-not-available'))
      {
        $('span').removeClass('time-slot-available');
        $(this).addClass('time-slot-available');
        $('input[name="datetime"]').val($(this).data('date')+' at '+$(this).data('time'));
        console.log($(this).data('time'));
        console.log($(this).data('date'));

      }
    });
  };

  var set_file_slots = function (data)
  {
    if (data.result == undefined) alert('Try again with another file or clear browser stored data.');
    else console.info('Data stored');
    $.each( data.result, function(key, date) {
      const oStart = new Date(Date.parse(date.start));
      const oEnd = new Date(Date.parse(date.end));
      if (aStart[oStart.getFullYear()] == undefined)
      aStart[oStart.getFullYear()] = [];
      if (aStart[oStart.getFullYear()][oStart.getMonth()+1] == undefined)
      aStart[oStart.getFullYear()][oStart.getMonth()+1] = [];
      if (aStart[oStart.getFullYear()][oStart.getMonth()+1][oStart.getDate()] == undefined)
      aStart[oStart.getFullYear()][oStart.getMonth()+1][oStart.getDate()] = [];
      if (aStart[oStart.getFullYear()][oStart.getMonth()+1][oStart.getDate()][oStart.getHours()] == undefined)
      aStart[oStart.getFullYear()][oStart.getMonth()+1][oStart.getDate()][oStart.getHours()] = [];
      if (aStart[oStart.getFullYear()][oStart.getMonth()+1][oStart.getDate()][oStart.getHours()][oStart.getMinutes()] == undefined)
      aStart[oStart.getFullYear()][oStart.getMonth()+1][oStart.getDate()][oStart.getHours()][oStart.getMinutes()] = oStart.getTime();
    });
  };

  if (localStorage.getItem("ottonova_code_chalenge_dates") == null)
  {
    console.info('Fetch json file with slot dates');
    $.getJSON( "./dates.json", function(data) {
      localStorage.setItem("ottonova_code_chalenge_dates", JSON.stringify(data));
      set_file_slots(data);
    }).fail(function() {
      $('.cors').show();
    })
  }
  else
  {
    set_file_slots(JSON.parse(localStorage.getItem("ottonova_code_chalenge_dates")));
  }

  $(document).ready(function () {
    set_time_headers((new Date()));
    set_available_slots();

    console.info('Tooltip in place');
    $('[data-bs-tooltip]').tooltip();

    $('#files').change(function(data) {
      var oReader = new FileReader();
      var oFile = data.target.files[0];
      var oJson;
      if (!oFile) return;
      oReader.onload = function(event) {
        try {
          oJson = JSON.parse(event.target.result);
          localStorage.setItem("ottonova_code_chalenge_dates", JSON.stringify(oJson));
          set_file_slots(oJson);
          $('.cors').hide();
        }
        catch(err) {
          alert('Try again with another file.');
          location.reload(true);
        }
      };
      oReader.readAsText(oFile);
    });
    
    console.info('Datepicker function');
    $('.datepicker').pikaday({
      onSelect: function(date) {
        set_time_headers(date);
        set_available_slots();
      }
    });

    console.info('Form submit event');
    $('form').submit(function(data) {
      data.preventDefault();
      localStorage.setItem("ottonova_code_chalenge_form", JSON.stringify($(this).serializeArray()));
      window.location.href = "./result.html";
    });

    if ($(".result-page .card-body")[0] !== undefined)
    {
      console.info('Get results');
      $('.result-page .card-body').ready(function() {
        var aCustomer = JSON.parse(localStorage.getItem("ottonova_code_chalenge_form"));

        if (aCustomer == null) window.location.href = "./index.html";;
        $.each( aCustomer, function(key, input) {
          $('.result-page .card-body .customer-'+ input.name).text(input.value);
          if (input.name == 'email') $('.card-body .customer-email').attr('href', 'mailto:'+ input.value);
        });
      });
    }

    $('.result-page .back-to-index').click(function(data) {
      window.location.href = "./index.html";
    });

  });
})(jQuery);

