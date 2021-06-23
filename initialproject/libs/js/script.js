

$('#cCodeRun').click(function() {

    $.ajax({
        url: 'libs/php/cCode.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lng: $('#lng').val(),
            lat: $('#lat').val(),
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                
                $('#txtCountry').html(result['data'][0]['countryName']);
                $('#txtCode').html(result['data'][0]['countryCode']);
                $('#txtToponym').html(result['data'][0]['toponymName']);
                

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error");
        }
    }); 

});

