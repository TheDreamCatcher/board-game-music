let listOfThemes = [];
let currentTheme = { name: null };
let isUpdatingTheme;

$(function () {
    const spinner = $(`<div class="spinner-border spinner-border-sm float-end" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>`);

    loadThemes();

    for (const theme of listOfThemes) {
        const child = $(`<a href="#" 
class="list-group-item list-group-item-acion js-change" data-theme="${theme.name}">
${theme.title}
</a>`);
        $('.js-list').append(child);
    }

    let loading = false;
    $(document).on('click', '.js-change', function () {
        if (loading) {
            return false;
        }

        $('.js-change').removeClass('active');

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
            success: function (res) {
                if (res.unset) {
                    self.removeClass('active');
                } else {
                    self.addClass('active');
                }
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
                isUpdatingTheme = setInterval(updateTheme, 3000);
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

                if (currentTheme.name !== theme.name) {
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
                listOfThemes = result.list.sort((first, second) => {
                    return first.title < second.title
                        ? -1
                        : 1
                });
            } else {
                alert('Ошибка получения листа');
            }
        },
        async: false
    });

}