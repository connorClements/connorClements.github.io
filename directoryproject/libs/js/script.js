var jobTitle = [];

var deleteDepartmentName;

var selectedId;

// window pre-loader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(250).fadeOut('slow', function() {
            $(this).remove();
        });
    }
}); 

// refresh button
$('.refreshBtn').on('click', function() {
    document.location.reload(true);
    $('#employees').empty();
});

$(document).ready(function() {

    $.ajax({
        url: "libs/php/getAll.php",
        type: "GET",
        dataType: "json",

        success: function(result) {

            if (result.status.name == "ok") {
                
                for (i=0; i < result['data'].length; i++) {

                    $('#employees').append('<tr><td id="' + i + '-employeeName">' + result['data'][i]['firstName'] + ' ' + result['data'][i]['lastName'] + '</td><td id="' + i + '-employeeEmail">' +  result['data'][i]['email'] + '</td><td id="' + i + '-employeeJobTitle">' + result['data'][i]['jobTitle'] +  '</td><td id="' + i + '-employeeDepartment">' + result['data'][i]['department'] + '</td><td id="' + i + '-employeeLocation">' + result['data'][i]['location'] + '</td><td><button type="button" class="btn btn-primary" id="' + i + '-employee" data-toggle="modal" onclick=populateEmployee(' + i + ') data-target="#viewEmployee"><i class="fas fa-info"></i></button></td><td style="display: none;" id="' + i + '-id">' +  result['data'][i]['id'] + '</td></tr>');
                    
                    //console.log(result['data'][i]['id']);
                    if (result['data'][i]['jobTitle'] == '') {
                        $('#' + i + '-employeeJobTitle').html('None');
                    };
                    
                    
                };
                
                
            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
});


function populateEmployee(employeeNum) {
    numToString = employeeNum.toString();
    selectedId = $('#' + numToString + '-id').html();
    $('#viewEmployeeName').html($('#' + numToString + '-employeeName').html());
    $('#viewEmployeeEmail').html($('#' + numToString + '-employeeEmail').html());
    $('#viewEmployeeJobTitle').html($('#' + numToString + '-employeeJobTitle').html());
    $('#viewEmployeeDepartment').html($('#' + numToString + '-employeeDepartment').html());
    $('#viewEmployeeLocation').html($('#' + numToString + '-employeeLocation').html());

    $('#deleteName').html($('#' + numToString + '-employeeName').html());
};

function populateEditEmployee() {

};

$('#editEmployeeButton').on('click', function() {

    console.log(selectedId);

    $.ajax({
        url: "libs/php/getPersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
            id: selectedId
        },

        success: function(result) {

            if (result.status.name == "ok") {

                console.log(result['data']);

                for (i = 0; i < result['data']['department'].length; i++) {
                    $('#editDepartment').append($('<option>', {
                        value: result['data']['department'][i]['id'],
                        text: `${result['data']['department'][i]['name']}`
                    }));
                };

                console.log(result['data']);

                document.getElementById("editFirstName").defaultValue = result['data']['personnel'][0]['firstName'];
                document.getElementById("editLastName").defaultValue = result['data']['personnel'][0]['lastName'];
                document.getElementById("editEmail").defaultValue = result['data']['personnel'][0]['email'];
                document.getElementById("editJobTitle").defaultValue = result['data']['personnel'][0]['jobTitle'];
                document.getElementById("editDepartment").value = result['data']['personnel'][0]['departmentID'];

            };

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
});

$('#editEmployeeForm').submit(function() {

    $.ajax({
        url: "libs/php/editEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            id: selectedId,
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById("editLastName").value,
            jobTitle: document.getElementById("editJobTitle").value,
            email: document.getElementById("editEmail").value,
            departmentID: document.getElementById("editDepartment").value
        },

        success: function(result) {

            if (result.status.name == "ok") {

                location.reload(true);

            };

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
});


$('#searchBar').keyup(function() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchBar");
    filter = input.value.toUpperCase();
    table = document.getElementById("employees");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        }
    }
});

function getDepartments() {

    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",

        success: function(result) {

            if (result.status.name == "ok") {

                //console.log(result['data']);

                for (i=0; i < result['data'].length; i++) {
                    $('#employeeDepartment').append($('<option>', {
                        value: result['data'][i]['id'],
                        text: `${result['data'][i]['name']}`
                    }));
                }; 

            };

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
};

getDepartments();

function getLocations() {

    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        dataType: "json",

        success: function(result) {

            if (result.status.name == "ok") {

                //console.log(result['data']);

                for (i=0; i < result['data'].length; i++) {
                    $('#newDepartmentLocation').append($('<option>', {
                        value: result['data'][i]['id'],
                        text: `${result['data'][i]['name']}`
                    }));
                }; 

            };

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
};

getLocations();

function deleteDepartmentSelect() {

    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",

        success: function(result) {

            if (result.status.name == "ok") {

                for (i=0; i < result['data'].length; i++) {
                    $('#deleteDepartmentSelect').append($('<option>', {
                        value: result['data'][i]['id'],
                        text: `${result['data'][i]['name']}`
                    }));
                }; 

            };

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
};

deleteDepartmentSelect();

function deleteLocationSelect() {

    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        dataType: "json",

        success: function(result) {

            if (result.status.name == "ok") {

                for (i=0; i < result['data'].length; i++) {
                    $('#deleteLocationSelect').append($('<option>', {
                        value: result['data'][i]['id'],
                        text: `${result['data'][i]['name']}`
                    }));
                }; 

            };

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
};

deleteLocationSelect();

$('#newEmployeeForm').submit(function() { 

    $.ajax({
        url: "libs/php/newEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            firstName: document.getElementById('employeeFirstName').value,
            lastName: document.getElementById('employeeLastName').value,
            jobTitle: document.getElementById('employeeJobTitle').value,
            email: document.getElementById('employeeEmail').value,
            departmentID: document.getElementById('employeeDepartment').value
        },

        success: function(result) {

            if (result.status.name == "ok") {

                console.log(result);

                

                location.reload(true);

            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
});

    

$('#newDepartmentForm').submit(function() {

    $.ajax({
        url: "libs/php/newDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: document.getElementById('newDepartmentName').value,
            locationID: document.getElementById('newDepartmentLocation').value
        },

        success: function(result) {

            if (result.status.name == "ok") {

                console.log(result);
                
                location.reload(true);
            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
});

$('#newLocationForm').submit(function() {

    $.ajax({
        url: "libs/php/newLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            name: document.getElementById('newLocationName').value,
        },

        success: function(result) {

            if (result.status.name == "ok") {

                console.log(result);
                
                location.reload(true);
            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
});

$('#confirmDeleteDepartment').on('click', function() {

    if (document.getElementById('deleteDepartmentSelect').value == "") {
        $('#selectDepartmentConfirm').modal('show');
    } else {
        $.ajax({
            url: "libs/php/departmentHasEmployees.php",
            type: "POST",
            dataType: "json",
            data: {
                departmentID: document.getElementById('deleteDepartmentSelect').value,
            },
    
            success: function(result) {
    
                if (result.status.name == "ok") {
    
                    //console.log(result['data'].length);
    
                    if (result['data'].length == 0) {
                        $('#deleteDepartmentConfirm').modal('show');
                    } else {
                        $('#cannotDeleteDepartment').modal('show');
                    }
                    
                }
    
            },
    
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log(jqXHR);
            }
        })
    }

});

$('#deleteDepartmentButton').on('click', function() {

    $.ajax({
        url: "libs/php/deleteDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
            departmentID: document.getElementById('deleteDepartmentSelect').value,
        },

        success: function(result) {

            if (result.status.name == "ok") {

                console.log('department deleted');

                location.reload(true);
                
            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
});

$('#confirmDeleteLocation').on('click', function() {

    if (document.getElementById('deleteLocationSelect').value == "") {
        $('#selectLocationConfirm').modal('show');

    } else {

        $.ajax({
            url: "libs/php/locationHasDepartments.php",
            type: "POST",
            dataType: "json",
            data: {
                locationID: document.getElementById('deleteLocationSelect').value,
            },
    
            success: function(result) {
    
                if (result.status.name == "ok") {
    
                    console.log(result['data'].length);
    
                    if (result['data'].length == 0) {
                        $('#deleteLocationConfirm').modal('show');
                    } else {
                        $('#cannotDeleteLocation').modal('show');
                    }
                    
                }
    
            },
    
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log(jqXHR);
            }
        })
    };
    
});

$('#deleteLocationButton').on('click', function() {

    $.ajax({
        url: "libs/php/deleteLocationByID.php",
        type: "POST",
        dataType: "json",
        data: {
            locationID: document.getElementById('deleteLocationSelect').value
        },

        success: function(result) {

            if (result.status.name == "ok") {

                console.log('Location deleted');

                location.reload(true);
                
            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
});



$('#deleteEmployee').on('click', function() {


    $.ajax({
        url: "libs/php/deleteEmployeeByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: selectedId
        },

        success: function(result) {

            if (result.status.name == "ok") {

                console.log(result);

                location.reload(true);

            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
});
