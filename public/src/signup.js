// signup.js

(function($) {

    $(function() {
        $('#signupForm').submit(function(e) {
            e.preventDefault();

            $.ajax({
                url: '/signup',
                type: 'POST',

                data: {
                    username: $('[name=username]').val(),
                    password: $('[name=password]').val(),
                    deposit: $('[name=deposit]').val()
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
