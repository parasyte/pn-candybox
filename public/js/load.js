(function () {
    var url = "http://candies.aniwey.net/scripts/load.php";

    var loc = document.location.href;
    var q = loc.indexOf("?");
    if (q >= 0) {
        url += loc.substr(q);
        document.write(
            '<script type="text/javascript" src="' + url + '"></script>'
        );
    }
})();
