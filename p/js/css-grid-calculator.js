/* CSS Grid Calculator by Taufik Nurrohman => https://plus.google.com/108949996304093815163/about */
(function() {

	function elem(a) {
		return document.getElementById(a);
	}

	var gap = elem('input-gap'),
		cols = elem('input-cols'),
		result = elem('result-grid'),
		asym = elem('asymetric'),
		asygap = elem('asym-gap'),
		grid_1 = elem('grid-area-1'),
		grid_2 = elem('grid-area-2'),
		grid_3 = elem('grid-area-3'),
		grid_css_1 = elem('grid-css-1'),
		grid_css_2 = elem('grid-css-2'),
		grid_markup_1 = elem('grid-markup-1'),
		grid_markup_2 = elem('grid-markup-2');

	function makeGrid() {
		var rumus = (100 - (gap.value * (cols.value - 1))) / cols.value; // (100 - (gap * (kolom - 1))) / kolom + '%';
		result.innerHTML = rumus;
		grid_1.innerHTML = "";
		grid_2.innerHTML = "";
		for (var j = 0; j < cols.value; j++) {
			if (cols.value < 50) { // Safe...
				grid_1.innerHTML += '<div style="width:'+rumus+'%;margin:0 0 0 '+gap.value+'%;height:120px;"><div style="padding:5px 6px;">'+rumus+'%</div></div>';
				grid_2.innerHTML = '<div style="width:'+(100-rumus-gap.value)+'%;margin:0 0 0 0;height:120px;"><div style="padding:5px 6px;">'+(100-rumus-gap.value)+'%</div></div><div style="width:'+rumus+'%;margin:0 0 0 '+gap.value+'%;height:120px;"><div style="padding:5px 6px;">'+rumus+'%</div></div>';
			}
		}
		grid_1.getElementsByTagName('div')[0].style.marginLeft = 0; // Safe...
		grid_css_1.innerHTML = '<code contenteditable>.sample-grid {\n  width:auto;\n  overflow:hidden;\n  margin:0 auto;\n}\n\n.sample-grid .custom-grid-'+cols.value+' {\n  width:'+rumus+'%;\n  margin:0 0 1.5em '+gap.value+'%;\n  float:left;\n  display:inline;\n  overflow:hidden;\n  word-wrap:break-word;\n  min-height:1px;\n}\n\n.sample-grid .custom-grid-'+cols.value+':first-child {margin-left:0}\n\n@media (max-width:767px) {\n  .sample-grid .custom-grid-'+cols.value+' {\n    float:none;\n    display:block;\n    width:auto;\n    margin:0 0 1.5em 0;\n  }\n}</code>';
		var skeleton = "";
		skeleton = '<code contenteditable>&lt;div class="sample-grid"&gt;\n    ';
		for (var k = 0; k < cols.value; k++) {
			skeleton += (k == cols.value-1) ? '&lt;div class="custom-grid-'+cols.value+'"&gt; ... &lt;/div&gt;\n' : '&lt;div class="custom-grid-'+cols.value+'"&gt; ... &lt;/div&gt;\n    ';
		}
		skeleton += '&lt;/div&gt;</code>';
		grid_markup_1.innerHTML = skeleton;
	} makeGrid();

	var number = 0;

	function calculateGrid() {
		number++;
		var rumus = 100 - asym.value - asygap.value;
		grid_3.innerHTML = '<div style="width:'+rumus+'%;margin:0 0 0 0;height:120px;"><div style="padding:5px 6px;background:none;">'+rumus+'%</div></div><div style="width:'+asym.value+'%;margin:0 0 0 '+asygap.value+'%;height:120px;background-color:#742708;"><div style="padding:5px 6px;background:none;">'+asym.value+'%</div></div>';
		grid_css_2.innerHTML = '<code contenteditable>.sample-grid-'+number+' {\n  width:auto;\n  overflow:hidden;\n  margin:0 auto;\n}\n\n.sample-grid-'+number+' .left-grid,\n.sample-grid-'+number+' .right-grid {\n  margin:0 0 1.5em '+asygap.value+'%;\n  float:left;\n  display:inline;\n  overflow:hidden;\n  word-wrap:break-word;\n  min-height:1px;\n}\n\n.sample-grid-'+number+' .left-grid {width:'+rumus+'%}\n.sample-grid-'+number+' .right-grid {width:'+asym.value+'%}\n\n.sample-grid-'+number+' .left-grid:first-child,\n.sample-grid-'+number+' .right-grid:first-child {margin-left:0}\n\n@media (max-width:767px) {\n  .sample-grid-'+number+' .left-grid,\n  .sample-grid-'+number+' .right-grid {\n    float:none;\n    display:block;\n    width:auto;\n    margin:0 0 1.5em 0;\n  }\n}</code>';
		grid_markup_2.innerHTML = '<code contenteditable>&lt;div class="sample-grid-'+number+'"&gt;\n    &lt;div class="left-grid"&gt; ... &lt;/div&gt;\n    &lt;div class="right-grid"&gt; ... &lt;/div&gt;\n&lt;/div&gt;</code>';
	} calculateGrid();

	gap.onkeyup = makeGrid;
	cols.onkeyup = makeGrid;
	asym.onkeyup = calculateGrid;
	asygap.onkeyup = calculateGrid;

})();