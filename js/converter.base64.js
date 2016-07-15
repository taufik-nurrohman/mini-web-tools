(function(w, d) {

var input = d.getElementById('input'),
    output = d.getElementById('output'),
    raw = d.getElementById('raw');

input.onchange = function() {
    var reader = new FileReader(), v;
    reader.onloadend = function() {
        v = reader.result;
        output.value = !raw.checked ? v : v.replace(/^data:.*?;base64,/, "");
        output.focus();
        output.select();
    };
    reader.readAsDataURL(this.files[0]);
};

})(window, document);