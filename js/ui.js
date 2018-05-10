

//章、目、進度
function tglDropDown(btn, nKind) {
	theBook.currDropBtn = btn;
	if (nKind == 1) { //章
		theBook.currDropDown = (theBook.mbReadCm ? theBook.dpdnChapterCm : theBook.dpdnChapterAux);
	} else if (nKind == 2) { //進度
		theBook.currDropDown = theBook.dpdnProcess;
	}
	
	theBook.currDropDown.classList.toggle("dropdownShow");
}


//◆ 彈出式選單必與 invoke button 同屬一個 parentNode
window.onclick=function(event) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var nDrop=0; nDrop < dropdowns.length; nDrop++) {
			var openDropdown = dropdowns[nDrop];
			/*
    	if (event.target.parentNode != openDropdown.parentNode) {
	      if (openDropdown.classList.contains('dropdownShow')) {
	        openDropdown.classList.remove('dropdownShow');
	      }
    	}
    	*/
     	if (event.target != theBook.currDropBtn || theBook.currDropDown != openDropdown) {
	      if (openDropdown.classList.contains('dropdownShow')) {
	        openDropdown.classList.remove('dropdownShow');
	      }
    	}
   }
}


var TryScroll=function(ev) {
	if (theBook.mbJumpAnchor) {
		window.scrollTo(0, 0);
		theBook.mbJumpAnchor = false;
	}
}



//首次開啟 Menu 窗時，擷取相對位置，設妥高度後即卸載事件器
function dlgFocusIn(e) {
	var dlg = document.getElementById("dlgPageToc");
	var mnuRoot = document.getElementById("mnuRoot");
	mnuRoot.style.height = (dlg.offsetHeight - mnuRoot.offsetTop -20) + "px";

	dlg.removeEventListener("dlgFocusIn", dlgFocusIn);

}




var showPageTocSelect=function(btn){
	document.getElementById("dlgPageToc").showModal();
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

		document.getElementById("palyStartH").style.width = "1.7em";
		document.getElementById("palyStartM").style.width = "2.2em";
		document.getElementById("palyStartS").style.width = "2.2em";
		
		document.getElementById("dlgPageToc").style.width = "50%";
	}
	
}


function rstPosition() {
	var wInnerH = window.innerHeight;
	var nTop = document.getElementById("content").offsetTop;
//	document.getElementById("pnlEsyTool").style.top = (nTop-28) + "px";

	var nDiffH = (wInnerH - nTop - 10);
	
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
	
}

