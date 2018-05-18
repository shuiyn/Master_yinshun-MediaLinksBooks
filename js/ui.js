 /*
$(document).ready(function() {

$(body).click(function(event){
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var nDrop=0; nDrop < dropdowns.length; nDrop++) {
			var openDropdown = dropdowns[nDrop];
     	if (event.target != theBook.currDropBtn || theBook.currDropDown != openDropdown) {
	      if (openDropdown.classList.contains('dropdownShow')) {
	        openDropdown.classList.remove('dropdownShow');
	      }
    	}
   }

});

});
*/


window.onclick=function(event) {
	// click menutree listItem img
//	if (event.target.matches(".__mnu_LI")) {
//		return;
//	}
//console.log(event.target.tagName);
//HTMLCollection 不能用 for (i in lst)
 /*
	var lstMnu = document.getElementsByClassName("menutree");
	for (var i=0; i<lstMnu.length; i++) {
		if (lstMnu[i].contains(event.target)) {
			// click on menutree li/li img/ul
			if (event.target.nodeName != "SPAN")
				return;
			
			break;
		}
	}
$("span").parents(".demo")	*/
	/*
	var bMnuTreeNonHref = false;
	//each(f(i, el)) => index, element
	$(".menutree").each(function(i,el){
		if (el.contains(event.target)) {
			// click on menutree li/li img/ul
			bMnuTreeNonHref = (event.target.nodeName != "SPAN");
			return; // 不可用 break
		}
	});
	
	if (bMnuTreeNonHref)
		return;*/
		/*
		//定位立現：page、chapter、section…
	if ($(event.target).parents("#esyPool").get(0) != undefined)
		alert("no");
		*/
		
	$(".dropdown-content").each(function(i,el){
   	if (event.target != theBook.currDropBtn || theBook.currDropDown != el) {
      if (el.classList.contains('dropdownShow')) {
        el.classList.remove('dropdownShow');
      }
  	}
	});

}



var fillDropdown=function(bCM, aItem) {
	var id = "#" + (bCM ? "dpdnChapterCm" : "dpdnChapterAux");
	
	$(id).empty();

	var nWidth = 0;
	
	for (var i=0; i < aItem.length; i++) {
//		var h = "<p><a>" + aItem[i] + "</a></p>";
		var h = "<a>" + aItem[i] + "</a>";
		
  	if (bCM)
			$(h).appendTo(id).attr("onclick", 'openEssay(true,theBook.cm["' + aItem[i]+ '"])');
		else
			$(h).appendTo(id).attr("onclick", 'openEssay(false,theBook.aux["' + aItem[i]+ '"])');
		
		var nWid = $("#try").html("<a>" + aItem[i] + "</a>").innerWidth();
  	nWidth = Math.max(nWidth, nWid);
	}
	
	nWidth += 36;
  nWidth = Math.min(nWidth, window.innerWidth-32);
	$(id).width(nWidth);
}
	
	/*
var fillDropdown_Old=function(bCM, aItem) {
	var ctl = (bCM ? theBook.dpdnChapterCm : theBook.dpdnChapterAux);
	
	while (ctl.length > 0) ctl.remove(0);

	var nWidth = 0;
	
	for (var i=0; i < aItem.length; i++) {
  	var ndPara = document.createElement("P");
  	var nd = document.createElement("A");
  	var tnd = document.createTextNode(aItem[i]); 
  	ndPara.appendChild(nd);
  	nd.appendChild(tnd);
  	ctl.appendChild(ndPara);
  	
  	if (bCM)
		 	nd.setAttribute("onclick", 'openEssay(true,theBook.cm["' + aItem[i]+ '"])');
		else
		 	nd.setAttribute("onclick", 'openEssay(false,theBook.aux["' + aItem[i]+ '"])');
		
  	nWidth = Math.max(nWidth, aItem[i].length);
	}
	
	//+16 = padding
  nWidth = Math.min(nWidth*16+16, window.innerWidth-32);
//  console.log(nWidth);
	ctl.style.width = nWidth + "px";
//	ctl.style.width = (nWidth*16+16) + "px";
}
	*/
	



//章、目次選單、進度
function tglDropDown(btn, nKind) {
	theBook.currDropBtn = btn;
	if (nKind == 1) { //章
		theBook.currDropDown = (theBook.mbReadCm ? theBook.dpdnChapterCm : theBook.dpdnChapterAux);
	} else if (nKind == 2) { //進度
		theBook.currDropDown = theBook.dpdnProcess;
	} else if (nKind == 3) { //目次選單
		if (theBook.mbReadCm)
			theBook.currDropDown = theBook.dpdnMenuCm;
		else
			theBook.currDropDown = theBook.dpdnMenuAux;
	}
	
	theBook.currDropDown.classList.toggle("dropdownShow");
}


var TryScroll=function(ev) {
	if (theBook.mbJumpAnchor) {
		window.scrollTo(0, 0);
		theBook.mbJumpAnchor = false;
	}
}


//調整 文章區 字型大小
function rstContHandFontSize(sType){
	var ps = parseInt(theBook.fontSizePan.innerHTML);
	
	if (sType == "+") ps += 4;
	else ps -= 4;
	
	theBook.fontSizePan.innerHTML = ps;
	theBook.ctlShowYin.style.fontSize = ps+"%";
	theBook.ctlShowAux.style.fontSize = ps+"%";
}


//重設文章、講義顯示區的高度
function fitDevice() {
	if (mbIsPC) {
//		document.getElementById("tit_booklecName").style.fontSize = "110%";
		theBook.ctlShowYin.style.fontSize = "100%";
		theBook.ctlShowAux.style.fontSize = "100%";
		theBook.fontSizePan.innerHTML = "100";
		
//		theBook.dpdnMenuCm.style.left = "-4em";
		theBook.dpdnMenuCm.style.width = "26em";
		theBook.dpdnMenuAux.style.width = "26em";
		theBook.dpdnChapterCm.style.width = "26em";
		theBook.dpdnChapterAux.style.width = "26em";

		document.getElementById("palyStartH").style.width = "1.7em";
		document.getElementById("palyStartM").style.width = "2.2em";
		document.getElementById("palyStartS").style.width = "2.2em";
		
	}
}


function rstPosition() {
	var wInnerH = window.innerHeight;
	var nTop = theBook.essayPool.offsetTop;

	var nDiffH = (wInnerH - nTop - 10);

	theBook.essayPool.style.height = (nDiffH-10) + "px";
	
//document.getElementById("try").innerHTML = wInnerH + ", t=" + nTop + ", h= " + nDiffH;

	theBook.ctlShowYin.style.height = (nDiffH-10) + "px";
	theBook.ctlShowAux.style.height = (nDiffH-10) + "px";
	
	$(".__pageNumHrDiv").width($(".essay").innerWidth()-20);
}


//當下文章顯示者
function currEssayer() {
	return (theBook.mbReadCm ? theBook.ctlShowYin : theBook.ctlShowAux);
}

//openEssay 呼叫時會傳入參數
function doToggleBR(dv){
	if (!dv)
		dv = currEssayer();
	
	$("#" + dv.id + " .falseBR").toggle();
}

function toggleTocBold(){
	$("#" + currEssayer().id + " .tocTitle").toggleClass("Bolder");
}

function togglePageNum(dv) {
	$("#" + currEssayer().id + " .__pageNumHrDiv").toggle();
}

function toggleFullBookScreen(dv){
	$(" .audioGroup").toggle();
	rstPosition();
}

function toggleNA(dv){
	var sName = (mbIsPC ? "notearea" :"notearea_m");
	$("#" + currEssayer().id + " ." + sName).toggle();
}


//重疊 table 切換顯示
function doToggle(btn, aInner, aTbl, aOwner, aDvText) {
	var tbl_0,tbl_1;

	if (aTbl) {
		tbl_0 = document.getElementById(aTbl[0]);
		tbl_1 = document.getElementById(aTbl[1]);
	}
	
	if (btn.innerHTML == aInner[0]) {
		btn.innerHTML = aInner[1];
		if (aOwner) {
			document.getElementById(aOwner[0]).removeChild(btn);
			document.getElementById(aOwner[1]).appendChild(btn);
		}

		if (aTbl) {
			tbl_0.style.visibility = "collapse";
			tbl_1.style.visibility = "visible";
		}

		if (aDvText) {
			for (var i = 0;i < aDvText.length; i+=2) {
				if (aDvText[i])
					document.getElementById(aDvText[i]).style.display = "none";
				if (aDvText[i+1])
					document.getElementById(aDvText[i+1]).style.display = "block";
			}
		}
	} else {
		btn.innerHTML = aInner[0];
		if (aOwner) {
			document.getElementById(aOwner[1]).removeChild(btn);
			document.getElementById(aOwner[0]).appendChild(btn);
		}

		if (aTbl) {
			tbl_0.style.visibility = "visible";
			tbl_1.style.visibility = "collapse";
		}

		if (aDvText) {
			for (var i = 0;i < aDvText.length; i+=2) {
				if (aDvText[i+1])
					document.getElementById(aDvText[i+1]).style.display = "none";
				if (aDvText[i])
					document.getElementById(aDvText[i]).style.display = "block";
			}
		}
	}
}


function toggleHandout(btn){
  doToggle(btn, ["期別", "講義"], ["tblShowPhrase", "tblShowHandout"], ["tdPhrase", "tdHandout"]);
}


function toggleAux(btn){
	doToggle(btn, ["課", "輔"], null, null,["content", "auxPanel", "pageList", "pageList_hand"]);
	
	theBook.mbReadCm = (btn.innerHTML == "課");
	
	theBook.mnuCm.style.display = (theBook.mbReadCm ? "block" : "none");
	theBook.mnuAux.style.display = (theBook.mbReadCm ? "none" : "block");
}




function createEssayMenu(aTocItem, mnu) {
	var sPath = hostImgURL();
	var jqRtUL = $("#" + mnu.id);
	jqRtUL.empty();

	var jqUL;
	
	for (var i=0; i < aTocItem.length; i++) {
		var jqLi = $("<li></li>");
		var nOffset = -1;

		if (aTocItem[i].lev == 0) {
    	jqUL = jqRtUL;
			nOffset = -1;
		}
		else
			nOffset = (aTocItem[i-1].lev - aTocItem[i].lev);
		
		if (nOffset < -1) {
			throw "Err of Toc.level: prev= " + aTocItem[i-1].lev + ", curr= " + aTocItem[i].lev;
		}
			
  	if (i==aTocItem.length-1 || aTocItem[i+1].lev <= aTocItem[i].lev) {
    	jqLi.css("listStyleImage", 'none');
  	} else
    	jqLi.css("listStyleImage", 'url("' + sPath + 'open_brk.png")');

//	var jqHref = $("<span></span>").text(aTocItem[i].c).attr("id", "A_" + aTocItem[i].a);
    jqLi.append($("<span></span>").text(aTocItem[i].c).attr("id", "A_" + aTocItem[i].a));
		
		if (nOffset == 0) {
			jqUL.append(jqLi);

			if (i<aTocItem.length-1 && aTocItem[i+1].lev > aTocItem[i].lev) {
	  		jqUL = $("<ul></ul>");;
				jqLi.append(jqUL);
			}
		} else if (nOffset < 0){
			jqUL.append(jqLi);
			if (i<aTocItem.length-1 && aTocItem[i+1].lev > aTocItem[i].lev) {
	  		jqUL = $("<ul></ul>");;
				jqLi.append(jqUL);
			}
		} else {
			for (j=0; j<nOffset; j++) {
				jqUL = jqUL.parent().parent();
//✖		jqUL = jqUL.closest("ul").closest("ul");
			}
				
			jqUL.append(jqLi);
			
			if (i<aTocItem.length-1 && aTocItem[i+1].lev > aTocItem[i].lev) {
	  		jqUL = $("<ul></ul>");;
				jqLi.append(jqUL);
			}
		}
	}
}


