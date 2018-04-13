
var mysBooks = function(bkId, lecId) {
	this.bkId = bkId;
	this.lecId = lecId;
	this.book = eval(this.bkId + "_book");
	this.bookStyle;// = eval(this.bkId + "_style");
	try {
		this.bookStyle = eval(this.bkId + "_style");
	} catch(e) {
	}
//	this.handout = eval(this.bkId + "_handout");
	this.mbIsPC = false;
	this.mbIs7inch = false;

	this.tblShowYin = document.getElementById("tblShowYin");
	this.tblShowAux = document.getElementById("tblShowAux");
	this.ctlShowYin = document.getElementById("content");
	this.ctlShowAux = document.getElementById("auxPanel");
}


mysBooks.prototype.showPageTocSelect=function(){
	document.getElementById("dlgPagToc").showModal();
}


mysBooks.prototype.onPageListChange=function(e){
	location.href = "#" + base_List.htmlIdPrefix.page + "p" + e.options[e.selectedIndex].innerText;
	document.getElementById("dlgPagToc").close();
}


mysBooks.prototype.TryScroll=function(ev) {
	window.scrollTo(0, 0);
}



mysBooks.prototype.fillBook=function() {
  this.ctlShowYin.innerHTML = this.parseCont();
//  this.fillHandout();
  this.fillPhase();
}

mysBooks.prototype.fillHandout=function() {
	var ht = lecture_List[this.lecId].handout;
	var pnl = document.getElementById("pnlHandout");
	var s='<select style="width:7em;" id="selHandout" onchange="theBook.onHandoutChange(this)">';
	if (ht) {
		var bGroup = false;
		
		for (var i=0; i < ht.length; i++) {
			if (ht[i].url) {
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
//	var bkId = document.getElementById('selBook').value;
	var masterId = e.getAttribute("data-masterId");
//	console.log("bkId", bkId,"phId",phId,"masterId",masterId);

	var out = grabLesson(masterId, this.bkId, phId);
	
	this.fillLesson(out, masterId, phId);
}



mysBooks.prototype.fillLesson=function(out, masterId, phId){
 	var bGroup = false;

	var s='<select id="selLesson" onchange="theBook.onLessonChange(this)" style="width:6em;"'+ 'data-mbpId="' + [masterId, this.bkId, phId].join(",") + '"> ';
	for(var i=0; i< out.length; i++) {
		var bkid=(out[i].ybk ? out[i].ybk : "");
		if (out[i].url) {
		s+= '<option value="' + out[i].url + '" data-ybk="' +bkid+ '">' + out[i].d + '</option>';
		} else {
			if (bGroup) s+= '</optgroup>';
			
			s += '<optgroup label="' + out[i].d + '">';
			bGroup = true;
		}
	}
	if (bGroup) s+= '</optgroup>';
	s+=" </select>";
	document.getElementById("dvLesson").innerHTML = s;

	this.onLessonChange(document.getElementById('selLesson'));
}



mysBooks.prototype.onLessonChange=function(e) {
	if(!e.value){
		theAud.aud.src = "";
//		alert(aud.src);為本站址
		this.ctlShowYin.innerHTML = "";
		return;
	}
	
	theAud.aud.src = e.value;
	theAud.playStart = 0;
	theAud.playDuration = 0;

	var mbp = e.getAttribute("data-mbpId").split(",");
	theAud.fillCue(mbp, e.value); // e.value == url
	
//	var lineScope = e.options[e.selectedIndex].getAttribute("data-ybk");
//	if(!lineScope)
//		ctl.innerHTML="";
//	else {
//		var ct = grabYbkCont(mbp[1], lineScope);
//		ctl.innerHTML = parseCont(mbp[1], ct);
//	}
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
	var swClass = (this.mbIsPC ? '<span class="srcwords_PC">' : '<span class="srcwords">');

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
	this.playDuration = 0;
	
	this.aud = document.getElementById("myAudio");
	this.aud.addEventListener("timeupdate", this.onTimeUpdate);
}

mysAud.prototype.onTimeUpdate=function() {
	if(this.playDuration < 1) return;

	if (!this.aud) return;

	if(this.aud.currentTime > (this.playStart + this.playDuration))
		this.aud.pause();
}

mysAud.prototype.getMS=function(sId) {
	var m=0, s=0;
	if(sId=="palyStart") {
		m=parseInt(document.getElementById("palyStartM").value);
		s=parseInt(document.getElementById("palyStartS").value);
	} else {
		m=parseInt(document.getElementById("playLengthM").value);
		s=parseInt(document.getElementById("playLengthS").value);
	}
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
	}else{
		this.playDuration = this.aud.currentTime - this.playStart;
		t = this.playDuration;
		document.getElementById("playLengthH").value = Math.floor(t/3600);
		document.getElementById("playLengthM").value = Math.floor((t % 3600)/60);
		document.getElementById("playLengthS").value = Math.floor(t % 60);
	}
}

mysAud.prototype.cusPlay=function() {
	this.playStart = this.getMS("palyStart");
	this.playDuration = this.getMS("playDuration");
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


mysAud.prototype.forbakward=function(mode) {
	if(mode == 1)//後退
		this.aud.currentTime -= 10;
	else
		this.aud.currentTime += 10;
}



 /*
function rstCtrlStyle() {
//	alert(theBook.ctlShowYin);
tryShow();
return;
	if (!theBook.mbIsPC) { //華為 7 吋
		if (theBook.mbIs7inch) {
			theBook.ctlShowYin.style.fontSize = "90%";
			theBook.ctlShowAux.style.fontSize = "90%";
			theBook.ctlShowYin.style.height = "37em";
			theBook.ctlShowAux.style.height = "40em";
		} else {
		theBook.ctlShowYin.style.fontSize = "105%";
		theBook.ctlShowAux.style.fontSize = "105%";
			theBook.ctlShowYin.style.height = "32em";
			theBook.ctlShowAux.style.height = "32em";
		}
		
		theBook.tblShowYin.style.width = "99%";
		theBook.tblShowAux.style.width = "99%";
			theBook.ctlShowYin.style.width = "99%";
			theBook.ctlShowAux.style.width = "99%";
		
		//document.getElementById("dlgPagToc").style.width = "90%";
		
//		ctlShowYin.style.width = "99%";
//		ctlShowAux.style.width = "99%";
	} else {
		theBook.ctlShowYin.style.fontSize = "110%";
		theBook.ctlShowAux.style.fontSize = "110%";
	}
//	alert(theBook.mbIs7inch);
}
*/

//非物件函式 ---------------------------------------
//重設文章、講義顯示區的高度
function rstPosition() {
//	return;
	if (!theBook.mbIsPC) {
		document.body.style.fontSize = "115%";
		document.body.style.width = "99%";
		document.getElementById("tblAudio").style.width = "99%";
		document.getElementById("tblToggleContHand").style.width = "99%";
		theBook.ctlShowYin.style.fontSize = "110%";
//		theBook.ctlShowAux.style.fontSize = "110%";
	}
	
	var wInnerH = window.innerHeight;
	var nTop = document.getElementById("dvContHand").offsetTop;

	var nDiffH = (wInnerH - nTop - 10);
//document.getElementById("try").innerHTML = wInnerH + ", t=" + nTop + ", h= " + nDiffH;

	theBook.tblShowYin.style.height = nDiffH  + "px";
	theBook.ctlShowYin.style.height = (nDiffH-10)  + "px";
//	theBook.tblShowAux.style.height = nDiffH  + "px";
//	theBook.ctlShowAux.style.height = (nDiffH-10)  + "px";
}


//重疊 table 切換顯示
function doToggle(btnId, aInner, aTbl, aOwner, aDvText) {
	var btn = document.getElementById(btnId);
	var tbl_0 = document.getElementById(aTbl[0]);
	var tbl_1 = document.getElementById(aTbl[1]);
	
	if (btn.innerHTML == aInner[0]) {
		btn.innerHTML = aInner[1];
		if (aOwner) {
			document.getElementById(aOwner[0]).removeChild(btn);
			document.getElementById(aOwner[1]).appendChild(btn);
		}

		tbl_0.style.visibility = "collapse";
		tbl_1.style.visibility = "visible";
		
		if (aDvText) {
			document.getElementById(aDvText[0]).style.visibility = "hidden";
			document.getElementById(aDvText[1]).style.visibility = "visible";
		}
//		ctlShowYin.style.visibility = "visible";
//		tblShowAux.style.visibility = "collapse";
	} else {
		btn.innerHTML = aInner[0];
		if (aOwner) {
			document.getElementById(aOwner[1]).removeChild(btn);
			document.getElementById(aOwner[0]).appendChild(btn);
		}
		tbl_0.style.visibility = "visible";
		tbl_1.style.visibility = "collapse";
		if (aDvText) {
			document.getElementById(aDvText[1]).style.visibility = "hidden";
			document.getElementById(aDvText[0]).style.visibility = "visible";
		}
	}
}



function toggleAux(){
  if (!theBook.ctlShowAux.innerHTML) openAuxBook();
	
  doToggle("toggleAux", ["文", "輔"], ["tblShowYin", "tblShowAux"], null,["content", "auxPanel"]);
}

function toggleHandout(){
  doToggle("toggleHandout", ["期別", "講義"], ["tblShowPhrase", "tblShowHandout"], ["tdPhrase", "tdHandout"]);
}

function toggleStartLen(){
  doToggle("toggleStartLen", ["於", "長"], ["tblPlayStart", "tblPlayLen"]);
}


function openAuxBook() {
	var fn = "真常大我_真常妙有";
	var aLine = auxData_List[fn];
	var lstParaLine = auxJSON_List[fn];

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
			if (nIdx > -1) {
				if (aBrIdx[nIdx].startsWith("T")) {
					sRet += "<br/>" + x; //定位於 line.length
					//如定位於字本身的 index，應 += x + "<br/>"
				} else {
					if (nIdx < aBrIdx.length - 1)
						sRet += '<br class="falseBR" />' + x;
					else
						sRet += x;
				}
			} else {
				sRet += x;
			}
		});
	}
	
	return "<p>" + sRet + "</p>";
	}

	var out = aLine.map(doParseBR);

//	ctlShowAux.innerHTML = out.join("").replace(/\[p\d+\]/g,"<hr/>");
	theBook.ctlShowAux.innerHTML = out.join("").replace(/\[p\d+\]/g,function(x){
		return '<hr/><p style="color:blue;">' + x + "</p>";
	});
//	toggleAux();
	toggleBR();
}

function toggleBR(){
	var ps = parseInt(theBook.ctlShowYin.style.fontSize);
	theBook.ctlShowYin.style.fontSize = (ps-2)+"%";
	return;
	var btn = document.getElementById("toggleBR");

	var a = theBook.ctlShowAux.getElementsByClassName("falseBR");
	var sDisp;// = ctlShowAux.getAttribute("brMode");
//	sDisp = (sDisp=="none" ? "block" : "none");
	if (btn.innerHTML == "段") {
		btn.innerHTML = "行";
		sDisp = "block";
	} else {
		btn.innerHTML = "段";
		sDisp = "none";
	}
	
//	ctlShowAux.setAttribute("brMode", sDisp);
	for(var i=0; i < a.length; i++) a[i].style.display = sDisp;
}


