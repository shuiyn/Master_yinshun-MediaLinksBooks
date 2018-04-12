
//function createMenu(bkId) {
function createMenu(aItem, sPath) {
	if (sPath) sPath += "./img/";
	else sPath = "./img/";
	
	var tocIdPfx = base_List.htmlIdPrefix.toc;
	
	var rtUL = document.getElementById("mnuRoot");
	
	while (rtUL.childNodes.length > 0){
		rtUL.removeChild(rtUL.childNodes[0]);
	}

//	var aItem = book_List[bkId]; //"jkjjj"];
	var aIdx = [];
	var nHrefIndex = 0;
	
	aItem.map(function(m, idx){
		if (m.lev) {
			if (!m.a) m.a = nHrefIndex;
			aIdx.push({"idx":idx, "lev":Number(m.lev)});
			nHrefIndex++;
		}
	});
	
//	var rtUL = document.getElementById(rootId);
	var ndUL;
	
	for (var i=0; i < aIdx.length; i++) {
	    var textnode = document.createTextNode(aItem[aIdx[i].idx].c);
	    var ndAnchor = document.createElement("A");
//	    var ndSpan = document.createElement("SPAN");
	    var nd = document.createElement("LI");
		var nOffset = -1;

	    ndAnchor.appendChild(textnode);
	    ndAnchor.setAttribute("href", "#" + tocIdPfx + i);
//	    ndSpan.appendChild(textnode);

		if (aIdx[i].lev == 0) {
    		ndUL = rtUL;
			nOffset = -1;
		}
		else
			nOffset = (aIdx[i-1].lev - aIdx[i].lev);
		
		if (nOffset < -1) {
			alert("Toc.level 錯誤；請檢視 console.log。");
			console.log("Err of Toc.level: prev= ",aIdx[i-1].lev,", curr= ", aIdx[i].lev);
		}
			
    	if (i==aIdx.length-1 || aIdx[i+1].lev <= aIdx[i].lev) {
	    	nd.style.listStyleImage = 'none';
    	} else
	    	nd.style.listStyleImage = 'url("' + sPath + 'open_brk.png")';

	    nd.appendChild(ndAnchor);
//	    nd.appendChild(ndSpan);
		
		if (nOffset == 0) {
			ndUL.appendChild(nd);

			if (i<aIdx.length-1 && aIdx[i+1].lev > aIdx[i].lev) {
	    		ndUL = document.createElement("UL");
				nd.appendChild(ndUL);
			}
		} else if (nOffset < 0){
			ndUL.appendChild(nd);
			if (i<aIdx.length-1 && aIdx[i+1].lev > aIdx[i].lev) {
	    		ndUL = document.createElement("UL");
				nd.appendChild(ndUL);
			}
		} else {
			for (j=0; j<nOffset; j++) {
				ndUL = ndUL.parentNode.parentNode;
			}
				
			ndUL.appendChild(nd);
			
			if (i<aIdx.length-1 && aIdx[i+1].lev > aIdx[i].lev) {
	    		ndUL = document.createElement("UL");
				nd.appendChild(ndUL);
			}
		}
	}
	
//console.log("end");
//	return aIdx;
}


function onMenuClicked(ev, sPath) {
	if (sPath) sPath += "./img/";
	else sPath = "./img/";

	var eTrigger = ev.target;
//	document.getElementById("demo").innerHTML = eTrigger.nodeName

	if (eTrigger.nodeName == "A") {
//		document.all.dlgMenuTree.close();
	document.getElementById("dlgPagToc").close();
//		window.scrollTo(0, 0);
		//skip to html#id
	}
	
		//eTrigger.children.length > 1 沒有子 ul 者，只有 textnode/span 1 個 
	if (eTrigger.nodeName == "LI" && eTrigger.children.length>1) {
		var url = eTrigger.style.listStyleImage;
		var bOpened = url.includes("open");
		var disp = (bOpened ? "none" : "block");
		
		eTrigger.style.listStyleImage = 'url("' + sPath + (bOpened ? "close_brk.png" : "open_brk.png") + '")';

		for (var i=0; i<eTrigger.children.length; i++) {
			if (eTrigger.children[i].nodeName == "UL") {
				eTrigger.children[i].style.display = disp;
				break;
			}
		}
	}
	
	/*
	var sShow = "";
	if (eTrigger.nodeName == "SPAN")
		sShow = "skip to content";
	else {
		sShow = "open child" + eTrigger.nodeName;
		
		if (eTrigger.nodeName == "LI") {
		var pn = eTrigger.style.listStyleImage;
		sShow += pn;
		pn = (pn.includes("open_brk.png")? "close_brk.png" :"open_brk.png");
	    eTrigger.style.listStyleImage = 'url("' + pn + '")';
}
	}
		
	document.getElementById("demo").innerHTML = sShow;*/
	
//	document.getElementById("demo").innerHTML = tt.nodeName + ", " + tt.childElementCount + tt.parentNode;
	//alert(event.target.nodeName);
//	alert("this.childElementCount");
}



 /* 正確的原 使用字串填籤函式，存備
function onLoad() {
	var aItem = grabMenuData()
	var rtUL = document.getElementById("mnuRoot");
	var sMenu = "<li><span>" + aItem[0].t + "</span>"; // h ???
	
	for (var i=1; i<aItem.length; i++) {
		var miCurr = aItem[i];
		var miPrev = aItem[i-1];
		var nOffset = (miPrev.n - miCurr.n);
		
		if (nOffset == 0) {
			sMenu += "</li><li><span>" + miCurr.t + "</span>";
		} else if (nOffset < 0){
			sMenu += "<ul><li><span>" + miCurr.t + "</span>";
		} else {
				sMenu += "</li>";
			for (j=0; j<nOffset; j++) {
				sMenu += "</ul></li>";
			
			}
			sMenu += "<li><span>" + miCurr.t + "</span>";
		}
	}
	
	sMenu += "</li>";
	
	document.getElementById("demo").innerText = sMenu;
	rtUL.innerHTML = sMenu;
	//	document.getElementById("demo").innerHTML = JSON.stringify(aItem,"","<br/>");
}
*/

