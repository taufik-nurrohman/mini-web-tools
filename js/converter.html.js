(function(w, d) {

var input = d.getElementById('input'),
    output = d.getElementById('output');
    mode = d.getElementById('mode');

function uglify(text) {
    // keep important white-space(s) around `<img>` and `<input>` tag(s)
    text = text.replace(/\s+(<(?:img|input)(?: *\/?>|\s.*? *\/?>))/g, '\0$1');
    text = text.replace(/(<(?:img|input)(?: *\/?>|\s.*? *\/?>))\s+/g, '$1\0');
    // uglify ...
    text = text.replace(/\s*(<[^<>]+?>)\s*/g, '$1');
    text = text.replace(/\0/g, ' ');
    // remove extra white-space(s) between attribute(s)
    text = text.replace(/<\s*([\s\S]+?)\s*>/g, function(a, b) {
        b = b.replace(/\s+(\S+=)/g, ' $1');
        b = b.replace(/(['"])\s+/g, '$1 ');
        return '<' + b + '>';
    });
    // clean-up ...
    // o: tag-open
    // c: tag-close
    // t: text
    text = text.replace(/(<[^\/]+?>)\s+(<[^\/]+?>)/g, '$1$2'); // o + o
    text = text.replace(/(<\/.+?>)\s+(<\/.+?>)/g, '$1$2'); // c + c
    text = text.replace(/(<[^\/]+?>)\s+(<\/.+?>)/g, '$1$2'); // o + c (empty tag)
    return text;
}

function beautify(text) {
    var indent = '  ',
        current = 0,
        results = "",
        char, char_next, i, j;
    text = uglify(text); // uglify first ...
    for (i = 0, j = text.length; i < j; ++i) {
        char = text[i] || "";
        char_next = text[i + 1] || "";
        // open
        if (char === '<' && char_next !== '/') {
            results += '\n' + indent.repeat(current);
            current++;
        // close
        } else if (char === '<' && char_next === '/') {
            if(--current < 0) current = 0;
            results += '\n' + indent.repeat(current);
        }
        results += char;
    }
    return results.replace(/(?:(<[^\/]*?>)|([^\s>]))\s*<\//g, '$1$2</').replace(/^\s*|\s*$/g, "");
}

function run() {
    var v = input.value;
    output.value = mode.value == 0 ? uglify(v) : beautify(v);
}

input.onkeyup = run;
input.oncut = run;
input.onpaste = run;
input.oninput = run;

mode.onchange = run;

})(window, document);