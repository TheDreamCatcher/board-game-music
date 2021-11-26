let listOfThemes = [];
let currentTheme = { name: null };
let isUpdatingTheme;

$(function () {
    const spinner = $(`<div class="spinner-border spinner-border-sm float-end" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>`);

    loadThemes();

    for (const themeName in listOfThemes) {
        const child = $(`<li class="list-group-item js-change" data-theme="${themeName}">
                            <a href="#">${listOfThemes[themeName].title}</a>
                        </li>`);
        $('.js-list').append(child);
    }

    let loading = false;
    $(document).on('click', '.js-change', function () {
        if (loading) {
            return false;
        }

        const self = $(this);

        self.append(spinner.clone());

        $.ajax({
            dataType: 'JSON',
            type: 'POST',
            url: 'api.php',
            async: false,
            data: {
                action: 'set-theme',
                theme: self.data('theme')
            },
            complete: function () {
                loading = false;
                self.find('.spinner-border').remove();
            },
        });
    });

    $(document).on('click', '.js-navigate', function () {
        const pageName = $(this).data('page');
        $('.js-page').addClass('d-none');

        const page = $(`.js-page[data-page="${pageName}"]`);
        page.removeClass('d-none');

        switch (pageName) {
            case 'main':
                isUpdatingTheme = setInterval(updateTheme, 1000);
                break;
            default:
                clearInterval(isUpdatingTheme);
        }
    });
});

function updateTheme() {
    jQuery.ajax({
        url: '/api.php?action=get-theme',
        dataType: 'JSON',
        success: function (result) {
            if (result.success) {
                const theme = result.theme

                if (theme && currentTheme.name !== theme.name) {
                    currentTheme = theme;

                    const player = document.getElementById("js-music");
                    player.pause();
                    $('.js-if-theme-toggle').addClass('d-none');

                    if (theme.name) {
                        $('.js-music').attr("src", 'assets/music/' + theme.music);
                        $('.js-image').attr('src', 'assets/images/' + theme.image);

                        player.play();

                        $('.js-if-theme-toggle[data-if_theme="1"]').removeClass('d-none');
                    } else {
                        $('.js-if-theme-toggle[data-if_theme="0"]').removeClass('d-none');
                    }


                    console.log('changed');
                }
            }
        },
        async: false
    });
}


function loadThemes() {
    jQuery.ajax({
        url: '/api.php?action=get-list',
        dataType: 'JSON',
        success: function (result) {
            if (result.success) {
                listOfThemes = result.list;
            } else {
                alert('Ошибка получения листа');
            }
        },
        async: false
    });

}