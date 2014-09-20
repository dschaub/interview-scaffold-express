// signup.js

(function($) {

    $(function() {
        $('#loginForm').submit(function(e) {
            e.preventDefault();

            $.ajax({
                url: '/login',
                type: 'POST',

                data: {
                    username: $('[name=username]').val(),
                    password: $('[name=password]').val(),
                },

                success: function(response) {
                    location.href = '/index.html';
                },

                error: function(xhr) {
                    var response = JSON.parse(xhr.responseText);
                    $('.errors').text(response.error);
                }
            });
        });
    });

})(jQuery);
