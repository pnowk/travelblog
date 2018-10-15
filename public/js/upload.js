$(document).ready(function() {
    $("#myBtn").click(function() {
        $("#uploadModal").modal();
    });
});


// $('.upload-btn').on('click', function() {
//     $('#upload-input').click();
// });

//reset progress bars after selecting files
$('.upload-btn').on('click', function() {
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});


//upload logic, ensure user didn't click cancel
//files array contains all selected files
$('#upload-input').on('change', function() {

    var files = $(this).get(0).files;

    if (files.length > 0) {
        // One or more files selected, process the file upload
    }

});

/*
We now need to create and populate a FormData object which is basically 
a set of key/value pairs representing form fields and their values.
Once constructed, we can send this FormData object with our AJAX request to the server.
*/
$('#upload-input').on('change', function() {

    var files = $(this).get(0).files;

    if (files.length > 0) {
        // One or more files selected, process the file upload

        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();

        // loop through all the selected files
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // add the files to formData object for the data payload
            formData.append('uploads[]', file, file.name);
        }

        $.ajax({
            url: '/files/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                console.log('upload successful!');
            },
            xhr: function() {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();

                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function(evt) {

                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('.progress-bar').text(percentComplete + '%');
                        $('.progress-bar').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('.progress-bar').html('Done');
                        }

                    }

                }, false);

                return xhr;
            }
        });

    }

});