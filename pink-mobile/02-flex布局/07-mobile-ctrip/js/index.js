window.addEventListener("load", function () {
    var subnavEntryIcon = document.querySelectorAll(".subnav-entry-icon");
    for (var i = 0; i <= subnavEntryIcon.length - 1; i++) {
        let positionY = i * 32;
        subnavEntryIcon[i].style.backgroundPosition = "0 " + "-" + positionY + "px";
    }
})