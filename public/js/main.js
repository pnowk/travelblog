//delete article 
$(document).ready(function() {
    $('.delete-art').on('click', function(e) {
        $target = $(e.target);
        var id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/' + id,
            success: function(response) {

                alert('deleting article');
                window.location.href = '/';

            },
            error: function(err) {
                console.log(err);
            }
        });
    });
});


function properCase(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

//add places form validation
//get trabel dates
var travelDates = document.getElementsByClassName('travel-dates');

//add listeners
for (var i = 0; i < travelDates.length; i++) {
    travelDates[i].addEventListener('blur', checkDates);
}
//check for errors and manage controls
function checkDates(e) {
    // console.log(e.target.value);

    var dateFrom = new Date();
    var dateTo = new Date();
    dateFrom = travelDates[0].value;
    dateTo = travelDates[1].value;

    if (!dateFrom.length == 0) {

        if (dateFrom <= dateTo) {
            // console.log('ok');
            hightlightDates(false);
        } else {

            hightlightDates(true);
        }
    } else {
        hightlightDates(true);
    }


}

//highlight elements if error
function hightlightDates(validationError) {
    for (var i = 0; i < travelDates.length; i++) {
        travelDates[i].style.border = validationError ? 'solid  1px red' : 'solid 1px green';
    }
    var outputValidation = document.getElementById('validation-output');
    var submitBtn = document.querySelector('input[type="submit"]');

    if (validationError) {
        outputValidation.innerHTML = '<h3> Nieprawidłowe daty! </h3>';
        outputValidation.style = 'color: red; font-family: "Verdana";';
        // travelDates[0].focus();
    } else {
        outputValidation.innerHTML = '';
    }
    submitBtn.disabled = validationError;

}