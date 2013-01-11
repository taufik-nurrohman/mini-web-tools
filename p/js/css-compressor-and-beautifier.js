/*
CSS Compressor & Beautifier Script by Taufik Nurrohman,
https://plus.google.com/108949996304093815163/posts
*/

function get(id) {
	return document.getElementById(id);
}

var hc = get('highlightCode'),
	sa = get('stripAllComment'),
	sc = get('superCompact'),
	cm = get('keepLastComma'),
	bi = get('betterIndentation'),
	bs = get('breakSelector'),
	tt = get('toTab'),
	to = get('tabOpt').getElementsByTagName('input'),
	sb = get('spaceBetween'),
	ip = get('inlineSingleProp'),
	rs = get('removeLastSemicolon'),
	il = get('inlineLayout'),
	si = get('singleBreak'),
	hr = get('highlightedResult'),
	rt = document.getElementsByTagName('h2')[1];

/* Syntax Highlighter */
function highlightCode(el) {
	if (hc.checked) {
		var t = el.innerHTML;
		t = t.replace(/\{([\s\S]+?)\}/g, function(m) {
			return m.replace(/\'(.*?)\'/g, "<span class='st'>\'$1\'</span>").replace(/\"(.*?)\"/g, "<span class='st'>\"$1\"</span>").replace(/(\{|\n|;)?(.[^\{]*?):(.[^\{]*?)(;|\})/g, "$1<span class='pr'>$2</span>:<span class='vl'>$3</span>$4").replace(/<span class='pr'>\{/g, "{<span class='pr'>");
		});
		t = t.replace(/&lt;(.*?)('|")(.*?)('|")&gt;/g, function(m) {
			return m.replace(/'(.*?)'/g, "<span class='vl'>\'$1\'</span>").replace(/"(.*?)"/g, "<span class='vl'>\"$1\"</span>")
		});
		t = t.replace(/\{([\s\S]+?)\}/g, function(m) {
			return m.replace(/([\(\)\{\}\[\]\:\;\,]+)/g, "<span class='pn'>$1</span>").replace(/\!important/ig, "<span class='im'>!important</span>");
		});
		t = t.replace(/\/\*([\w\W]+?)\*\//gm, "<span class='cm'>/*$1*/</span>");
		el.innerHTML = '<code>' + t + '</code>';
		hr.style.display = "block";
		rt.style.display = "block";
	} else {
		hr.style.display = "none";
		rt.style.display = "none";
	}
}

/* CSS Compressor */
function compressCSS(id) {
	var cf = get(id),
		iq = /@(media|-w|-m|-o|keyframes|page)(.*?)\{([\s\S]+?)?\}\}/ig,
		v = cf.value,
		ln = v.length;
	v = (sa.checked || sc.checked) ? v.replace(/\/\*[\w\W]*?\*\//gm, "") : v.replace(/(\n+)?(\/\*[\w\W]*?\*\/)(\n+)?/gm, "\n$2\n");
	v = v.replace(/([\n\r\t\s ]+)?([\,\:\;\{\}]+?)([\n\r\t\s ]+)?/g, "$2");
	v = (sc.checked) ? v : v.replace(/\}(?!\})/g, "}\n");
	v = (bi.checked) ? v.replace(iq, function(m) {
		return m.replace(/\n+/g, "\n  ");
	}) : v.replace(iq, function(m) {
		return m.replace(/\n+/g, "");
	});
	v = (bi.checked && !sc.checked) ? v.replace(/\}\}/g, "}\n}") : v;
	v = (bi.checked && !sc.checked) ? v.replace(/@(media|-w|-m|-o|keyframes)(.*?)\{/g, "@$1$2{\n  ") : v;
	v = (cm.checked) ? v.replace(/;\}/g, "}") : v.replace(/\}/g,";}").replace(/;+\}/g,";}").replace(/\};\}/g,"}}");
	v = v.replace(/\:0(px|em|pt)/ig, ":0");
	v = v.replace(/ 0(px|em|pt)/ig, " 0");
	//v = v.replace(/ +?(\>|\+|\~) +?/g,"$1");
	v = v.replace(/\s+\!important/ig, "!important");
	v = v.replace(/(^\n+|\n+$)/, "");
	cf.value = v;
	hr.innerHTML = '\/\* ' + (ln - v.length) + ' of ' + ln + ' unused characters has been removed. \*\/\n' + v.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	highlightCode(hr);
}

/* CSS Beautifier */
function beautifyCSS(id) {
	sc.checked = false;
	sa.checked = false;
	bi.checked = false;
	compressCSS('cssField'); // Compress first...
	var bf = get(id),
		iq = /\n@(media|-w|-m|-o|keyframes|page)(.*?)\{([\s\S]+?)?\}\n\}/ig, // Inside `@query{}`
		v = bf.value;
	if (!il.checked) {
		v = v.split(';').join(';\n  ');
		v = v.split('{').join(' {\n  ');
		v = v.split('}').join(';\n}\n');
		v = v.replace(/\}([\n\s;]+?)?\}/g, "}\n}");
		v = (bs.checked) ? v.replace(/\n(.*?)\{/g, function(m) {
			return m.replace(/,/g, ",\n"); // Break multiple selectors
		}) : v;
		v = v.replace(/@([\s\S]+?)\{/g, function(m) {
			return m.replace(/,\n/g, ", ");
		});
		v = v.replace(iq, function(m) {
			return m.replace(/\n/g, "\n  ").replace(/\n\s+\n/g, "\n").replace(/\}\n+\s+\}/g, "}\n}");
		});
	} else {
		v = v.replace(/;/g, "; ");
		v = v.replace(/\{(.*?)\}/g, " { $1; }");
		v = v.replace(/\}\}/g, "}\n}");
		v = v.replace(iq, function(m) {
			return m.replace(/\n/g, "\n    ").replace(/\n+\s+\n/g, "\n").replace(/\}\n\s+\}/g, "}\n}");
		})
		v = v.replace(/\{(.*?)\{(.*?):(.*?)\}\n/g, "{\n     $1 { $2:$3}\n");
	}
	v = v.replace(/\{\n  ;\n\}|\{ ; \}/g, "{}"); // Empty selectors
	v = (sb.checked) ? v.replace(/\{([\s\S]+?)\}|\((.*?)\)/gm, function(m) {
		return m.replace(/(,|\:)/g, "$1 ");
	}) : v;
	v = (sb.checked) ? v.replace(/(.*?)\{/g, function(m) {
		return m.replace(/,/g, ", ");
	}) : v;
	v = v.replace(/\!important/g, " !important");
	v = v.replace(/data: ?image(.*?);([\n\r\t\s]+)base64, ?/g, "data:image$1;base64,"); // Data URI Image
	v = v.replace(/\n\s+@(.*?)\{\n    /g, "\n\n@$1{\n  ");
	//v = v.replace(/(\>|\+|\~)/g," $1 ");
	v = (ip.checked) ? v.replace(/(.*){(\n\s+|\t)(.*)\:(.*);\n(\s+)?}/g, "$1{$3:$4;}") : v;
	v = (rs.checked) ? v.replace(/\{(.*?)\;(\s+)?\}/g, "{$1$2}") : v;
	v = (tt.checked && to[0].checked) ? v.split(/  /).join('\t') : v;
	v = (tt.checked && to[1].checked) ? v.split(/  /).join('    ') : v;
	v = (il.checked) ? v.replace(iq, function(m) {
		return m.replace(/\}/g, "} ");
	}) : v;
	v = (si.checked) ? v.replace(/(\}|\*\/)\n+/g, "$1\n").replace(/\/\*/g, "\n/*") : v.replace(/\*\/\n(.)/g, "*/\n\n$1");
	v = v.replace(/(^\n+|\n+$)/, "");
	bs.disabled = (il.checked) ? true : false;
	ip.disabled = (il.checked) ? true : false;
	tt.disabled = (il.checked) ? true : false;
	to[0].disabled = (tt.checked && !il.checked) ? false : true;
	to[1].disabled = (tt.checked && !il.checked) ? false : true;
	bf.value = v;
	hr.innerHTML = v.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	highlightCode(hr);
}

/* Clear the field value */
function clearField(id) {
	var fl = get(id);
	fl.value = "";
	fl.focus();
}

/* Select All */
function selectAll(id) {
	get(id).focus();
	get(id).select();
}