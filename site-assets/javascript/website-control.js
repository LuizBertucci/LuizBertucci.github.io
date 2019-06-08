/*Nothing to see here, thank u!*/

/*$(window).scroll(function () {
    var a = $(window).scrollTop();

    if (a > 0) {
        $("#navbar-seupc").removeClass("transparent z-depth-0");
        $("#navbar-seupc").addClass("white");
    } else {
        $("#navbar-seupc").removeClass("white");
        $("#navbar-seupc").addClass("transparent z-depth-0");

    }

});*/

$(".phone-input")
    .mask("(99) 99999-9999")
    .focusout(function (event) {
        var target, phone, element;
        target = (event.currentTarget) ? event.currentTarget : event.srcElement;
        phone = target.value.replace(/\D/g, '');
        element = $(target);
        element.unmask();
        if (phone.length > 10) {
            element.mask("(99) 99999-9999");
        } else {
            element.mask("(99) 99999-9999");
        }
    });