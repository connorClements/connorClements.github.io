$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(100).fadeOut('slow', function() {
            $(this).remove();
        });
    }
});

$('#sunriseRun').click(function() {

    $.ajax({
        url: 'libs/php/sunrise.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lng: $('#lng').val(),
            lat: $('#lat').val(),
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                
                $('#txtSunrise').html(result['data']);
                

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#txtSunrise').html("No sunrise information available");
        }
    }); 

});