
var mysBooks = function(bkId, lecId) {
	this.bkId = bkId;
	this.lecId = lecId;
	this.phId = null;
	
	// book/cm Or aux Data
	this.mbReadCm = true; //
	this.currDropBtn = null; ///章、目、進度 invoke btn
	this.currDropDown = null; ///章、目、進度 drop
	
	this.maTurning = [];
	this.mnTurningIdx = -1;
	
	this.cm; // course materials
	if(lecture_List[lecId].cm != undefined) {
		this.cm = eval(lecture_List[lecId].cm);
	}
	this.aux; // aux course materials
	if(lecture_List[lecId].aux != undefined) {
		this.aux = eval(lecture_List[lecId].aux);
	}
	this.book;
	try {
		this.book = eval(this.bkId + "_book");
	} catch(e) {}
	
	this.mbJumpAnchor = false;
	this.pairingIdCtrl();
	fillPageTurning();
}


mysBooks.prototype.pairingIdCtrl=function(){
	this.essayPool = document.getElementById("esyPool");
	this.ctlShowYin = document.getElementById("content");
	this.ctlShowAux = document.getElementById("auxPanel");
	
	this.fontSizePan = document.getElementById("contFontSize");
	
	this.dpdnMenuCm = document.getElementById("dpdnMenuCm");
	this.dpdnMenuAux = document.getElementById("dpdnMenuAux");
	this.mnuCm = document.getElementById("mnuRoot");
	this.mnuAux = document.getElementById("mnuAux");
	
	this.selPageListYin = document.getElementById("pageList");
	this.selPageListAux = document.getElementById("pageList_hand");
	
	this.dpdnProcess = document.getElementById("dropdnProcess");
	this.dpdnChapterCm = document.getElementById("dpdnChapterCm");
	this.dpdnChapterAux = document.getElementById("dpdnChapterAux");
	this.dpdnTurnPage = document.getElementById("dpdnTurnPage");
	this.dpdnChapterTabs = document.getElementById("dpdnChapterTabs");
}


mysBooks.prototype.onPageListChange=function(e){
	this.mbJumpAnchor = true;
	location.href = "#" + base_List.htmlIdPrefix.page + "p" + e.options[e.selectedIndex].innerText + fetchEssayerIdTail();
}


mysBooks.prototype.doFillBook=function(bCM) {
	var src = (bCM ? this.cm : this.aux);
	
	if (src) {
		var aChapter = [];
		for (var ch in src) {
			if (ch == "ft") {
//					document.getElementById("toggleNote").disabled = (!this.cm[ch]["note"]);
//					document.getElementById("toggleLineNo").disabled = (!this.cm[ch]["lnNo"]);
			} else {
				aChapter.push(ch);
			}
		}
		
		fillDropdown(bCM, aChapter);
		
		openEssay(bCM, src[aChapter[0]], aChapter[0]);
	}
}


mysBooks.prototype.fillBook=function() {
	
	if (this.cm) {
		this.doFillBook(true);
	}
	else {
	  this.ctlShowYin.innerHTML = "<p>本單元尚未建立 ePub 檔。</p><p>請點按左上角【<span style='font-weight:bold;color:brown;'>期別</span>】按鈕，切換到【<span style='font-weight:bold;color:brown;'>講義</span>】，開啟右側選單，點選所要參閱的章節，再點按【<span style='background-color:lightgreen;'>到網頁</span>】連結，即可前往該文件網址。</p>";
	}
	
  this.fillHandout();
  this.fillPhase();
  
	this.doFillBook(false);
	showCM("content_0");
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
 	var nNonGroupIdx = 0;

	var s='<select id="selLesson" onchange="theBook.onLessonChange(this)" style="width:6em;"'+ 'data-mbpId="' + [masterId, this.bkId, phId].join(",") + '"> ';
	for(var i=0; i< out.length; i++) {
		var lpros=(out[i].p ? out[i].p : "");
	 	var sLiText = (out[i].sno ? out[i].sno : out[i].d);
 	

		if (out[i].url) {
			s+= '<option value="' + out[i].url + '" data-lpros="' +lpros+ '">' + sLiText + '</option>';

		if (lpros)
			aProcess.push('<p><a onclick=lessonProcessOnClick(' + nNonGroupIdx + ')><span style="color:blue;">' + sLiText + "</span>：" + lpros + "</a></p>");
		
			nNonGroupIdx++;
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

