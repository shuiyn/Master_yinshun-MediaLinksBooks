
var mysBooks = function(bkId, lecId) {
	this.bkId = bkId;
	this.lecId = lecId;
	this.phId = null;
	this.cm; // course materials
	if(lecture_List[lecId].cm != undefined) {
		this.cm = eval(lecture_List[lecId].cm);
	}
	this.book;
	try {
		this.book = eval(this.bkId + "_book");
	} catch(e) {}
	
	this.bookStyle;// = eval(this.bkId + "_style");
	try {
		this.bookStyle = eval(this.bkId + "_style");
	} catch(e) {}
	
	this.auxData = null;
	try {
		this.auxData = eval("auxData_" + this.lecId);
	} catch(e) {}
	
	if (!this.auxData)
		document.getElementById("btnOpenAux").disabled = true;
		
//	this.auxJSON = null;
//	try {
//		this.auxJSON = eval("auxJSON_" + this.lecId);
//	} catch(e) {}

	this.mbJumpAnchor = false;

	this.tblShowYin = document.getElementById("tblShowYin");
	this.tblShowAux = document.getElementById("tblShowAux");
	this.ctlShowYin = document.getElementById("content");
	this.ctlShowAux = document.getElementById("auxPanel");
	
	this.selPageListYin = document.getElementById("pageList");
	this.selPageListAux = document.getElementById("pageList_hand");
}


mysBooks.prototype.showPageTocSelect=function(btn){
//	if (btn.id == "btnAuxMenu")
//	document.getElementById("dlgPageToc_hand").showModal();
	document.getElementById("dlgPageToc").showModal();
}


mysBooks.prototype.onPageListChange=function(e){
	this.mbJumpAnchor = true;
	var idTail = (e.id == "pageList_hand"? "_H" : "");
	location.href = "#" + base_List.htmlIdPrefix.page + "p" + e.options[e.selectedIndex].innerText + idTail;
	
//	console.log(location.href);

	document.getElementById("dlgPageToc").close();
}


mysBooks.prototype.TryScroll=function(ev) {
	if (this.mbJumpAnchor) {
		window.scrollTo(0, 0);
		this.mbJumpAnchor = false;
	}
}

//◆ 彈出式選單必與 invoke button 同屬一個 parentNode
window.onclick=function(event) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var nDrop=0; nDrop < dropdowns.length; nDrop++) {
			var openDropdown = dropdowns[nDrop];
    	if (event.target.parentNode != openDropdown.parentNode) {
	      if (openDropdown.classList.contains('dropdownShow')) {
	        openDropdown.classList.remove('dropdownShow');
	      }
    	}
    }
//    console.log(dropdowns[nDrop].id, ", sameP, ", event.target.parentNode == dropdowns[nDrop].parentNode)
//    console.log(event.target.nextElementSibling, dropdowns[0]);
//  if (!event.target.nextElementSibling.isSameNode(dropdowns[0])) {
  /*
  if (!event.target.matches('.dropbtn')) {
//  if (event.target.nextElementSibling != dropdowns[0]) {
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('dropdownShow')) {
        openDropdown.classList.remove('dropdownShow');
      }
    }
  }*/
}


mysBooks.prototype.fillDropdown=function(ctl, aItem) {
	while (ctl.length > 0) ctl.remove(0);

	var nWidth = 0;
	
	for (var i=0; i < aItem.length; i++) {
  	var nd = document.createElement("A");
  	var tnd = document.createTextNode(aItem[i]); 
  	nd.appendChild(tnd);
  	ctl.appendChild(nd);
 	nd.setAttribute("onclick", 'openEssay(true,theBook.cm["' + aItem[i]+ '"])');
  	nWidth = Math.max(nWidth, aItem[i].length);
	}
	
	ctl.style.width = (nWidth*16+16) + "px";
}

function toggleDropDown(id) {
	var drpdn = document.getElementById(id);
	drpdn.classList.toggle("dropdownShow");
}

mysBooks.prototype.fillBook=function() {
	var drpdn = document.getElementById("dropdnChpter");
	
	if (this.cm) {
		var aChapter = [];
		for (var ch in this.cm) {
			if (ch == "ft") {
					document.getElementById("toggleNote").disabled = (!this.cm[ch]["note"]);
					document.getElementById("toggleLineNo").disabled = (!this.cm[ch]["lnNo"]);
			} else {
				aChapter.push(ch);
			}
		}
		
		this.fillDropdown(drpdn, aChapter);
		
		openEssay(true, this.cm[aChapter[0]]);
//		openEssay(this.ctlShowYin, this.cm["般若經講記"]);
//		openEssay(this.ctlShowYin, this.cm["第一章"]);
//		doToggleBR();
	} else if (this.book) {
	} else {
	  this.ctlShowYin.innerHTML = "<p>本單元尚未建立 ePub 檔。</p><p>請點按左上角【<span style='font-weight:bold;color:brown;'>期別</span>】按鈕，切換到【<span style='font-weight:bold;color:brown;'>講義</span>】，開啟右側選單，點選所要參閱的章節，再點按【<span style='background-color:lightgreen;'>到網頁</span>】連結，即可前往該文件網址。</p>";
//	  this.ctlShowYin.innerHTML = this.parseCont();
	}
	
  this.fillAuxDataOpt();
  this.fillHandout();
  this.fillPhase();
}

mysBooks.prototype.fillAuxDataOpt=function() {
	var sel = document.getElementById("auxDataList");
	while (sel.length > 0) sel.remove(0);
	
	if (!this.auxData) return;
	
	for (id in this.auxData) {
		var opt = document.createElement("option");
//    opt.setAttribute("value", id);
    var t = document.createTextNode(id);
    opt.appendChild(t);
		sel.appendChild(opt);
		}
}


mysBooks.prototype.fillHandout=function() {
	var ht = lecture_List[this.lecId].handout;
	var pnl = document.getElementById("pnlHandout");
	var s='<select style="width:7em;" id="selHandout" onchange="theBook.onHandoutChange(this)">';
	if (ht) {
		var bGroup = false;
//		var auxAttr = "";
		
		for (var i=0; i < ht.length; i++) {
			if (ht[i].url) {
//				auxAttr = "";
//				if (ht[i].aux) {
//					auxAttr = ' aux="' + ht[i].aux + '"';
//				}
//				
//				s += '<option value="' + ht[i].url + '"' + auxAttr + '>' + ht[i].t + "</ooption>";
				s += '<option value="' + ht[i].url + '">' + ht[i].t + "</ooption>";
			} else {
				if (bGroup) s+= '</optgroup>';
				
				s += '<optgroup label="' + ht[i].t + '">';
				bGroup = true;
			}
		}
		
		if (bGroup) s+= '</optgroup>';
		
	} else {
		document.getElementById("openHandout").href = "javascript:void(0);";
	}
	s+=" </select>";
	pnl.innerHTML = s;
	
	if (ht)
		this.onHandoutChange(document.getElementById("selHandout"));
}

mysBooks.prototype.onHandoutChange=function(e) {
	var url = e.options[e.selectedIndex].value;
	document.getElementById("openHandout").href = url;
	/*
	var auxId = e.options[e.selectedIndex].getAttribute("aux");
	toggleBtnAux(auxId);

	theBook.ctlShowAux.innerHTML = "";
		
	var pageList_hand = document.getElementById("pageList_hand");
	while (pageList_hand.length > 0) pageList_hand.remove(0);
	*/
}



mysBooks.prototype.fillPhase=function() {
	var phs=grabPhase(this.lecId);
	var masterId=phs[0];
	var arr=phs[1];
	var s='<select id="selPhase" onchange="theBook.onPhaseChange(this)" style="width:7em;"' + '" data-masterId="' + masterId + '"> ';
	
	if (arr) {
		for(var i=0; i< arr.length; i++) {
			s+= ' <option value="' + arr[i].url + '" data-phid="' + arr[i].id+ '">' + arr[i].t + '</option>'
		}
	}
	s+=" </select>";
	document.getElementById("dvPhase").innerHTML = s;

	this.onPhaseChange(document.getElementById('selPhase'));
}


mysBooks.prototype.onPhaseChange=function(e) {
//{"item":"ffgl", "master":"kr", "croom":"pn", "period":"9"}
	document.getElementById('goSite').href = e.value;
	var phId=e.options[e.selectedIndex].getAttribute("data-phid");

	this.phId = phId;
	var masterId = e.getAttribute("data-masterId");

	var out = grabLesson(masterId, this.bkId, phId);
	
	this.fillLesson(out, masterId, phId);
}


var lessonProcessOnClick=function(selectedIndex) {
	var e = document.getElementById("selLesson");
	e.selectedIndex = selectedIndex;
	theBook.onLessonChange(e);
}

mysBooks.prototype.fillLesson=function(out, masterId, phId){
 	var bGroup = false;
 	var aProcess = [];

	var s='<select id="selLesson" onchange="theBook.onLessonChange(this)" style="width:6em;"'+ 'data-mbpId="' + [masterId, this.bkId, phId].join(",") + '"> ';
	for(var i=0; i< out.length; i++) {
		var lpros=(out[i].p ? out[i].p : "");
	 	var sLiText = (out[i].sno ? out[i].sno : out[i].d);
 	
		if (lpros)
			aProcess.push('<p><a onclick=lessonProcessOnClick(' + i + ')><span style="color:blue;">' + sLiText + "</span>：" + lpros + "</a></p>");

		if (out[i].url) {
			s+= '<option value="' + out[i].url + '" data-lpros="' +lpros+ '">' + sLiText + '</option>';
		} else {
			if (bGroup) s+= '</optgroup>';
				s += '<optgroup label="' + sLiText + '">';
			bGroup = true;
		}
	}
	if (bGroup) s+= '</optgroup>';
		s+=" </select>";

	document.getElementById("dvLesson").innerHTML = s;
	
	document.getElementById("btnDropdnProcess").disabled = (aProcess.length == 0);
	document.getElementById("dropdnProcess").innerHTML = aProcess.join("\n");
	
	this.onLessonChange(document.getElementById('selLesson'));
}



mysBooks.prototype.onLessonChange=function(e) {
	/*var lpros = e.options[e.selectedIndex].getAttribute("data-lpros");
	document.getElementById("btnDropdnProcess").disabled = (lpros == "");
	document.getElementById("dropdnProcess").innerHTML = lpros;*/
	
	if(!e.value){
		theAud.aud.src = "";
//		alert(aud.src);為本站址
		this.ctlShowYin.innerHTML = "";
		return;
	}

	var src = e.value;
	if (src.search(/https?:\/\//) != 0) {
		src = hostImgURL("mp3") + this.phId + "/" + src;
	}
		
	theAud.aud.src = src; //.value;
	theAud.playStart = 0;
//	theAud.playDuration = 0;

	var mbp = e.getAttribute("data-mbpId").split(",");
	theAud.fillCue(mbp, e.value); // e.value == url
}



mysBooks.prototype.parseCont = function(){
	createMenu(this.book);

	var pgList = document.getElementById("pageList");
	while (pgList.length > 0) pgList.remove(0);
		
	var ct = this.book;
	var styBook = this.bookStyle;
	var pgIdPfx = base_List.htmlIdPrefix.page;
	var tocIdPfx = base_List.htmlIdPrefix.toc;
	var paraIdPfx = base_List.htmlIdPrefix.para;
	
	var out=[];
	var swClass = '<span class="' + msSourceWords + '">';

	for(var lineId=0; lineId < ct.length; lineId++){
//		var aLine = ct[lineId];
//		var pg = aLine[0];
//		var fmt = aLine[1];
		var pg = ct[lineId].c;
		var fmt = ct[lineId].lev;
//		var fmt = ct[lineId].bs;
		var stl; //=bookFmt_List[this.bkId][lineId];
		var sTocSty = "";
		
		if (styBook)
			stl=styBook[lineId];
//		var stl=book_fmt[lineId];
		var aHtmB={};//{"66":["<span...>",""]
		var aHtmE={};

		if (stl){
			for (var i=0; i < stl.length; i++) {
				var aSet = stl[i].split(/[~,]/);
				if (aSet[2] == "sw") {
					if (!aHtmB[aSet[0]]) aHtmB[aSet[0]]=[];
					aHtmB[aSet[0]].push(swClass);
					if (!aHtmE[aSet[1]]) aHtmE[aSet[1]]=[];
					aHtmE[aSet[1]].push('</span>');
				}
				else if (aSet[2] == "a") {
					if (!aHtmB[aSet[0]]) aHtmB[aSet[0]]=[];
					aHtmB[aSet[0]].push('<a href="'+ aSet[3] + '" target="_blank">');
					if (!aHtmE[aSet[1]]) aHtmE[aSet[1]]=[];
					aHtmE[aSet[1]].push('</a>');
				}
				else if (aSet[2] == "tbr") {
					if (!aHtmB[aSet[0]]) aHtmB[aSet[0]]=[];
					aHtmB[aSet[0]].push('<span class="textborder">');
					if (!aHtmE[aSet[1]]) aHtmE[aSet[1]]=[];
					aHtmE[aSet[1]].push('</span>');
				}
			}
		}
		
		var sNew = "";
		
		pg.replace(/./g, function(x,idx){
			var bHtml = false;

			if(aHtmE[idx]) {
				bHtml = true;
				sNew += x + aHtmE[idx].join("");
			}
			if(aHtmB[idx]) {
				bHtml = true;
				sNew += aHtmB[idx].join("") + x;
			}
			
			if (!bHtml) sNew += x;
		});

		pg = sNew;
		
		if(fmt) {
			if(fmt.search(/\d/)==0){
				sTocSty = "margin-left:" + (Number(ct[lineId].lev) * 0.5) + "em;";
				if (lineId > 0 && ct[lineId-1].lev) {
					sTocSty += "margin-top:0;";
				}
				if (lineId < ct.length-1 && ct[lineId+1].lev) {
					sTocSty += "margin-bottom:0;";
				}

				pg='<h4 style="color:darkblue;font-weight:bold;' + sTocSty + '" id="' + tocIdPfx + ct[lineId].a + '">' + pg + "</h4>";
			}
		} else {
			pg="<p>" + pg + "</p>";
		}
		
		out.push('<span style="display:none;" id="' + paraIdPfx + lineId + '">' + (lineId+1) + '</span>' + pg);
	}
	
//	return out.join("");
	//頁次 Id、selectPage-Option
	return out.join("").replace(/\[p[a-z]?\d+\]/g,function(x){
		var ma = x.match(/\[(p[a-z]?\d+)\]/);
		var opt = document.createElement("option");
		opt.text = ma[1].substr(1);
		pgList.add(opt);
		return '<hr/><p id="' + pgIdPfx + ma[1] + '" style="color:blue;">' + x + "</p>";
	});
}


var mysAud=function() {
	this.playStart = 0;
//	this.playDuration = 0;
	
	this.aud = document.getElementById("myAudio");
//	this.aud.addEventListener("timeupdate", this.onTimeUpdate);
}
	/* 終點已移除
mysAud.prototype.onTimeUpdate=function() {
	if(this.playDuration < 1) return;

	if (!this.aud) return;

	if(this.aud.currentTime > (this.playStart + this.playDuration))
		this.aud.pause();
}*/

mysAud.prototype.getMS=function(sId) {
	var m=0, s=0;
	if(sId=="palyStart") {
		m=parseInt(document.getElementById("palyStartM").value);
		s=parseInt(document.getElementById("palyStartS").value);
	}
	/* 終點已移除
	else {
		m=parseInt(document.getElementById("playLengthM").value);
		s=parseInt(document.getElementById("playLengthS").value);
	}*/
	return (m*60)+s;
}

mysAud.prototype.cusTime=function(nType) {
	var t = this.aud.currentTime;
	var h = Math.floor(t/3600);
	var m = Math.floor((t % 3600)/60);
	var s = Math.floor(t % 60);

	if(nType == 1){ //start
		this.playStart = t;
		document.getElementById("palyStartH").value = h;
		document.getElementById("palyStartM").value = m;
		document.getElementById("palyStartS").value = s;
	}
	/* 終點已移除
	else{
		this.playDuration = this.aud.currentTime - this.playStart;
		t = this.playDuration;
		document.getElementById("playLengthH").value = Math.floor(t/3600);
		document.getElementById("playLengthM").value = Math.floor((t % 3600)/60);
		document.getElementById("playLengthS").value = Math.floor(t % 60);
	}*/
}

mysAud.prototype.cusPlay=function() {
	this.playStart = this.getMS("palyStart");
//	this.playDuration = this.getMS("playDuration");
	this.aud.currentTime = this.playStart;
	this.aud.play();
}

mysAud.prototype.showCue=function() {
	document.getElementById("dlgCue").showModal();
}
mysAud.prototype.closeCue=function() {
	document.getElementById("dlgCue").close();
}

mysAud.prototype.fillCue=function(mbp, url){
	var eCue=document.getElementById("cueList");
	var mp3Main = url.slice(url.lastIndexOf("/")+1, url.lastIndexOf("."));
	var aCuePoint = grabCue(mbp[0], mbp[1], mbp[2], mp3Main);
	
	while (eCue.length > 0) eCue.remove(0);
	
	if (aCuePoint) {
		aCuePoint.map(function(x){
			var opt = document.createElement("option");
			opt.text = x;
			eCue.add(opt);
		});
	}/* else {
		while (eCue.length > 0) eCue.remove(0);
	}*/
}


mysAud.prototype.cuePointPlay=function(){
	if(this.aud.networkState == 3){
		alert("沒有指定音檔");
		return;
	}
	var ctl = document.getElementById("cueList");
	if(ctl.options.length == 0) return;
	
	var aHms = ctl.options[ctl.selectedIndex].text.split(" ")[0].split(":");
	if(aHms.length < 3) aHms.unshift("0");

	var ct = 0;
	for(var i=0; i<aHms.length; i++){
		ct += parseInt(aHms[i])*[3600,60,1][i];
	}
	this.aud.currentTime = ct;
	this.aud.play();
	
	this.closeCue();
}


mysAud.prototype.dotPlay=function(hms) {
	var a = hms.split(":");
	var h = 0,m = 0;
	var s = parseInt(a[a.length-1]);
	if(a.length>2) h = parseInt(a[a.length-3]);
	if(a.length>1) m = parseInt(a[a.length-2]);

	this.aud.currentTime = (h*3600)+(m*60)+s;
	this.aud.play();
}


mysAud.prototype.forbackward=function(mode) {
	if(mode == 1)//後退
		this.aud.currentTime -= 10;
	else
		this.aud.currentTime += 10;
}



//非物件函式 ---------------------------------------
//重設文章、講義顯示區的高度
function fitDevice() {
	if (mbIsPC) {
		document.getElementById("tit_booklecName").style.fontSize = "110%";
		document.getElementById("content").style.fontSize = "110%";
		document.getElementById("auxPanel").style.fontSize = "110%";
		document.getElementById("contFontSize").innerHTML = "110";

		document.getElementById("palyStartH").style.width = "1.7em";
		document.getElementById("palyStartM").style.width = "2.2em";
		document.getElementById("palyStartS").style.width = "2.2em";
		
		document.getElementById("dlgPageToc").style.width = "50%";
	}
	
}

//首次開啟 Menu 窗時，擷取相對位置，設妥高度後即卸載事件器
function dlgFocusIn(e) {
	var dlg = document.getElementById("dlgPageToc");
	var mnuRoot = document.getElementById("mnuRoot");
	mnuRoot.style.height = (dlg.offsetHeight - mnuRoot.offsetTop -20) + "px";

	dlg.removeEventListener("dlgFocusIn", dlgFocusIn);

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



//重疊 table 切換顯示
function doToggle(btn, aInner, aTbl, aOwner, aDvText) {
//	var btn = document.getElementById(btnId);
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
//			document.getElementById(aDvText[0]).style.display = "none";
//			document.getElementById(aDvText[1]).style.display = "block";
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


	/*
function toggleBtnAux(auxId){
	var btn = document.getElementById("toggleAux");
	
	btn.setAttribute("auxId", auxId);
	
	btn.disabled = !auxId;
	if (btn.disabled) {
		btn.innerHTML = "輔";
		toggleAux(btn);
	}
}*/


function toggleAux(btn){
	doToggle(btn, ["教材", "補充"], null, null,["content", "auxPanel", "pageList", "pageList_hand", "btnYinMenu", "btnOpenAux", null, "toggleBR"]);
	
	/*
	var btnBR = document.getElementById("toggleBR");
	btnBR.disabled = (btn.innerHTML == "文");

	if (btnBR.disabled) {
		btnBR.innerHTML = "段";
	}
	else if (!theBook.ctlShowAux.innerHTML)
			openAuxBook(btn.getAttribute("auxId"));
	*/
}

function toggleHandout(btn){
  doToggle(btn, ["期別", "講義"], ["tblShowPhrase", "tblShowHandout"], ["tdPhrase", "tdHandout"]);
}


mysBooks.prototype.openAuxData=function() {
	var sel = document.getElementById("auxDataList");
	var auxId = sel.value;
//	console.log(sel.value, sel.options[sel.selectedIndex].text);
	if (!auxId) return;
	
	document.getElementById("toggleBR").innerHTML = "段";
	
	var pgIdPfx = base_List.htmlIdPrefix.page;

	var pageList_hand = document.getElementById("pageList_hand");
	while (pageList_hand.length > 0) pageList_hand.remove(0);

	var out = this.transAuxData(this.auxData[auxId]);
	
	this.ctlShowAux.innerHTML = out.join("").replace(/\[p[a-z]?\d+\]/g,function(x){
		var ma = x.match(/\[(p[a-z]?\d+)\]/);
		var opt = document.createElement("option");
		opt.text = ma[1].substr(1);
		pageList_hand.add(opt);
		
		return '<p id="' + pgIdPfx + ma[1] + '_H" style="color:blue;">' + x + "</p>";
//		return '<hr/><p id="' + pgIdPfx + ma[1] + '_H" style="color:blue;">' + x + "</p>";
	});

	this.ctlShowAux.scrollTo(0,0);
	doToggleBR(false);
}


//◆ nti_、ntd_ 要末加識別字，以區分「原著、講義」
mysBooks.prototype.parseParaStyle=function(paraText, paraSty) {
	var aHtmB={};//{"66":["<span...>","<a...>", ...]
	var aHtmE={};
	var aVar = [], sStart = "", sEnd = "", sSet = "";
	
	paraSty.map(function(jsn, nIdx) {
		for (var i in jsn) {
			aVar = jsn[i];
			sStart = aVar[0];

			if (sStart != null)
				sEnd = aVar[0] + aVar[1];
			else
				sEnd = aVar[1];

			sSet = aVar[2]; // if length < 2 ??
		
			if (sStart != null)
				if(!aHtmB[sStart]) aHtmB[sStart] = [];
			
			if (sEnd != null)
				if(!aHtmE[sEnd]) aHtmE[sEnd] = [];

			if (i == "ln") {
				aHtmB[sStart].push('<sup class="falseBR">' + sSet + "</sup>");
			} else if (i == "f_br") {
				aHtmE[sEnd].push('<br class="falseBR" />');
			} else if (/^CS_?\d{0,2}$/.test(i)) {
				if (sSet == "srcwords")
					sSet = msSourceWords; //定義於 ys_cell.html
				aHtmB[sStart].push('<span class="' + sSet + '">');
				aHtmE[sEnd].push('</span>');
			} else if (i == "a") {
				aHtmB[sStart].push('<a href="'+ sSet + '" target="_blank">');
				aHtmE[sEnd].push('</a>');
			} else if (i == "br") { // true br
				aHtmE[sEnd].push("<br/>"); //nStart 前已計實 + sLine.length
			} else if (/^nti_\d+$/.test(i)) {
				//◆ 註序前後各附加１個空白
				aHtmB[sStart].push('<sup id="' + i + '" class="noteNum"><a href="#ntd_' + i.substr(4) + '"> ');
				aHtmE[sEnd].push(' </a></sup>');
			} else if (/^ntd_\d+$/.test(i)) {
				aHtmB[sStart].push('<span id="' + i + '" class="noteDet"><a href="#nti_' + i.substr(4) + '">〈註 ');
				aHtmE[sEnd].push('〉</a></span>');
			} else if (/^ST_?\d{0,2}$/.test(i)) {
				aHtmB[sStart].push('<span style="' + sSet + '">');
				aHtmE[sEnd].push('</span>');
			} else if (i == "TAG") {
				aHtmB[sStart].push('<' + sSet + '>');
				aHtmE[sEnd].push('</' + sSet + '>');
			} else {
				console.log("Kag style not defined:", i);
			}
		} // for_jsn
	}); // map
	
	
	var out = 
	paraText.join("").replace(/./g, function(x, idx) {
		var s = "";
		
		if(aHtmE[idx])
			s = aHtmE[idx].join("");
		if(aHtmB[idx])
			s += aHtmB[idx].join("");

		return s+x;
	});
	
//	console.log(out);
	return "<p>" + out + "</p>";
}

mysBooks.prototype.transAuxData=function(aLine) {
	if (this.lecId != "0001")
		return openEssayData(aLine);
	
	var out = [];
	//文章標題〝不計入行數〞，先寫入，此後不必判斷
	var nIdxInPara = 0;//nStart 在全段中的實體位序
	var nRowCount = 1; //各頁所有行的行號，人讀、從 1 起計
	var paraText = [];
	var paraSty = [];
	var sLine, tagPageNum, jsn;

	for (var nIdx = 0; nIdx < aLine.length; nIdx++) {
		sLine = aLine[nIdx];
		
		//or ^^{p}，全段的結束標記
		if (!sLine) {
			out.push(this.parseParaStyle(paraText, paraSty));
			paraText = [];
			paraSty = [];
			nIdxInPara = 0;
			continue;
		}
		
	//???◆◆在此必需先依 nIdxInPara 校正 nStart 在全段中的實體位址
//		if (sLine.startsWith('^^{')) {
		if (/^\^\^\{.*?\}$/.test(sLine)) {
			jsn = JSON.parse(sLine.substr(2));
			
			for (ji in jsn) {
				if (ji == "br") { // true br, not false br
					//該行末位
					jsn["br"] = [null, nIdxInPara + aLine[nIdx + 1].length];
				} else {
					jsn[ji][0] += nIdxInPara;
				}
			}
			paraSty.push(jsn);
			
			nIdx++;
			sLine = aLine[nIdx];
//			paraText.push(aLine[nIdx]);
//			nIdxInPara += sLine.length;
//			continue;
		}
		
		var aTestNum = /\[p[a-z]?\d+\]/.exec(sLine);
		tagPageNum= null;
		if (aTestNum) tagPageNum = aTestNum[0];

		//全行只有頁次者，[p1]，不遞加 nRowCount，前也不加 行號
		if (tagPageNum == sLine) {
//			if (tagPageNum != "[p1]") //第１頁碼前可能已含 文章標題等
			if (!/\[p[a-z]?1\]/.test(tagPageNum)) //第１頁碼前可能已含 文章標題等
				nRowCount = 1; //新段開始，行號重設 1 起計
			paraText.push(sLine);
			nIdxInPara += sLine.length;
			continue;
		}

		jsn = {"ln":[nIdxInPara, null,nRowCount]};
		paraSty.unshift(jsn); //unshift 置首，以免被其他 tag <span> 等包住而誤顯
		// !aLine[nIdx+1].startsWith("^^{p")
		//全段的末行、或同一行已含 true br 者，不另加 false br
		if (!paraSty.find(function(x){return x["br"]})) {
			if (nIdx < aLine.length-1 && aLine[nIdx+1]) {
				jsn = {"f_br":[null, nIdxInPara + sLine.length]};

				paraSty.push(jsn);
			}
	}

			paraText.push(sLine);
			nIdxInPara += sLine.length;

		if (tagPageNum)
			nRowCount = 1;
		else
			nRowCount++;
	}
	
	if (paraText.length > 0)
			out.push(this.parseParaStyle(paraText, paraSty));
	
	return out;
}





mysBooks.prototype.openAuxData_Old=function() {
	var sel = document.getElementById("auxDataList");
	var auxId = sel.value;
//	console.log(sel.value, sel.options[sel.selectedIndex].text);
	if (!auxId) return;
	
	document.getElementById("toggleBR").innerHTML = "段";
	
	var nRowCount = 1;
	var aLine = this.auxData[auxId];
//	var aLine = auxData_List[auxId];
	var lstParaLine = this.auxJSON[auxId];
//	var lstParaLine = auxJSON_List[auxId];

	var doParseBR=function(sPara, nParaIdx){
		var aBrIdx = lstParaLine[nParaIdx];
		
		var sRet = "";
		
		if (!aBrIdx || ((aBrIdx.length == 1) && (aBrIdx[0].startsWith("F")))) {
			sRet = sPara;
		} else {
			//從倒數第 2 個往前找，最後 1 個是該段末，不加換列符
	//		var nLastFrom = aBrIdx.length - 2;
				
			sPara.replace(/./g, function(x, nCharIdx){
				var nIdx = aBrIdx.findIndex(function(s){return (s=="F" + nCharIdx) || (s=="T" + nCharIdx)});
	//			if (aBrIdx.lastIndexOf(nCharIdx, nLastFrom) > -1) {
				//每段開頭
				if (nCharIdx==0) {
					sRet += '<sup class="falseBR">' + nRowCount + "</sup>";
					nRowCount++;
				} else if (sPara.substr(nCharIdx).search(/\[(p[a-z]?\d+)\]/) == 0) {
					nRowCount = 1;
				}
				
				if (nIdx > -1) {
					if (aBrIdx[nIdx].startsWith("T")) {
						sRet += "<br/>" + x; //定位於 line.length
						//如定位於字本身的 index，應 += x + "<br/>"
					} else {
						if (nIdx < aBrIdx.length - 1) {
							sRet += '<br class="falseBR" /><sup class="falseBR">' + nRowCount + "</sup>"+ x;
							nRowCount++;
//							sRet += '<br class="falseBR" />' + x;
						} else {
							sRet += x;
						}
					}
				} else {
					sRet += x;
				}
			});
		}
		
		return "<p>" + sRet + "</p>";
	}

	var out = aLine.map(doParseBR);
	var pgIdPfx = base_List.htmlIdPrefix.page;

	var pageList_hand = document.getElementById("pageList_hand");
	while (pageList_hand.length > 0) pageList_hand.remove(0);

	this.ctlShowAux.innerHTML = out.join("").replace(/\[p[a-z]?\d+\]/g,function(x){
		var ma = x.match(/\[(p[a-z]?\d+)\]/);
		var opt = document.createElement("option");
		opt.text = ma[1].substr(1);
		pageList_hand.add(opt);
		
		return '<hr/><p id="' + pgIdPfx + ma[1] + '_H" style="color:blue;">' + x + "</p>";
//		return '<hr/><p style="color:blue;">' + x + "</p>";
	});

	doToggleBR(false);
}

function toggleBR(){
	if (!theBook.ctlShowAux.innerHTML)
		return;
	
	var btn = document.getElementById("toggleBR");
	var bShowBR = false;
	
	if (btn.innerHTML == "段") {
		btn.innerHTML = "行";
		bShowBR = true;
	} else {
		btn.innerHTML = "段";
	}
	
	doToggleBR(theBook.ctlShowAux);
//	doToggleBR(bShowBR, theBook.ctlShowAux);
}

function doToggleBR(dv){
	bookToggle("falseBR", "Hider", dv);
}


function bookToggle(clsNameEle, clsNameTog, dv){
	dv = dv || theBook.ctlShowYin;
	var a = dv.getElementsByClassName(clsNameEle);
	for(var i=0; i < a.length; i++) a[i].classList.toggle(clsNameTog);
}

function toggleTocBold(dv){
	bookToggle("tocTitle", "Bolder", dv);
}

function togglePageNum(dv) {
	bookToggle("__pageNumHrDiv", "Hider", dv);
}

function toggleFullBookScreen(dv){
//	dv = dv || theBook.ctlShowYin;
//	var a = document.body.getElementsByClassName("audioGroupX");
//	for(var i=0; i < a.length; i++) a[i].style.display="none";
	bookToggle("audioGroup", "Hider", document.body);
	rstPosition();
}


function toggleNA(dv){
	var sName = (mbIsPC ? "notearea" :"notearea_m");
	bookToggle(sName, "Hider", dv);
}

function rstContHandFontSize(sType){
//	var ps = parseInt(theBook.ctlShowYin.style.fontSize);
	var ps = parseInt(document.getElementById("contFontSize").innerHTML);
	if (sType == "+") ps += 4;
	else ps -= 4;
	
	document.getElementById("contFontSize").innerHTML = ps;
	theBook.ctlShowYin.style.fontSize = ps+"%";
	theBook.ctlShowAux.style.fontSize = ps+"%";
}
