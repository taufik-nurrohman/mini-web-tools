/*!

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 Style HTML
---------------

  Written by Nochum Sossonko, (nsossonko@hotmail.com)

  Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
    http://jsbeautifier.org/

  Usage:
    style_html(html_source);

    style_html(html_source, options);

  The options are:
    indent_inner_html (default false)  — indent <head> and <body> sections,
    indent_size (default 4)          — indentation size,
    indent_char (default space)      — character to indent with,
    wrap_line_length (default 250)            -  maximum amount of characters per line (0 = disable)
    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "none"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are.
    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
    indent_scripts (default normal)  - "keep"|"separate"|"normal"
    preserve_newlines (default true) - whether existing line breaks before elements should be preserved
                                        Only works before elements, not inside tags or for text.
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk
    indent_handlebars (default false) - format and indent {{#foo}} and {{/foo}}
    end_with_newline (false)          - end with a newline
    extra_liners (default [head,body,/html]) -List of tags that should have an extra newline before them.

    e.g.

    style_html(html_source, {
      'indent_inner_html': false,
      'indent_size': 2,
      'indent_char': ' ',
      'wrap_line_length': 78,
      'brace_style': 'expand',
      'preserve_newlines': true,
      'max_preserve_newlines': 5,
      'indent_handlebars': false,
      'extra_liners': ['/html']
    });
*/
!function(){function t(t){return t.replace(/^\s+/g,"")}function e(t){return t.replace(/\s+$/g,"")}function n(n,i,s,r){function h(){function n(t){var e="",n=function(n){var i=e+n.toLowerCase();e=i.length>t.length?i.substr(i.length-t.length,t.length):i},i=function(){return-1===e.indexOf(t)};return{add:n,doesNotMatch:i}}return this.pos=0,this.token="",this.current_mode="CONTENT",this.tags={parent:"parent1",parentcount:1,parent1:""},this.tag_type="",this.token_text=this.last_token=this.last_text=this.token_type="",this.newlines=0,this.indent_content=_,this.indent_body_inner_html=o,this.indent_head_inner_html=u,this.Utils={whitespace:"\n\r	 ".split(""),single_token:["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr","!doctype","?xml","?php","basefont","isindex"],extra_liners:v,in_array:function(t,e){for(var n=0;n<e.length;n++)if(t===e[n])return!0;return!1}},this.is_whitespace=function(t){for(var e=0;e<t.length;e++)if(!this.Utils.in_array(t.charAt(e),this.Utils.whitespace))return!1;return!0},this.traverse_whitespace=function(){var t="";if(t=this.input.charAt(this.pos),this.Utils.in_array(t,this.Utils.whitespace)){for(this.newlines=0;this.Utils.in_array(t,this.Utils.whitespace);)f&&"\n"===t&&this.newlines<=b&&(this.newlines+=1),this.pos++,t=this.input.charAt(this.pos);return!0}return!1},this.space_or_wrap=function(t){return this.line_char_count<this.wrap_line_length?(this.line_char_count++,t.push(" "),!1):(this.print_newline(!1,t),this.print_indentation(t),!0)},this.get_content=function(){for(var t,e="",n=[];"<"!==this.input.charAt(this.pos);){if(this.pos>=this.input.length)return n.length?n.join(""):["","TK_EOF"];if(this.traverse_whitespace())this.space_or_wrap(n);else{if(w){if(t=this.input.substr(this.pos,3),"{{#"===t||"{{/"===t)break;if("{{!"===t)return[this.get_tag(),"TK_TAG_HANDLEBARS_COMMENT"];if("{{"===this.input.substr(this.pos,2)&&"{{else}}"===this.get_tag(!0))break}e=this.input.charAt(this.pos),this.pos++,this.line_char_count++,n.push(e)}}return n.length?n.join(""):""},this.get_contents_to=function(t){var e,n,i,s;return this.pos===this.input.length?["","TK_EOF"]:(e="",n=RegExp("</"+t+"\\s*>","igm"),n.lastIndex=this.pos,i=n.exec(this.input),s=i?i.index:this.input.length,this.pos<s&&(e=this.input.substring(this.pos,s),this.pos=s),e)},this.record_tag=function(t){this.tags[t+"count"]?(this.tags[t+"count"]++,this.tags[t+this.tags[t+"count"]]=this.indent_level):(this.tags[t+"count"]=1,this.tags[t+this.tags[t+"count"]]=this.indent_level),this.tags[t+this.tags[t+"count"]+"parent"]=this.tags.parent,this.tags.parent=t+this.tags[t+"count"]},this.retrieve_tag=function(t){if(this.tags[t+"count"]){for(var e=this.tags.parent;e&&t+this.tags[t+"count"]!==e;)e=this.tags[e+"parent"];e&&(this.indent_level=this.tags[t+this.tags[t+"count"]],this.tags.parent=this.tags[e+"parent"]),delete this.tags[t+this.tags[t+"count"]+"parent"],delete this.tags[t+this.tags[t+"count"]],1===this.tags[t+"count"]?delete this.tags[t+"count"]:this.tags[t+"count"]--}},this.indent_to_tag=function(t){if(this.tags[t+"count"]){for(var e=this.tags.parent;e&&t+this.tags[t+"count"]!==e;)e=this.tags[e+"parent"];e&&(this.indent_level=this.tags[t+this.tags[t+"count"]])}},this.get_tag=function(t){var e,n,i,s,r,h,a,_,o,u,p,c,d="",f=[],b="",k=!1,v=!0,x=this.pos,A=this.line_char_count;t=void 0!==t?t:!1;do{if(this.pos>=this.input.length)return t&&(this.pos=x,this.line_char_count=A),f.length?f.join(""):["","TK_EOF"];if(d=this.input.charAt(this.pos),this.pos++,this.Utils.in_array(d,this.Utils.whitespace))k=!0;else{if(("'"===d||'"'===d)&&(d+=this.get_unformatted(d),k=!0),"="===d&&(k=!1),f.length&&"="!==f[f.length-1]&&">"!==d&&k){if(s=this.space_or_wrap(f),r=s&&"/"!==d&&!T,k=!1,!v&&T&&"/"!==d&&(this.print_newline(!1,f),this.print_indentation(f),r=!0),r)for(h=y,"force-aligned"===m&&(h=f.indexOf(" ")+1),a=0;h>a;a++)f.push(l);for(_=0;_<f.length;_++)if(" "===f[_]){v=!1;break}}if(w&&"<"===i&&d+this.input.charAt(this.pos)==="{{"&&(d+=this.get_unformatted("}}"),f.length&&" "!==f[f.length-1]&&"<"!==f[f.length-1]&&(d=" "+d),k=!0),"<"!==d||i||(e=this.pos-1,i="<"),w&&!i&&(f.length<2||"{"!==f[f.length-1]||"{"!==f[f.length-2]||(e="#"===d||"/"===d||"!"===d?this.pos-3:this.pos-2,i="{")),this.line_char_count++,f.push(d),f[1]&&("!"===f[1]||"?"===f[1]||"%"===f[1])){f=[this.get_comment(e)];break}if(w&&f[1]&&"{"===f[1]&&f[2]&&"!"===f[2]){f=[this.get_comment(e)];break}if(w&&"{"===i&&f.length>2&&"}"===f[f.length-2]&&"}"===f[f.length-1])break}}while(">"!==d);return o=f.join(""),u=o.indexOf(-1!==o.indexOf(" ")?" ":"{"===o.charAt(0)?"}":">"),p="<"!==o.charAt(0)&&w?"#"===o.charAt(2)?3:2:1,c=o.substring(p,u).toLowerCase(),"/"===o.charAt(o.length-2)||this.Utils.in_array(c,this.Utils.single_token)?t||(this.tag_type="SINGLE"):w&&"{"===o.charAt(0)&&"else"===c?t||(this.indent_to_tag("if"),this.tag_type="HANDLEBARS_ELSE",this.indent_content=!0,this.traverse_whitespace()):this.is_unformatted(c,g)?(b=this.get_unformatted("</"+c+">",o),f.push(b),n=this.pos-1,this.tag_type="SINGLE"):"script"===c&&(-1===o.search("type")||o.search("type")>-1&&o.search(/\b(text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect)/)>-1)?t||(this.record_tag(c),this.tag_type="SCRIPT"):"style"===c&&(-1===o.search("type")||o.search("type")>-1&&o.search("text/css")>-1)?t||(this.record_tag(c),this.tag_type="STYLE"):"!"===c.charAt(0)?t||(this.tag_type="SINGLE",this.traverse_whitespace()):t||("/"===c.charAt(0)?(this.retrieve_tag(c.substring(1)),this.tag_type="END"):(this.record_tag(c),"html"!==c.toLowerCase()&&(this.indent_content=!0),this.tag_type="START"),this.traverse_whitespace()&&this.space_or_wrap(f),this.Utils.in_array(c,this.Utils.extra_liners)&&(this.print_newline(!1,this.output),this.output.length&&"\n"!==this.output[this.output.length-2]&&this.print_newline(!0,this.output))),t&&(this.pos=x,this.line_char_count=A),f.join("")},this.get_comment=function(t){var e,n="",i=">",s=!1;for(this.pos=t,e=this.input.charAt(this.pos),this.pos++;this.pos<=this.input.length&&(n+=e,n.charAt(n.length-1)!==i.charAt(i.length-1)||-1===n.indexOf(i));)!s&&n.length<10&&(0===n.indexOf("<![if")?(i="<![endif]>",s=!0):0===n.indexOf("<![cdata[")?(i="]]>",s=!0):0===n.indexOf("<![")?(i="]>",s=!0):0===n.indexOf("<!--")?(i="-->",s=!0):0===n.indexOf("{{!--")?(i="--}}",s=!0):0===n.indexOf("{{!")?5===n.length&&-1===n.indexOf("{{!--")&&(i="}}",s=!0):0===n.indexOf("<?")?(i="?>",s=!0):0===n.indexOf("<%")&&(i="%>",s=!0)),e=this.input.charAt(this.pos),this.pos++;return n},this.get_unformatted=function(t,e){var i,s,r,h;if(e&&-1!==e.toLowerCase().indexOf(t))return"";i="",s="",r=!0,h=n(t);do{if(this.pos>=this.input.length)return s;if(i=this.input.charAt(this.pos),this.pos++,this.Utils.in_array(i,this.Utils.whitespace)){if(!r){this.line_char_count--;continue}if("\n"===i||"\r"===i){s+="\n",this.line_char_count=0;continue}}s+=i,h.add(i),this.line_char_count++,r=!0,w&&"{"===i&&s.length&&"{"===s.charAt(s.length-2)&&(s+=this.get_unformatted("}}"))}while(h.doesNotMatch());return s},this.get_token=function(){var t,e,n;return"TK_TAG_SCRIPT"===this.last_token||"TK_TAG_STYLE"===this.last_token?(e=this.last_token.substr(7),t=this.get_contents_to(e),"string"!=typeof t?t:[t,"TK_"+e]):"CONTENT"===this.current_mode?(t=this.get_content(),"string"!=typeof t?t:[t,"TK_CONTENT"]):"TAG"===this.current_mode?(t=this.get_tag(),"string"!=typeof t?t:(n="TK_TAG_"+this.tag_type,[t,n])):void 0},this.get_full_indent=function(t){return t=this.indent_level+t||0,1>t?"":Array(t+1).join(this.indent_string)},this.is_unformatted=function(t,e){var n,i;return this.Utils.in_array(t,e)?"a"===t.toLowerCase()&&this.Utils.in_array("a",e)?(n=this.get_tag(!0),i=(n||"").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/),!i||this.Utils.in_array(i,e)?!0:!1):!0:!1},this.printer=function(n,i,s,r,h){this.input=n||"",this.input=this.input.replace(/\r\n|[\r\u2028\u2029]/g,"\n"),this.output=[],this.indent_character=i,this.indent_string="",this.indent_size=s,this.brace_style=h,this.indent_level=0,this.wrap_line_length=r,this.line_char_count=0;for(var a=0;a<this.indent_size;a++)this.indent_string+=this.indent_character;this.print_newline=function(t,n){this.line_char_count=0,n&&n.length&&(t||"\n"!==n[n.length-1])&&("\n"!==n[n.length-1]&&(n[n.length-1]=e(n[n.length-1])),n.push("\n"))},this.print_indentation=function(t){for(var e=0;e<this.indent_level;e++)t.push(this.indent_string),this.line_char_count+=this.indent_string.length},this.print_token=function(e){(!this.is_whitespace(e)||this.output.length)&&((e||""!==e)&&this.output.length&&"\n"===this.output[this.output.length-1]&&(this.print_indentation(this.output),e=t(e)),this.print_token_raw(e))},this.print_token_raw=function(t){this.newlines>0&&(t=e(t)),t&&""!==t&&(t.length>1&&"\n"===t.charAt(t.length-1)?(this.output.push(t.slice(0,-1)),this.print_newline(!1,this.output)):this.output.push(t));for(var n=0;n<this.newlines;n++)this.print_newline(n>0,this.output);this.newlines=0},this.indent=function(){this.indent_level++},this.unindent=function(){this.indent_level>0&&this.indent_level--}},this}var a,_,o,u,p,l,c,d,g,f,b,w,m,y,T,k,v,x,A,N,E,O,K,C,S,L,U,j,G,I,R,z,D,M;for(i=i||{},void 0!==i.wrap_line_length&&0!==parseInt(i.wrap_line_length,10)||void 0===i.max_char||0===parseInt(i.max_char,10)||(i.wrap_line_length=i.max_char),_=void 0===i.indent_inner_html?!1:i.indent_inner_html,o=void 0===i.indent_body_inner_html?!0:i.indent_body_inner_html,u=void 0===i.indent_head_inner_html?!0:i.indent_head_inner_html,p=void 0===i.indent_size?4:parseInt(i.indent_size,10),l=void 0===i.indent_char?" ":i.indent_char,d=void 0===i.brace_style?"collapse":i.brace_style,c=0===parseInt(i.wrap_line_length,10)?32786:parseInt(i.wrap_line_length||250,10),g=i.unformatted||["a","abbr","area","audio","b","bdi","bdo","br","button","canvas","cite","code","data","datalist","del","dfn","em","embed","i","iframe","img","input","ins","kbd","keygen","label","map","mark","math","meter","noscript","object","output","progress","q","ruby","s","samp","select","small","span","strong","sub","sup","svg","template","textarea","time","u","var","video","wbr","text","acronym","address","big","dt","ins","small","strike","tt","pre"],f=void 0===i.preserve_newlines?!0:i.preserve_newlines,b=f?isNaN(parseInt(i.max_preserve_newlines,10))?32786:parseInt(i.max_preserve_newlines,10):0,w=void 0===i.indent_handlebars?!1:i.indent_handlebars,m=void 0===i.wrap_attributes?"auto":i.wrap_attributes,y=isNaN(parseInt(i.wrap_attributes_indent_size,10))?p:parseInt(i.wrap_attributes_indent_size,10),T="force"===m.substr(0,5),k=void 0===i.end_with_newline?!1:i.end_with_newline,v="object"==typeof i.extra_liners&&i.extra_liners?i.extra_liners.concat():"string"==typeof i.extra_liners?i.extra_liners.split(","):"head,body,/html".split(","),x=i.eol?i.eol:"\n",i.indent_with_tabs&&(l="	",p=1),x=x.replace(/\\r/,"\r").replace(/\\n/,"\n"),a=new h,a.printer(n,l,p,c,d);;){if(A=a.get_token(),a.token_text=A[0],a.token_type=A[1],"TK_EOF"===a.token_type)break;switch(a.token_type){case"TK_TAG_START":a.print_newline(!1,a.output),a.print_token(a.token_text),a.indent_content&&(!a.indent_body_inner_html&&a.token_text.match(/<body(?:.*)>/)||!a.indent_head_inner_html&&a.token_text.match(/<head(?:.*)>/)||a.indent(),a.indent_content=!1),a.current_mode="CONTENT";break;case"TK_TAG_STYLE":case"TK_TAG_SCRIPT":a.print_newline(!1,a.output),a.print_token(a.token_text),a.current_mode="CONTENT";break;case"TK_TAG_END":"TK_CONTENT"===a.last_token&&""===a.last_text&&(N=(a.token_text.match(/\w+/)||[])[0],E=null,a.output.length&&(E=a.output[a.output.length-1].match(/(?:<|{{#)\s*(\w+)/)),(null===E||E[1]!==N&&!a.Utils.in_array(E[1],g))&&a.print_newline(!1,a.output)),a.print_token(a.token_text),a.current_mode="CONTENT";break;case"TK_TAG_SINGLE":O=a.token_text.match(/^\s*<([a-z-]+)/i),O&&a.Utils.in_array(O[1],g)||a.print_newline(!1,a.output),a.print_token(a.token_text),a.current_mode="CONTENT";break;case"TK_TAG_HANDLEBARS_ELSE":for(K=!1,C=a.output.length-1;C>=0&&"\n"!==a.output[C];C--)if(a.output[C].match(/{{#if/)){K=!0;break}K||a.print_newline(!1,a.output),a.print_token(a.token_text),a.indent_content&&(a.indent(),a.indent_content=!1),a.current_mode="CONTENT";break;case"TK_TAG_HANDLEBARS_COMMENT":a.print_token(a.token_text),a.current_mode="TAG";break;case"TK_CONTENT":a.print_token(a.token_text),a.current_mode="TAG";break;case"TK_STYLE":case"TK_SCRIPT":""!==a.token_text&&(a.print_newline(!1,a.output),S=a.token_text,U=1,"TK_SCRIPT"===a.token_type?L="function"==typeof s&&s:"TK_STYLE"===a.token_type&&(L="function"==typeof r&&r),"keep"===i.indent_scripts?U=0:"separate"===i.indent_scripts&&(U=-a.indent_level),j=a.get_full_indent(U),L?(G=function(){this.eol="\n"},G.prototype=i,I=new G,S=L(S.replace(/^\s*/,j),I)):(R=S.match(/^\s*/)[0],z=R.match(/[^\n\r]*$/)[0].split(a.indent_string).length-1,D=a.get_full_indent(U-z),S=S.replace(/^\s*/,j).replace(/\r\n|\r|\n/g,"\n"+D).replace(/\s+$/,"")),S&&(a.print_token_raw(S),a.print_newline(!0,a.output))),a.current_mode="TAG";break;default:""!==a.token_text&&a.print_token(a.token_text)}a.last_token=a.token_type,a.last_text=a.token_text}return M=a.output.join("").replace(/[\r\n\t ]+$/,""),k&&(M+="\n"),"\n"!==x&&(M=M.replace(/[\n]/g,x)),M}var i,s;"function"==typeof define&&define.amd?define(["require","./beautify","./beautify-css"],function(t){var e=t("./beautify"),i=t("./beautify-css");return{html_beautify:function(t,s){return n(t,s,e.js_beautify,i.css_beautify)}}}):"undefined"!=typeof exports?(i=require("./beautify.js"),s=require("./beautify-css.js"),exports.html_beautify=function(t,e){return n(t,e,i.js_beautify,s.css_beautify)}):"undefined"!=typeof window?window.html_beautify=function(t,e){return n(t,e,window.js_beautify,window.css_beautify)}:"undefined"!=typeof global&&(global.html_beautify=function(t,e){return n(t,e,global.js_beautify,global.css_beautify)})}();



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
    return html_beautify(text, {
		indent_inner_html: true,
		indent_size: 2,
		indent_char: ' ',
		indent_scripts: 'separate',
		wrap_line_length: 0,
		preserve_newlines: false,
		extra_liners: []
	});
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