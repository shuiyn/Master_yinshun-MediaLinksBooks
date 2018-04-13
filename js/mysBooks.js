
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

//	document.getElementById("try").innerHTML = ",pc= " + this.mbIsPC + ", 7in= " + this.mbIs7inch;

}


mysBooks.prototype.showPageTocSelect=function(){
	document.getElementById("dlgPagToc").showModal();
}


mysBooks.prototype.onPageListChange=function(){
	location.href = "#" + base_List.htmlIdPrefix.page + "p" + e.options[e.selectedIndex].innerText;
	document.getElementById("dlgPagToc").close();
}


mysBooks.prototype.TryScroll=function(ev) {
	window.scrollTo(0, 0);
//	ev.preventDefault();
//	document.getElementById("demobody").innerHTML = ev.type + ", " + ev.target.id;
//	ev.cancelBubble = true;
}

mysBooks.prototype.rstCtrlStyle1=function() {
	alert(this.ctlShowYin);
	if (!this.mbIsPC) { //華為 7 吋
		if (this.mbIs7inch) {
			this.ctlShowYin.style.fontSize = "90%";
			this.ctlShowAux.style.fontSize = "90%";
			this.ctlShowYin.style.height = "37em";
			this.ctlShowAux.style.height = "40em";
		} else {
		this.ctlShowYin.style.fontSize = "105%";
		this.ctlShowAux.style.fontSize = "105%";
			this.ctlShowYin.style.height = "32em";
			this.ctlShowAux.style.height = "32em";
		}
		
		this.tblShowYin.style.width = "99%";
		this.tblShowAux.style.width = "99%";
			this.ctlShowYin.style.width = "99%";
			this.ctlShowAux.style.width = "99%";
		
		//document.getElementById("dlgPagToc").style.width = "90%";
		
//		ctlShowYin.style.width = "99%";
//		ctlShowAux.style.width = "99%";
	} else {
		this.ctlShowYin.style.fontSize = "110%";
		this.ctlShowAux.style.fontSize = "110%";
	}
//	alert(this.mbIs7inch);
}



function tryShow() {
	var wInnerH = window.innerHeight;
	var nTop = theBook.tblShowYin.offsetTop;
	var nHei = theBook.tblShowYin.offsetHeight;
	document.getElementById("try").innerHTML = nTop + ", " + nHei + ",wh " + wInnerH + ", sh= " + screen.availHeight;
	
	var nDiffH = (wInnerH - nTop - 10);// + "px"
	theBook.tblShowYin.style.height = nDiffH  + "px";
	theBook.ctlShowYin.style.height = (nDiffH-10)  + "px";
	theBook.tblShowAux.style.height = nDiffH  + "px";
	theBook.ctlShowAux.style.height = (nDiffH-10)  + "px";
}


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



