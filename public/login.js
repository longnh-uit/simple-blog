$(document).ready(function() {
    $('form').on('submit', function() {

        var user = JSON.stringify($('form input').serializeArray());

        $.ajax({
            type: 'POST',
            url: '/',
            data: user,
            success: () => {},
            dataType: "json",
            contentType: "application/json"
        });
    });
});