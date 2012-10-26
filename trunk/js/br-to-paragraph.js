/*
Semantic HTML Markup Converter by Taufik Nurrohman
URL: https://plus.google.com/108949996304093815163/about
*/

(function() {
	var ta = document.getElementById('field'),
		cc = document.getElementById('copy-code'),
		rs = document.getElementById('result'),
		pv = document.getElementById('preview'),
		rb = document.getElementById('run-button'),
		ck_1 = document.getElementById('ck-1'),
		ck_2 = document.getElementById('ck-2');
	function toParagraph() {
		var job = ta.value, raw;
			job = job.replace(/<br \/>/ig, "<br/>");
			raw = job.split(/\n{2,}/);
			raw = '<p>' + raw.join('</p><p>') + '</p>';
			raw = raw.replace(/>([\n\t]+)</g, "><");
			raw = raw.replace(/>\s{2,}</g, "><");
			raw = raw.replace(/>\s+/g, "> ");
			raw = raw.replace(/(\n+)?<br\/?>(\n+)?<br\/?>/ig, "</p><p>");
			raw = raw.replace(/<td(.*?)>(.*?)<\/p><p>(.*?)<\/td>/ig, "<td$1>$2<br/><br/>$3</td>");
			raw = raw.replace(/<p><(img|h[1-6]|figure)(.*?)>(.*?)<\/(.*?)><\/p>/ig, "<$1$2>$3</$4>");
			raw = raw.replace(/\n/g, "<br/>");
			raw = raw.replace(/(<p>)?<(blockquote|div|section)(.*?)>/ig, "<$2$3><p>");
			raw = raw.replace(/<\/(blockquote|div|section)>(<\/p>)?/ig, "</p></$1>");
			raw = raw.replace(/<\/(blockquote|div|section)>([^<])/ig, "</$1><p>");
			raw = raw.replace(/<p><(table|ol|ul|li)(.*?)>/ig, "<$1$2>");
			raw = raw.replace(/<\/(table|ol|ul|li)><\/p>/ig, "</$1>");
			raw = raw.replace(/<p><(pre|h[1-6])(.*?)>/ig, "<$1$2>");
			raw = raw.replace(/<\/(h[1-6])>([^<])/ig, "<\/$1><p>$2");
			raw = raw.replace(/<\/(pre)><\/p>/ig, "<\/$1>");
			raw = raw.replace(/<pre(.*?)>(.*?)<\/pre>/ig, function(m) {
				return m.replace(/<\/p><p>/ig, "\n\n").replace(/<br ?\/?>/ig, "\n");
			});
			raw = (ck_1.checked) ? raw.replace(/<b>(.*?)<\/b>/ig, "<strong>$1</strong>") : raw;
			raw = (ck_1.checked) ? raw.replace(/<i>(.*?)<\/i>/ig, "<em>$1</em>") : raw;
			raw = (ck_1.checked) ? raw.replace(/<u>(.*?)<\/u>/ig, "<span class=\"underline\">$1</span>") : raw;
			raw = (ck_2.checked) ? raw.replace(/<span(.*?)style="font-style: ?italic;?">(.*?)<\/span>/ig, "<em>$2</em>") : raw;
			raw = (ck_2.checked) ? raw.replace(/<span(.*?)style="font-weight: ?bold;?">(.*?)<\/span>/ig, "<strong>$2</strong>") : raw;
			raw = raw.replace(/ +?<\/p>/g, "<\/p>").replace(/<p> +?/g, "<p>");
		rs.textContent = raw;	
		var rc = rs.innerHTML;
			rc = rc.replace(/&lt;(.*?)&gt;/ig, "<code>&lt;$1&gt;</code>");
			rc = rc.replace(/<code>&lt;p&gt;<\/code>/ig, "<span class='blocker'><code><mark>&lt;p&gt;</mark></code>");
			rc = rc.replace(/<code>&lt;\/p&gt;<\/code>/ig, "<code><mark>&lt;/p&gt;</mark></code></span>");
		rs.parentNode.style.display = "block";
		rs.innerHTML = rc;
		cc.value = rs.textContent;
		pv.parentNode.style.display = "block";
		pv.innerHTML = cc.value;
	}
	rb.onclick = toParagraph;
	ta.onkeyup = toParagraph;
	cc.onclick = function() {
		this.focus();this.select();
	}
})();