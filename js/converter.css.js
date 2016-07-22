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
    text = text.replace(/#([\da-f]{3}|[\da-f]{6})\b/gi, function(a, b) {
        return '#' + b.toLowerCase();
    });
    // from `#abc` to `#aabbcc`
    text = text.replace(/#([\da-f])([\da-f])([\da-f])\b/gi, function(a, b, c, d) {
        return '#' + b + b + c + c + d + d;
    });
    // from `0px` to `0`, `0.5px` to `.5px`
    text = text.replace(/\b(0\.)?(\d+)([a-z]+|%)/gi, function(a, b, c, d) {
        b = b === '0.' ? '.' : b;
        b = b || "";
        return (!b || b === '.') && c === '0' ? '0' : b + c + d;
    });
    // from `0 0` and `0 0 0` and `0 0 0 0` to `0`
    text = text.replace(/:\s*(0\s+){0,3}0(?=[!,;\)\}]|$| !)/g, ':0');
    text = text.replace(/\b(background(?:-position)?)\s*:\s*(0|none)\b/gi, '$1: 0 0');
    text = text.replace(/\b(border(?:-radius)?|outline)\s*:\s*none\b/gi, '$1: 0 0');
    text = text.replace(/\b(calc\()\s*(.*?)\s*\)/gi, function(a, b, c) {
        return b + c.replace(/\s+/g, ' ') + ')';
    });
    // tidy `!important`
    text = text.replace(/\s*!important\b/g, ' !important');
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
                    s = s.replace(/\(([\da-z\-]+?)\s*:\s*(.*?)\)/g, '($1: $2)');
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
    R = 0;
    text = tidy_raw(text);
    // keep white-space in `calc()`
    text = text.replace(/\b(calc\()(.*?)\)/gi, function(a, b, c) {
        return b + c.replace(/\s+/g, '\\x0') + ')';
    });
    text = text.replace(/(\bcontent:|\b(?:format|local|url)\(|^|.)("(?:[^"\\]|\\.)*?"|'(?:[^'\\]|\\.)*?'|\/\*[\s\S]*?\*\/)/gi, function(a, b, c) {
        if (b.length <= 1) {
            c = c.replace(/^"([a-z_][\w-]*?)"$/gi, '$1');
            c = c.replace(/^'([a-z_][\w-]*?)'$/gi, '$1');
        } else if (b.toLowerCase() === 'url(') {
            c = c.slice(1).slice(0, -1);
        }
        return b + x(c);
    });
    // fix case for `url(foo.jpg) no-repeat`
    text = text.replace(/\)\s+\b/g, x(') '));
    // fix case for `#foo [bar="baz"]`, `[bar="baz"] .foo` and `#foo :first-child`
    text = text.replace(/([^\{\}]+?)\s*\{/g, function(a, b) {
        b = b.replace(/\s+:/g, x(' :'));
        b = b.replace(/\s+\[/g, x(' ['));
        b = b.replace(/\]\s+/g, x('] '));
        return b + '{';
    });
    text = text.replace(/\s*([~+>:;,\[\]\(\)\{\}]|!important)\s*/g, '$1');
    // minify HEX color code
    text = text.replace(/#([\da-f]{6})\b/g, function(a, b) {
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
        v = v.replace(/\s*\}(?!$)/g, ' }');
        v = v.replace(/\}\s*(?!$)/g, '} ');
        v = v.replace(/\{\s*/g, '{ ');
        v = v.replace(/\s*\{/g, ' {');
        v = v.replace(/;\n\s*/g, '; ');
    }
    output.value = tidy(v);
}

input.onkeyup = run;
input.oncut = run;
input.onpaste = run;
input.oninput = run;

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