$(function () {
    const spinner = $(`<div class="spinner-border spinner-border-sm float-end" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>`);

    const items = [
        {
            title: 'Порт',
            theme: 'port',
        },
        {
            title: 'Открытое море',
            theme: 'open-sea',
        },
        {
            title: 'Морское сражение с монстром',
            theme: 'battle-in-sea-with-monster',
        },
    ];

    let a = 1;
    for (const item of items) {
        const child = $(`<li class="list-group-item js-change" data-theme="${item.theme}">
                            <a href="#">${item.title}</a>
                        </li>`);
        $('.js-list').append(child);
    }

    let loading = false;
    $(document).on('click', '.js-change', function () {
        if (loading) {
            return false;
        }

        $(this).append(spinner.clone());

        $.ajax({
            dataType: 'JSON',
            type: 'POST',
            url: 'index.php',
            data: { theme: $(this).data('theme') },
            success: function () {

            },
            complete: function () {
                loading = false;
                $(this).find('.spinner-border').remove();
            },
        });
    });
});