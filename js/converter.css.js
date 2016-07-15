(function(w, d) {

var input = d.getElementById('input'),
    output = d.getElementById('output'),
    mode = d.getElementById('mode'),
    r_c = d.getElementById('r-c'),
    a_b = d.getElementById('a-b'),
    i_w = d.getElementById('i-w'),
    i_m = d.getElementById('i-m');

var R = 0;

function trim(text) {
    return text.replace(/^\s*|\s*$/g, "");
}

function indent(text) {
    var o = "";
    if (!text) {
        text = i_w ? (i_w.value === '\\t' ? '\t' : i_w.value) : '  ';
    }
    if (R < 0) R = 0;
    for (var i = 0; i < R; ++i) {
        o += text;
    }
    return o;
}

function x(text) {
    text = text.replace(/ /g, '\\x0');
    text = text.replace(/\n/g, '\\x1');
    text = text.replace(/\t/g, '\\x2');
    text = text.replace(/\{/g, '\\x3');
    text = text.replace(/\}/g, '\\x4');
    return text;
}

function v(text) {
    text = text.replace(/\\x0/g, ' ');
    text = text.replace(/\\x1/g, '\n');
    text = text.replace(/\\x2/g, '\t');
    text = text.replace(/\\x3/g, '{');
    text = text.replace(/\\x4/g, '}');
    return text;
}

function common(text) {
    text = text.replace(/\r/g, "");
    // lower-case hex color code
    text = text.replace(/#([a-f0-9]{3}|[a-f0-9]{6})(?=[;,\s\}]|$)/gi, function(a, b) {
        return '#' + b.toLowerCase();
    });
    // from `#abc` to `#aabbcc`
    text = text.replace(/#([a-f0-9])([a-f0-9])([a-f0-9])(?=[;,\s\}]|$)/gi, function(a, b, c, d) {
        return '#' + b + b + c + c + d + d;
    });
    // from `0px` to `0`, `0.5px` to `.5px`
    text = text.replace(/\b(\d+\.)?(\d+)([a-z]+|%|\))/g, function(a, b, c, d) {
        b = b === '0.' ? '.' : b;
        b = b || "";
        return b + c + (!b && c === '0' && d !== ')' ? "" : d);
    });
    // from `0 0` and `0 0 0` and `0 0 0 0` to `0`
    text = text.replace(/\b0( 0){1,3}/g, '0');
    text = text.replace(/\bbackground-position:\s*0(?=[;,\s\}]|$)/g, 'background-position: 0 0');
    // keep white-space in `calc()`
    text = text.replace(/\bcalc\(\s*(.*?)\s*\)/g, function(a, b) {
        return 'calc(' + b.replace(/\s+/g, ' ') + ')';
    });
    // tidy `!important`
    text = text.replace(/\s*!important(?=[;\s\}]|$)/g, ' !important');
    return text;
}

function tidy_raw(text) {
    var output = "";
    var parts = [];
    text.replace(/([\s\S]*?)("(?:[^"\\]|\\.)*?"|'(?:[^'\\]|\\.)*?'|[\{\}]|$)/g, function(a, b, c) {
        if (b) parts.push(b);
        if (c) parts.push(c);
    });
    var selectors = 1;
    for (var i = 0, len = parts.length; i < len; ++i) {
        var s = parts[i];
        // enter ...
        if (s === '{') {
            selectors = 0;
            R++;
        }
        // exit ...
        if (s === '}') {
            selectors = 1;
            R--;
        }
        if (s[0] === '"' && s.slice(-1) === '"' || s[0] === "'" && s.slice(-1) === "'") {
            s = x(s);
        } else {
            if (s === '{') {
                s = ' ' + s + '\n';
            } else if (s === '}') {
                s = indent() + s + '\n';
            } else {
                s = common(s);
                if (selectors) {
                    s = trim(s).replace(/(\s*,\s*)+/g, ',');
                    s = s.replace(/,$/, "");
                    s = s.replace(/\s*([~+>])\s*/g, ' $1 ');
                    s = s.replace(/(\S)\s+(\S)/g, '$1 $2');
                    s = s.replace(/\(([a-z0-9\-]+?)\s*:\s*(.*?)\)/g, '($1: $2)');
                } else {
                    s = trim(s).replace(/(\s*;\s*)+/g, ';');
                    s = s.replace(/;$/, "");
                    s = s.replace(/;/g, ';\n' + indent());
                    s = s.replace(/([a-z0-9\-]+?)\s*:\s*(.*?)(?=;|$)/g, '$1: $2');
                }
                s = indent() + s;
            }
            s = s.replace(/\s*,\s*/g, ', ');
            s = s.replace(/(\s*)\}/g, ';\n$1}');
        }
        output += s;
    }
    output = output.replace(/("(?:[^"\\]|\\.)*?"|'(?:[^'\\]|\\.)*?')\s*/g, '$1');
    output = output.replace(/\n\s*;\s*\n/g, '\n');
    // empty selector(s)
    output = output.replace(/\{\s*\}/g, '{}');
    return trim(output);
}

function tidy(text) {
    return v(text);
}

function beautify(text) {
    var parts = [];
    text.replace(/([\s\S]*?)(\/\*[\s\S]*?\*\/|$)/g, function(a, b, c) {
        if (b) parts.push(b);
        if (c) parts.push(c);
    });
    var output = "";
    for (var i = 0, len = parts.length; i < len; ++i) {
        var s = parts[i];
        if (s.slice(0, 2) === '/*' && s.slice(-2) === '*/') {
            // this is a comment ...
            output += '\n' + indent() + s + '\n' + indent();
        } else {
            output += tidy_raw(s);
        }
    }
    R = 0;
    return trim(output);
}

function uglify(text) {
    text = tidy_raw(text);
    text = text.replace(/\bcalc\((.*?)\)/g, function(a, b) {
        return 'calc(' + b.replace(/\s+/g, '\\x0') + ')';
    });
    text = text.replace(/("(?:[^"\\]|\\.)*?"|'(?:[^'\\]|\\.)*?'|\/\*[\s\S]*?\*\/)/g, function(a, b) {
        b = b.replace(/^"([a-z_][\w-]*?)"$/g, '$1');
        b = b.replace(/^'([a-z_][\w-]*?)'$/g, '$1');
        return x(b);
    });
    text = text.replace(/([\{\}]+?)\s*\{/g, function(a, b) {
        b = b.replace(/\s+:/g, x(' :'));
        b = b.replace(/\s+\[/g, x(' ['));
        b = b.replace(/\]\s+/g, x('] '));
        return b + '{';
    });
    text = text.replace(/\s*([~+>:;,\[\]\(\)\{\}]|!important)\s*/g, '$1');
    // minify HEX color code
    text = text.replace(/#([a-f0-9]{6})(?=[;,\s\}]|$)/g, function(a, b) {
        var min = "";
        min += b[0] === b[1] ? b[0] : b[0] + b[1];
        min += b[2] === b[3] ? b[2] : b[2] + b[3];
        min += b[4] === b[5] ? b[4] : b[4] + b[5];
        return '#' + (min.length === 3 ? min : b);
    });
    // remove empty selector(s)
    text = text.replace(/(^|[\{\}])[^\{\}]*?\{\}/g, '$1');
    // option(s)
    text = text.replace(/([^\{\}]+?)\{(.*?);?(\}+)/g, '$1{$2$3' + (a_b.checked ? '\n' : ""));
    text = text.replace(/\s*(\/\*[\s\S]*?\*\/)\s*/g, function(a, b) {
        return r_c.checked && b[2] !== '!' ? "" : b;
    });
    return trim(text);
}

function run() {
    var v = input.value;
    v = mode.value == 0 ? uglify(v) : beautify(v);
    if (mode.value == 1 && i_m.checked) {
        v = v.replace(/\s*\}/g, ' }');
        v = v.replace(/\}\s*/g, '} ');
        v = v.replace(/\{\s*/g, '{ ');
        v = v.replace(/\s*\{/g, ' {');
        v = v.replace(/;\n\s*/g, '; ');
    }
    output.value = tidy(v);
}

input.onkeyup = run;
input.oninput = run;
input.onpaste = run;

function change() {
    var f = mode.parentNode.parentNode.parentNode.getElementsByTagName('fieldset');
    f[1].style.display = mode.value == 0 ? 'block' : 'none';
    f[0].style.display = mode.value == 1 ? 'block' : 'none';
    run();
} change();

mode.onchange = change;

r_c.onchange = run;
a_b.onchange = run;
i_w.onchange = run;
i_m.onchange = run;

})(window, document);