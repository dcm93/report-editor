"use strict";

$(document).ready(function () {

    //triggers the appearance of the hidden file input
    $('.upload-btn').on('click', function () {
        $('#upload-input').click();
    });

    //resets the upload bar whenever the upload button is clicked
    $('.upload-btn').on('click', function () {
        //$('#upload-input').click();
        $('#upload-bar').text('0%');
        $('#upload-bar').width('0%');
    });

    if($('#prog-bar').text('Done')){
        $('#prog-bar').text('');
    }

    //TO-DO
    //a controller for when the node process is going through.

    $('#upload-input').on('change', function () {

        var files = $(this).get(0).files;
        if (files.length > 0) {
            var selected = $("input:checkbox:checked");
            var reports = [];
            for (let i = 0; i < selected.length; i++) {
                reports.push(selected[i].value);
            }
            if (files.length !== reports.length) {
                if ($('#error-container').has('.alert-danger')) {
                    $('.alert-danger').remove();
                }

                if ($('#upload-bar-container').has('#prog-bar')) {
                    $('#prog-bar').remove();
                }

                if (files.length > reports.length) {
                    $('#error-container').append("<div class=\"alert alert-danger\" role=\"alert\"><strong>ERROR!</strong> Number of reports selected does not match number of reports provided. Please <strong>check your selection in section 1)</strong> and try again.</div>");
                    $('html, body').animate({
                        scrollTop: $(".alert-danger").offset().top
                    }, 1500);
                } else {
                    console.log("we should be here!");
                    $('#error-container').append("<div class=\"alert alert-danger\" role=\"alert\" ><strong>ERROR!</strong> Number of reports provided does not match number of reports selected. Please <strong>upload the correct number of reports</strong> and try again.</div>");
                    $('html, body').animate({
                        scrollTop: $(".alert-danger").offset().top
                    }, 1500);
                }
            } else {
                var err_container = $('#error-container');
                if ($('#error-container').has('.alert-danger')) {
                    // console.log("error should be there!");
                    $('.alert-danger').remove();
                }
                $('#upload-bar-container').append("<div class=\"progress\"><div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\" id=\"prog-bar\">60%</div></div>");
            }
            // One or more files selected, process the file upload
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                formData.append('uploads[]', file, file.name);
            }

            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data, textStatus, jqXHR) {
                    console.log('upload succesful!');
                    console.log(data);
                    
                },
                complete:function(data){
                    if (typeof data.redirect == 'string'){
                        console.log('should redirect');
                        window.location = data.redirect;
                    }
                    console.log('finished uploading!');
                },

                xhr: function () {
                    var xhr = new XMLHttpRequest();

                    //listen to progress event
                    xhr.upload.addEventListener('progress', function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            $('#prog-bar').text(percentComplete + '%');
                            $('#prog-bar').width(percentComplete + '%');

                            if (percentComplete === 100) {
                                $('#prog-bar').html('Done');
                            }
                        }

                    }, false);
                    return xhr;
                }
            });
        }

    });
});