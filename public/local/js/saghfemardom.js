function submitArticleComment(row,post_id){
    parent_id = $('#parent_id'+row).val();
    name      = $('#name'+row).val();
    text      = $('#text'+row).val();
    if(name == ''){
        $('#sendComment'+row).html('نام وارد نشده');
        setTimeout(function () {
            $('#sendComment'+row).html('&nbsp;&nbsp; ارسال  نظر&nbsp;&nbsp;');
        }, 1000);
    }
    else if(text == ''){
        $('#sendComment'+row).html('متن وارد نشده');
        setTimeout(function () {
            $('#sendComment'+row).html('&nbsp;&nbsp; ارسال  نظر&nbsp;&nbsp;');
        }, 1000);
    }
    else if(text.length < 15 ){
        $('#sendComment'+row).html('متن کوتاه است');
        setTimeout(function () {
            $('#sendComment'+row).html('&nbsp;&nbsp; ارسال  نظر&nbsp;&nbsp;');
        }, 1000);
    }
    else {
        $('#sendComment'+row).html('&nbsp; ...در حال ارسال&nbsp');
        $.ajax({
            type: "POST",
            url: "/article/comment/" + post_id,
            data: {
                name: name,
                email: 'emailNewTheme',
                text: text,
                star: '5',
                parent_id: parent_id,
                user_id: '0'
            },
            success: function() {
                $('#commentSend'+row).show(300).slideDown(200);
                $('#reply'+row).slideUp(200);
                $('#sendComment'+row).html('&nbsp;&nbsp; ارسال  نظر&nbsp;&nbsp;');
                // empty inputs
                parent_id = $('#parent_id'+row).val('');
                name      = $('#name'+row).val('');
                text      = $('#text'+row).val('');

            }
        });

    }
}
function likeArticleComment(post_id,comment_id){
    $.ajax({
        type: "GET",
        url: "/article/comment/like/" + comment_id + "/" + post_id,
        success: function(msg) {
            $('.likes-count' + comment_id).html(msg.like);
            $('.dislikes-count' + comment_id).html(msg.unlike);
        }
    });
}
function submitBlogComment(row,post_id){
    parent_id = $('#parent_id'+row).val();
    name      = $('#name'+row).val();
    text      = $('#text'+row).val();
    if(name == ''){
        $('#sendComment'+row).html('نام وارد نشده');
        setTimeout(function () {
            $('#sendComment'+row).html('&nbsp;&nbsp; ارسال  نظر&nbsp;&nbsp;');
        }, 1000);
    }
    else if(text == ''){
        $('#sendComment'+row).html('متن وارد نشده');
        setTimeout(function () {
            $('#sendComment'+row).html('&nbsp;&nbsp; ارسال  نظر&nbsp;&nbsp;');
        }, 1000);
    }
    else if(text.length < 15 ){
        $('#sendComment'+row).html('متن کوتاه است');
        setTimeout(function () {
            $('#sendComment'+row).html('&nbsp;&nbsp; ارسال  نظر&nbsp;&nbsp;');
        }, 1000);
    }
    else {
        $('#sendComment'+row).html('&nbsp; ...در حال ارسال&nbsp');
        $.ajax({
            type: "POST",
            url: "/blog/comment/" + post_id,
            data: {
                name: name,
                email: 'emailNewTheme',
                text: text,
                star: '5',
                parent_id: parent_id,
                user_id: '0'
            },
            success: function() {
                $('#commentSend'+row).show(300).slideDown(200);
                $('#reply'+row).slideUp(200);
                $('#sendComment'+row).html('&nbsp;&nbsp; ارسال  نظر&nbsp;&nbsp;');
                // empty inputs
                parent_id = $('#parent_id'+row).val('');
                name      = $('#name'+row).val('');
                text      = $('#text'+row).val('');

            }
        });

    }
}
function likeBlogComment(post_id,comment_id){
    $.ajax({
        type: "GET",
        url: "/blog/comment/like/" + comment_id + "/" + post_id,
        success: function(msg) {
            $('.likes-count' + comment_id).html(msg.like);
            $('.dislikes-count' + comment_id).html(msg.unlike);
        }
    });
}