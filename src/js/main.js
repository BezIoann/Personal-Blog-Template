jQuery('.like').click(function () {
    jQuery(this).toggleClass('active');
    let likeCount = jQuery('.like-count');
    alert(likeCount, "KJDF");
});