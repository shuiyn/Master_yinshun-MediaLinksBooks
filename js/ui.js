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


//◆ 彈出式選單必與 invoke button 同屬一個 parentNode
window.onclick=function(event) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var nDrop=0; nDrop < dropdowns.length; nDrop++) {
			var openDropdown = dropdowns[nDrop];

//    	if (event.target.parentNode != openDropdown.parentNode) {
//	      if (openDropdown.classList.contains('dropdownShow')) {
//	        openDropdown.classList.remove('dropdownShow');
//	      }
//    	}
 
     	if (event.target != theBook.currDropBtn || theBook.currDropDown != openDropdown) {
	      if (openDropdown.classList.contains('dropdownShow')) {
	        openDropdown.classList.remove('dropdownShow');
	      }
    	}
   }
}



var fillDropdown=function(bCM, aItem) {
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
		document.getElementById("tit_booklecName").style.fontSize = "110%";
		theBook.ctlShowYin.style.fontSize = "110%";
		theBook.ctlShowAux.style.fontSize = "110%";
		theBook.fontSizePan.innerHTML = "110";
		
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

}


//文章顯示 切換
function bookToggle(clsNameEle, clsNameTog, dv){
	dv = dv || theBook.ctlShowYin;
	var a = dv.getElementsByClassName(clsNameEle);
	for(var i=0; i < a.length; i++) a[i].classList.toggle(clsNameTog);
}


//openEssay 呼叫時會傳入參數
function doToggleBR(dv){
	if (!dv)
		dv = (theBook.mbReadCm ? theBook.ctlShowYin : theBook.ctlShowAux);
		
	bookToggle("falseBR", "Hider", dv);
}


function toggleTocBold(){
	var dv = (theBook.mbReadCm ? theBook.ctlShowYin : theBook.ctlShowAux);
	bookToggle("tocTitle", "Bolder", dv);
}

function togglePageNum(dv) {
	var dv = (theBook.mbReadCm ? theBook.ctlShowYin : theBook.ctlShowAux);
	bookToggle("__pageNumHrDiv", "Hider", dv);
}

function toggleFullBookScreen(dv){
	bookToggle("audioGroup", "Hider", document.body);
	rstPosition();
}


function toggleNA(dv){
	var dv = (theBook.mbReadCm ? theBook.ctlShowYin : theBook.ctlShowAux);
	var sName = (mbIsPC ? "notearea" :"notearea_m");
	bookToggle(sName, "Hider", dv);
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

