$('#oceanRun').click(function() {

    $.ajax({
        url: 'libs/php/ocean.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lng: $('#lng').val(),
            lat: $('#lat').val(),
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                
                $('#txtOcean').html(result['data']['name']);
                

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#txtOcean').html("No ocean information available");
        }
    }); 

});