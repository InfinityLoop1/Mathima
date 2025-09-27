const animationToggle = document.getElementById("animation-toggle");

if (localStorage.getItem("animationsEnabled") === "true") {
    animationToggle.checked = true;
} else {
    animationToggle.checked = false;
}

animationToggle.addEventListener("change", function (e) {
    if (e.target.checked) {
        localStorage.setItem("animationsEnabled", "true");
    } else {
        localStorage.setItem("animationsEnabled", "false");
    }
});