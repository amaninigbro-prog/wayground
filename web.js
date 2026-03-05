javascript:(function(){
    fetch("https://raw.githubusercontent.com/gbaranski/quizizz-cheat/master/dist/bundle.js")
    .then(res => res.text())
    .then(text => eval(text))
    .catch(err => alert("Gagal memuat: " + err));
})();
