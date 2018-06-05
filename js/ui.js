
var uaNotPC=function() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

//img 網站資料夾的路徑，供 menuTree 使用
var hostImgURL=function(fdn) {
	var sImgPath = location.pathname;
	fdn = fdn || "img";
	return ".".repeat(sImgPath.substr(sImgPath.lastIndexOf("Books/")).split("/").length-1) + "/" + fdn + "/";
}


var onImageLoaded=function(el) {
		var wInnerW = window.innerWidth;
		var nWid = el.attr("data-widthOfCharCount")*16;
		if (nWid > wInnerW)
			nWid = wInnerW;

		var nHei = Math.floor(nWid * (el.prop("naturalHeight") / el.prop("naturalWidth")));
		
		el.attr({"width":nWid, "height":nHei});
//		console.log(el.attr("data-widthOfCharCount"), nWid, nHei);
}


/*功能：
	1 點擊文章區後的「頁次定位」
	2 點擊文區註序時，如註區隱藏時，開顯之
*/
var onEssayerClicked=function(event) {
	var et = $(event.target);

	if (et.is("[href^='#ntd_']")) {
		if ($("#" + currEssayer(true) + " .notearea").css("display")=="none")
			$("#" + currEssayer(true) + " .notearea").toggle();
	}
		
	var res = upFindPg(et, event);
	
	if (res) {
		$("#pageList" + fetchEssayerIdTail()).val(res.attr("id").split("_")[1].substr(1));
	}
}


var upFindPg=function(jBgn, ev) {
		if (jBgn.attr("class") == "essay")
		return;
	
	var doFindPg=function(jq) {
		var pns = jq.find("span[id^='Pg_']");
		if (pns.length > 0)
			return pns.last();
	}
	
	var jpnFound = null;
	//外部呼叫時傳入的 event
	if (ev) {
		if (jBgn.is(".__pageNumHrDiv"))
			return jBgn.prev();
		else if (jBgn.is(".__pageNumInDiv"))
			return jBgn.parent().prev();

		jpnFound = doFindPg(jBgn);
		if (jpnFound && ev.clientY > jpnFound.next().offset().top) {
			return jpnFound;
		}
	}
	
	jBgn.prevAll().each(function() {
		jpnFound = doFindPg($(this));
		if (jpnFound)
			return false;
	});
	
	if (!jpnFound)
		return upFindPg(jBgn.parent())
	else
		return jpnFound;
}


var sJustTemp = "";

function funnyOnKeyPressed(event) {
	var sTmp = grabIdPrefix("funny");
	
	if (sJustTemp == sTmp) {
		$(".forMySelf").toggle();
		alert(sJustTemp);
		
		window.removeEventListener("keypress", funnyOnKeyPressed);
		sJustTemp = "";
	} else {
		var v = String.fromCharCode(event.keyCode);

//		document.getElementById("show").innerHTML = v;
		if (!sJustTemp) {
			if (v == sTmp.substr(0, 1))
				sJustTemp = v;
		} else {
			var nCurrLen = sJustTemp.length + 1;
			
			if (sTmp.substr(0, nCurrLen) == sJustTemp + v) {
				sJustTemp += v;
//				document.getElementById("show").innerHTML = sJustTemp;
			}
			else
				sJustTemp = "";
		}
	}
}

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
	
	//JSON 未依排序列出
	aItem.sort(function(a,b) {
		return (a[0] > b[0] ? 1 : -1);
	});
	
	for (var i=0; i < aItem.length; i++) {
//		var h = "<p><a>" + aItem[i] + "</a></p>";
		var h = "<a>" + aItem[i][1] + "</a>";
		
  	if (bCM)
			$(h).appendTo(id).attr("onclick", 'openEssay(true,theBook.cm["' + aItem[i][0]+ '"],"' + aItem[i][0] + '", true)');
		else
			$(h).appendTo(id).attr("onclick", 'openEssay(false,theBook.aux["' + aItem[i][0]+ '"],"' + aItem[i][0] + '", true)');
		
		var nWid = $("#try").html("<a>" + aItem[i][1] + "</a>").innerWidth();
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
		theBook.currDropDown = document.getElementById("dpdnCmChapterPool");
	} else if (nKind == 11) { //課堂教材
		theBook.currDropDown = document.getElementById("dpdnChapterCm");
	} else if (nKind == 12) { //補充講義
		theBook.currDropDown = document.getElementById("dpdnChapterAux");
	} else if (nKind == 2) { //進度
		theBook.currDropDown = theBook.dpdnProcess;
	} else if (nKind == 21) { //cue
		theBook.currDropDown = document.getElementById("dropdnCue");
	} else if (nKind == 3) { //目次選單
		var idTail = fetchEssayerIdTail();
		theBook.currDropDown = document.getElementById("dpdnMenuCm" + idTail);
	} else if (nKind == 4) { //翻頁
		theBook.currDropDown = theBook.dpdnTurnPage;
	} else if (nKind == 5) { //chapter tabs
		theBook.currDropDown = theBook.dpdnChapterTabs;
	}
	
	theBook.currDropDown.classList.toggle("dropdownShow");
}


var TryScroll=function(ev) {
	if (theBook.mbJumpAnchor) {
		window.scrollTo(0, 0);
		theBook.mbJumpAnchor = false;
	}
}



var fillPageTurning=function() {
	$("#dpdnTurnPage").empty();
	
	$("<a>加入 這個位置</a>").appendTo("#dpdnTurnPage").attr("onclick", 'addTurning()');
	$("<a>設為原點</a>").appendTo("#dpdnTurnPage").attr("onclick", 'addTurning(true)');
	$("<hr>").appendTo("#dpdnTurnPage");
	$("<a>上 一個位置</a>").appendTo("#dpdnTurnPage").attr("onclick", 'pageTurning(true)');
	$("<a>下 一個位置</a>").appendTo("#dpdnTurnPage").attr("onclick", 'pageTurning(false)');
	$("<a>回原點</a>").appendTo("#dpdnTurnPage").attr("onclick", 'pageTurning(true, true)');
	$("<hr>").appendTo("#dpdnTurnPage");
	$("<a>移除 這個位置</a>").appendTo("#dpdnTurnPage").attr("onclick", 'rmvTurning()');
	$("<a>清空 所有位置</a>").appendTo("#dpdnTurnPage").attr("onclick", 'initPageTurning()');
	$("<hr>").appendTo("#dpdnTurnPage");
	$("<a>裝置</a>").appendTo("#dpdnTurnPage").attr("onclick", 'showScreen()');
	$("<a style='background-color: DodgerBlue; color:white'>全螢幕</a>").appendTo("#dpdnTurnPage").attr("onclick", 'toggleFullBookScreen()');
	
}


function initPageTurning() {
	theBook.maTurning = [];
	theBook.mnTurningIdx = -1;
}

function addTurning(bAsHome) {
	if (bAsHome) {
		theBook.maTurning.unshift({"id":currEssayer(true), "t":currEssayer().scrollTop});
		theBook.mnTurningIdx = 0;
	} else {
		theBook.maTurning.push({"id":currEssayer(true), "t":currEssayer().scrollTop});
		
		theBook.mnTurningIdx = theBook.maTurning.length-1;
	}
}

function rmvTurning() {
	for (var i=0; i < theBook.maTurning.length; i++) {
		var id = currEssayer(true);
		var nSctTop = currEssayer().scrollTop;
		if (theBook.maTurning[i].id == id && theBook.maTurning[i].t == nSctTop) {
			for (var j=i; j < theBook.maTurning.length-1; j++) {
				theBook.maTurning[j] = theBook.maTurning[j+1];
			}
			
			theBook.maTurning.pop();
			
			if (theBook.maTurning.length > 0)
				theBook.mnTurningIdx = 0;
			else
				theBook.mnTurningIdx = -1;
			
			break;
		}
	}
}

function pageTurning(bForward, bGoHome) {
	if (theBook.maTurning.length == 0)
		return;
	
	$(event.stopPropagation());
	
	if (bGoHome) {
		theBook.mnTurningIdx = 0;
	} else {
		if (bForward) {
			if (theBook.mnTurningIdx >= theBook.maTurning.length-1)
				theBook.mnTurningIdx = 0;
			else
				theBook.mnTurningIdx++;
		} else {
			if (theBook.mnTurningIdx <= 0)
				theBook.mnTurningIdx = theBook.maTurning.length-1;
			else
				theBook.mnTurningIdx--;
		}
	}
	
	showCM(theBook.maTurning[theBook.mnTurningIdx].id, true);
	currEssayer().scrollTop = theBook.maTurning[theBook.mnTurningIdx].t;
}


//調整 文章區 字型大小
function rstContHandFontSize(sType){
	var ps = parseInt(theBook.fontSizePan.innerHTML);
	
	if (sType == "+") ps += 4;
	else ps -= 4;
	
	theBook.fontSizePan.innerHTML = ps;
	$("#esyPool").children().css("fontSize", ps + "%");
}


//重設文章、講義顯示區的高度
function fitDevice() {
	if (mbIsPC) {
	$("#esyPool").children().css("fontSize", "100%");
		theBook.fontSizePan.innerHTML = "100";
		
		theBook.dpdnMenuCm.style.width = "26em";
		theBook.dpdnMenuAux.style.width = "26em";
		theBook.dpdnChapterCm.style.width = "26em";
		theBook.dpdnChapterAux.style.width = "26em";

		document.getElementById("palyStartH").style.width = "1.7em";
		document.getElementById("palyStartM").style.width = "2.2em";
		document.getElementById("palyStartS").style.width = "2.2em";
		
	} else {
		if (screen.width >= 800) {
			$("body").css("font-size", "150%");
		}
		if (screen.width < 470) {
			$("#dpdnTurnPage").css("right", 0);
		}
		if (screen.width < 600) {
			$("#dpdnChapterTabs").css("right", 0);
		}
	}
}


function rstPosition() {
	var wInnerH = window.innerHeight;
	var esyPool = 	$("#esyPool");
	var nTop = esyPool.prop("offsetTop");
	var nDiffH = (wInnerH - nTop - 12);

	esyPool.css("height", (nDiffH)).children().css("height", (nDiffH-2));
	
//	$(".__pageNumHrDiv").width($(".essay").width()-20);
}


//當下文章顯示者
function currEssayer(bGetId) {
	var id = $("#esyPool").attr("data-currEssayerId");
	if (bGetId)
		return id;
	else
		return document.getElementById(id);
}

//openEssay 呼叫時會傳入參數
function doToggleBR(){
	$("#esyerTitle" + fetchEssayerIdTail() + " .falseBR").toggle();
	$("#" + currEssayer(true) + " .falseBR").toggle();
}

function toggleTocBold(){
	$("#" + currEssayer(true) + " .tocTitle").toggleClass("Bolder");
}

function togglePageNum(dv) {
	$("#" + currEssayer(true) + " .__pageNumHrDiv").toggle();
}

function toggleFullBookScreen(dv){
	$(" .audioGroup").toggle();
	rstPosition();
}

function toggleNA(dv){
	var sName = (mbIsPC ? "notearea" :"notearea_m");
	$("#" + currEssayer(true) + " ." + sName).toggle();
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




function createEssayMenu(aTocItem, mnuId) {
	var sPath = hostImgURL();
	var jqRtUL = $("#" + mnuId); //mnu.id);
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



var fetchEssayerIdTail=function(id) {
	if (!id)
		id = currEssayer(true);
	
	var idTail = "";
	if (id.indexOf("_") > -1)
		idTail = id.slice(id.indexOf("_"));
	
	return idTail;
}


var showCM=function(id, bCheckExisting) {
//	$("#" + $("#esyPool").attr("data-currEssayerId")).hide();
	if (bCheckExisting && $("#esyPool").attr("data-currEssayerId") == id)
		return;
	
	$("#esyPool").children().hide();
	$("#esyPool").attr("data-currEssayerId",id);
	$("#" + id).show();

	$("#pageListPool").children().hide();
	var idTail = fetchEssayerIdTail(id);
	
	$("#pageList" + idTail).show();

	$("#esyTitlePool").children().hide();
	$("#pnlEsyerTitle" + idTail).show();

//	$("#cmMenuPool").children().hide();
//	$("#mnuRoot" + idTail).show();
}


//讀取書本的各「章」名稱，作為選單
var grabEssayChapter=function(jsEsy) {
	var aChapt = [];
	for (s in jsEsy) {
		aChapt.push(s);
	}
	
	return aChapt;
}


var closeEssay=function() {
	var idTail = fetchEssayerIdTail();
	
	$("#" + currEssayer(true)).remove();
	$("#dpdnMenuCm" + idTail).remove();
	$("#pageList" + idTail).remove();
	$("#ShowCmList" + idTail).remove();
	$("#pnlEsyerTitle" + idTail).remove();
	
	var esyPool = $("#esyPool");
	if (esyPool.children(".essay").length > 1) {
		showCM(esyPool.children(".essay:last").attr("id"));
	}
}


//將指定的「章」，填入展示的 divRoot
var openEssay=function(bCM, jsnChapter, idChapter, bImmOpen) {
	var jqChapTabs = $("#dpdnChapterTabs");
	
	if (bImmOpen) {
		var aOpened = jqChapTabs.children("a:contains(" + idChapter + ")");
		if (aOpened.length > 0) {
			if (!confirm("此章已開啟中：\n【取消】→開啟原檔\n【確定】→另開一個")) {
				eval(aOpened.attr("onclick")); //開啟第１個
				return;
			}
		}
	}
	
	var idDivRoot = "content";
	var idPageList = "pageList";
	var idCmMenu = "dpdnMenuCm";
	var idMenuRoot = "mnuRoot";
	var idShowCM = "ShowCmList";
	var idPnlEsyerTitle = "pnlEsyerTitle";
	var idEsyerTitle = "esyerTitle";
	var idTail = "";
	var esyTitlePool = $("#esyTitlePool");
	var esyPool = $("#esyPool");
	var cmMenuPool = $("#cmMenuPool");
	var pageListPool = $("#pageListPool");
	var nNextCount = esyPool.attr("data-nextCountId"); //避免關閉後再開而重複 id

	if (nNextCount == undefined)
		nNextCount = 0;

		idTail = "_" + nNextCount;
		idShowCM += idTail;
		idDivRoot += idTail;
		idPageList += idTail;
		idCmMenu += idTail;
		idMenuRoot += idTail;
		idPnlEsyerTitle += idTail;
		idEsyerTitle += idTail;
		
		esyPool.append( $('#content').clone().attr("id", idDivRoot));
		
		var pnlMnu = $('#dpdnMenuCm').clone().attr("id", idCmMenu);
		pnlMnu.children("ul:first").attr("id", idMenuRoot);
		cmMenuPool.append(pnlMnu);
		
		pageListPool.append( $('#pageList').clone().attr("id", idPageList));
		
//		esyPool.append( $('<div onscroll="TryScroll(event);" class="essay"></div>').attr("id", idDivRoot).css("height", esyPool.css("height")));


	esyPool.attr("data-currEssayerId", idDivRoot);
	esyPool.children().hide();
//	cmMenuPool.children(".dropdown-content").hide(); 不可 hide
	pageListPool.children().hide();
	
	esyTitlePool.append(addPnlEsyerTitle(idPnlEsyerTitle, idEsyerTitle).attr("data-chapId", idChapter));
	esyTitlePool.children().hide();

	jqChapTabs.append($("<a></a>").text(jsnChapter.listT).attr({"onclick":'showCM("' + idDivRoot + '")', "id":idShowCM}));

	var esy = new kEssay($("#" + idDivRoot), $("#" + idPageList), jsnChapter, idTail, idEsyerTitle);
	esy.transData();
	
	//創建於 kEssayJQ 中
//	$("#esyerTitle" + idTail).text(idChapter);
	
	createEssayMenu(esy.maToc, idMenuRoot);
	
	doToggleBR();
	$("#" + idDivRoot).css("scrollTop", 0);
	
	nNextCount++;
	esyPool.attr("data-nextCountId", nNextCount);
	
	if (bImmOpen)
		showCM(idDivRoot);
}


function addPnlEsyerTitle(sIdPnl, sIdTitle) {
	var jqChapTool = $("<div></div>").css({"width":"100%", "margin":0, "padding":0}).attr("id", sIdPnl);
	jqChapTool.append($("<div></div>").css({"position":"relative", "text-align":"center", "margin":0, "padding":0}).attr("id", sIdTitle));
//	.text("some")
	jqChapTool.append($("<div></div>").css({"position":"absolute", "top":"0", "right":"0"}).append($('<button onclick="closeEssay()" class="dropbtn">✖</button>')));
	
	return jqChapTool;
//	$("#esyTitlePool").append(jqChapTool);
}



function createCmMenu(aTocItem, mnu) {
	var sPath = hostImgURL();
	var rtUL = mnu;
	
	while (rtUL.childNodes.length > 0){
		rtUL.removeChild(rtUL.childNodes[0]);
	}

	var ndUL;
	
	for (var i=0; i < aTocItem.length; i++) {
	    var textnode = document.createTextNode(aTocItem[i].c);
//	    var ndAnchor = document.createElement("A");
	    var ndAnchor = document.createElement("SPAN");
//    var ndSpan = document.createElement("SPAN");
	    var nd = document.createElement("LI");
		var nOffset = -1;

	    ndAnchor.appendChild(textnode);
	    ndAnchor.setAttribute("id", "A_" + aTocItem[i].a);
//	    ndAnchor.setAttribute("href", "#" + aTocItem[i].a);

		if (aTocItem[i].lev == 0) {
    		ndUL = rtUL;
			nOffset = -1;
		}
		else
			nOffset = (aTocItem[i-1].lev - aTocItem[i].lev);
		
		if (nOffset < -1) {
			alert("Toc.level 錯誤；請檢視 console.log。");
			console.log("Err of Toc.level: prev= ",aTocItem[i-1].lev,", curr= ", aTocItem[i].lev);
		}
			
    	if (i==aTocItem.length-1 || aTocItem[i+1].lev <= aTocItem[i].lev) {
	    	nd.style.listStyleImage = 'none';
    	} else
	    	nd.style.listStyleImage = 'url("' + sPath + 'open_brk.png")';

	    nd.appendChild(ndAnchor);
//	    nd.setAttribute("class", "__mnu_LI");
		
		if (nOffset == 0) {
			ndUL.appendChild(nd);

			if (i<aTocItem.length-1 && aTocItem[i+1].lev > aTocItem[i].lev) {
	    		ndUL = document.createElement("UL");
				nd.appendChild(ndUL);
			}
		} else if (nOffset < 0){
			ndUL.appendChild(nd);
			if (i<aTocItem.length-1 && aTocItem[i+1].lev > aTocItem[i].lev) {
	    		ndUL = document.createElement("UL");
				nd.appendChild(ndUL);
			}
		} else {
			for (j=0; j<nOffset; j++) {
				ndUL = ndUL.parentNode.parentNode;
			}
				
			ndUL.appendChild(nd);
			
			if (i<aTocItem.length-1 && aTocItem[i+1].lev > aTocItem[i].lev) {
	    		ndUL = document.createElement("UL");
				nd.appendChild(ndUL);
			}
		}
	}
}



function onMenuClicked(ev) {
	var sPath = hostImgURL();

	var eTrigger = $(event.target); //ev.target;
//	if (eTrigger.prop("tagName") == "SPAN") {
	if (eTrigger.prop("id").indexOf("A_") == 0) {
		theBook.mbJumpAnchor = true;
		location.href = "#" + eTrigger.prop("id").slice(2); //A_xxxx
		return; //return 後，讓 win.click() 收束選單
	}
	
	ev.stopPropagation(); //選單維持開啟狀態，不上傳 win.click()
//	ev.cancelBubble = true;
	
	//eTrigger.children().length > 1 沒有子 ul 者，只有 span 1 個 
	if (eTrigger.prop("tagName") == "LI" && eTrigger.children().length>1) {
		var bOpened = eTrigger.css("listStyleImage").includes("open");
		
		eTrigger.css("listStyleImage", 'url("' + sPath + (bOpened ? "close_brk.png" : "open_brk.png") + '")');

		eTrigger.children("ul:first").toggle();
	}
}
