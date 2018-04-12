
var aud, tblShowYin, ctlShowYin, tblShowAux, ctlShowAux;
var nPlayStart = 0;
var nPlayDuration = 0;
var mbIsPC = false;
var mbIs7inch = false;

//selBook: <value:bookId>bookName
function fillBook(){
//	loadBook("jkjjj");
//	window.open("file:///D:/gooSync/__20170809/PrgCode/GitHub/Master_yinshun-MediaLinksBooks/htm/cueSelect.htm");//"htm/cueSelect.htm");
//	return;
//	location.href = "htm/cueSelect.htm";
	
	var arr = initUsedBook(); //傳回 類別
	var s = '<select id="selBook" onchange="onBookChange(this);" style="width:7em;"> ';
	
	for(var b in arr){
		s+= ' <option value="' + b + '">' + arr[b] + '</option>'
	}
	
	s+=" </select>";
	document.getElementById("dvBook").innerHTML = s;

	onBookChange(document.getElementById('selBook'));
}


function onBookChange(e){
//	document.getElementById("bookURL").href = e.options[e.selectedIndex].getAttribute("data-url");
	fillLecture(e.value);
//		var ct = grabYbkCont(e.value, "0~");
//	rstElementWidth();
	ctlShowYin.innerHTML = "";
	ctlShowYin.innerHTML = parseCont(e.value); //, ct);
//	rstElementWidth();
}


//selLecture: <value:lectureId>master_byear_croom
function fillLecture(bkid){
	var lecs=grabLecture(bkid);

	var s='<select id="selLecture" onchange="onLectureChange(this);" style="width:10em;"> ';
	for(var lecId in lecs) {
		s+= ' <option value="' + lecId + '">' + lecs[lecId] + '</option>'
	}
	
	s+=" </select>";
	document.getElementById("dvLecture").innerHTML = s;
		
	onLectureChange(document.getElementById('selLecture'));
}



function onLectureChange(e){
	fillPhase(e.value);
	fillHandout(e.value);
}



function fillHandout(lecId){
	var ht = lecture_List[lecId].handout;
	var pnl = document.getElementById("pnlHandout");
	var s='<select style="width:7em;" id="selHandout" onchange="onHandoutChange(this)">';
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
		onHandoutChange(document.getElementById("selHandout"));
}



function onHandoutChange(e){
	var url = e.options[e.selectedIndex].value;
	document.getElementById("openHandout").href = url;
}



function fillPhase(lecId){
	var phs=grabPhase(lecId);
	var masterId=phs[0];
	var arr=phs[1];
	var s='<select id="selPhase" onchange="onPhaseChange(this)" style="width:7em;"' + '" data-masterId="' + masterId + '"> ';
	
	if (arr) {
		for(var i=0; i< arr.length; i++) {
			s+= ' <option value="' + arr[i].url + '" data-phid="' + arr[i].id+ '">' + arr[i].t + '</option>'
		}
	}
	s+=" </select>";
	document.getElementById("dvPhase").innerHTML = s;

	onPhaseChange(document.getElementById('selPhase'));
}


function onPhaseChange(e) {
//{"item":"ffgl", "master":"kr", "croom":"pn", "period":"9"}
	document.getElementById('goSite').href = e.value;
	var phId=e.options[e.selectedIndex].getAttribute("data-phid");
	var bkId = document.getElementById('selBook').value;
	var masterId = e.getAttribute("data-masterId");
//	console.log("bkId", bkId,"phId",phId,"masterId",masterId);

	var out = grabLesson(masterId, bkId, phId);
	
	fillLesson(out, masterId, bkId, phId);
}



function fillLesson(out, masterId, bkId, phId){
 	var bGroup = false;

	var s='<select id="selLesson" onchange="onLessonChange(this)" style="width:5em;"'+ 'data-mbpId="' + [masterId, bkId, phId].join(",") + '"> ';
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

	onLessonChange(document.getElementById('selLesson'));
}



function onLessonChange(e) {
	var ctl=document.getElementById("content");

	if(!e.value){
		aud.src="";
//		alert(aud.src);為本站址
		ctl.innerHTML="";
		return;
	}
	
	aud.src=e.value;
	nPlayStart = 0;
	nPlayDuration = 0;

	var mbp = e.getAttribute("data-mbpId").split(",");
	fillCue(mbp, e.value); // e.value == url
	
	var lineScope = e.options[e.selectedIndex].getAttribute("data-ybk");
//	if(!lineScope)
//		ctl.innerHTML="";
//	else {
//		var ct = grabYbkCont(mbp[1], lineScope);
//		ctl.innerHTML = parseCont(mbp[1], ct);
//	}
}

function TryScroll(ev) {
	window.scrollTo(0, 0);
//	ev.preventDefault();
//	document.getElementById("demobody").innerHTML = ev.type + ", " + ev.target.id;
//	ev.cancelBubble = true;
}

function parseCont(bkId){
	createMenu(bkId);
	var pgList = document.getElementById("pageList");
	while (pgList.length > 0) pgList.remove(0);
		
	var ct = book_List[bkId];
	var pgIdPfx = base_List.htmlIdPrefix.page;
	var tocIdPfx = base_List.htmlIdPrefix.toc;
	var paraIdPfx = base_List.htmlIdPrefix.para;
	
	var out=[];
	var swClass = (mbIsPC ? '<span class="srcwords_PC">' : '<span class="srcwords">');

	for(var lineId=0; lineId < ct.length; lineId++){
//		var aLine = ct[lineId];
//		var pg = aLine[0];
//		var fmt = aLine[1];
		var pg = ct[lineId].c;
		var fmt = ct[lineId].lev;
//		var fmt = ct[lineId].bs;
		var stl; //=bookFmt_List[bkId][lineId];
		var sTocSty = "";
		
		if (bookFmt_List[bkId])
			stl=bookFmt_List[bkId][lineId];
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


function parseCont_Old(bkId, ct){
	var out=[];
	var swClass = (mbIsPC ? '<span class="srcwords_PC">' : '<span class="srcwords">');

	for(var lineId in ct){
//		var aLine = ct[lineId];
//		var pg = aLine[0];
//		var fmt = aLine[1];
		var pg = ct[lineId].c;
		var fmt = ct[lineId].lev;
//		var fmt = ct[lineId].bs;
		var stl=bookFmt_List[bkId][lineId];
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
				pg='<h3 style="color:darkblue;font-weight:bold">' + pg + "</h3>";
			}
		} else {
			pg="<p>" + pg + "</p>";
		}
		
		out.push(pg);
	}
	
//	return out.join("");
	return out.join("").replace(/\[p\d+\]/g,function(x){
		return '<hr/><p style="color:blue;">' + x + "</p>";
	});
}



function fillCue(mbp, url){
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



function onLoad() {
	var ua = navigator.userAgent;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ) {
		mbIsPC = false;
	} else {
		mbIsPC = true;
	}
	
	document.getElementById("forTest").value = ua;

//	document.getElementById("content").height=document.body.scrollHeight/3*2;
//		alert(document.body.scrollHeight + ", " + document.getElementById("content").height + ", " + document.getElementById("content").scrollHeight);
	
	tblShowYin = document.getElementById("tblShowYin");
	tblShowAux = document.getElementById("tblShowAux");
	ctlShowYin = document.getElementById("content");
	ctlShowAux = document.getElementById("auxPanel");
	aud = document.getElementById("myAudio");
	aud.addEventListener("timeupdate", onTimeUpdate);

	mbIs7inch = false;
	if (!mbIsPC) { //華為 7 吋
		if (/PLE-7/i.test(ua)) {
			mbIs7inch = true;
			ctlShowYin.style.height = "23em";
			ctlShowAux.style.height = "23em";
		}
		ctlShowYin.style.fontSize = "90%";
		ctlShowAux.style.fontSize = "90%";
		
		document.getElementById("dlgPagToc").style.width = "90%";
//		ctlShowYin.style.width = "99%";
//		ctlShowAux.style.width = "99%";
	} else {
		ctlShowYin.style.fontSize = "110%";
		ctlShowAux.style.fontSize = "110%";
	}

	fillBook();
}

	/*
function rstElementWidth() {
	if (mbIsPC) return;
	
	tblShowYin.style.width = "99%";
	tblShowAux.style.width = "99%";

	ctlShowYin.style.fontSize = "90%";
	ctlShowAux.style.fontSize = "90%";
	ctlShowYin.style.width = "99%";
	ctlShowAux.style.width = "99%";

	if (mbIs7inch) { //華為 7 吋
		ctlShowYin.style.height = "23em";
		ctlShowAux.style.height = "23em";
	}

}
*/


function onTimeUpdate() {
	if(nPlayDuration<1) return;
//	document.getElementById("palyLength").value = aud.currentTime;
	if(aud.currentTime > (nPlayStart+nPlayDuration)) {
		aud.pause();
	}
}

function getMS(sId) {
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

function cusTime(nType) {
	var t=aud.currentTime;
	var h=Math.floor(t/3600);
	var m=Math.floor((t % 3600)/60);
	var s=Math.floor(t % 60);

	if(nType==1){ //start
		nPlayStart=t;
		document.getElementById("palyStartH").value=h;
		document.getElementById("palyStartM").value=m;
		document.getElementById("palyStartS").value=s;
	}else{
nPlayDuration = aud.currentTime-nPlayStart;
t=nPlayDuration;
		document.getElementById("playLengthH").value=Math.floor(t/3600);
		document.getElementById("playLengthM").value=Math.floor((t % 3600)/60);
		document.getElementById("playLengthS").value=Math.floor(t % 60);
	}
}

function cusPlay() {
//	var aud = document.getElementById("myAudio");
	nPlayStart = getMS("palyStart");
	nPlayDuration = getMS("playDuration");
	aud.currentTime = nPlayStart;
	aud.play();
}



function cusPlay_JQ() {
//	var aud = document.getElementById("myAudio");
	var aud = $('#myAudio');
	alert($('#myAudio'));
//	var palyStart = $("#palyStart");
	aud.currentTime = 500; //$("#palyStart").value;
//	aud.currentTime = document.getElementById("palyStart").value;
//	aud.play();
}

function dotPlay(hms){
	var a=hms.split(":");
	var h=0,m=0;
	var s=parseInt(a[a.length-1]);
	if(a.length>2) h=parseInt(a[a.length-3]);
	if(a.length>1) m=parseInt(a[a.length-2]);
//	nPlayStart = getMS("palyStart");

	aud.currentTime = (h*3600)+(m*60)+s;//nPlayStart;
	aud.play();
}


function forbakward(mode){
	if(mode==1)//後退
		aud.currentTime-=10;
	else
		aud.currentTime+=10;
}


/*
aud.networkState：Number, Represents the current network state of the audio/video element:
	0 = NETWORK_EMPTY - audio/video has not yet been initialized
	1 = NETWORK_IDLE - audio/video is active and has selected a resource, but is not using the network
	2 = NETWORK_LOADING - browser is downloading data
	3 = NETWORK_NO_SOURCE - no audio/video source found
*/

function cuePointPlay(){
	if(aud.networkState==3){
		alert("沒有指定音檔");
		return;
	}
	var ctl=document.getElementById("cueList");
	if(ctl.options.length==0) return;
	var aHms=ctl.options[ctl.selectedIndex].text.split(" ")[0].split(":");
	if(aHms.length<3) aHms.unshift("0");

	var ct=0;
	for(var i=0; i<aHms.length; i++){
		ct+=parseInt(aHms[i])*[3600,60,1][i];
	}
	aud.currentTime=ct;//parseInt(aHms[0])*60+parseInt(aHms[1]);
	aud.play();
}


function openAuxBook() {
	var fn = "真常大我_真常妙有";
	//var fs=require("fs");
	//var aLine = fs.readFileSync("data/" + fn + "_pure.txt", "utf8").split(/\r?\n/);
	//var lstParaLine = JSON.parse(fs.readFileSync("data/" + fn + ".json", "utf8"));

	var aLine = auxData_List[fn];
	var lstParaLine = auxJSON_List[fn];

	var doParseBR=function(sPara, nParaIdx){
	var aBrIdx = lstParaLine[nParaIdx];
//	var aBrIdx = lstParaLine.P[nParaIdx];
	
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
	ctlShowAux.innerHTML = out.join("").replace(/\[p\d+\]/g,function(x){
		return '<hr/><p style="color:blue;">' + x + "</p>";
	});
//	toggleAux();
	toggleBR();
}



function toggleAux(){
	if (!ctlShowAux.innerHTML) openAuxBook();
	
	doToggle("toggleAux", ["文", "輔"], ["tblShowYin", "tblShowAux"],null,["content", "auxPanel"]);
	return;
	
	var btn = document.getElementById("toggleAux");

	if (btn.innerHTML == "輔") {
		btn.innerHTML = "文";
		tblShowYin.style.visibility = "visible";
		ctlShowYin.style.visibility = "visible";
			//visibility:collapse,visibility:visible,visibility:hidden
		tblShowAux.style.visibility = "collapse";
		ctlShowAux.style.visibility = "hidden";
	} else {
		if (!ctlShowAux.innerHTML) openAuxBook();

		btn.innerHTML = "輔";
		ctlShowYin.style.visibility = "hidden";
		tblShowYin.style.visibility = "collapse";
		ctlShowAux.style.visibility = "visible";
		tblShowAux.style.visibility = "visible";
	}
}

function toggleBR(){
	var btn = document.getElementById("toggleBR");

	var a = ctlShowAux.getElementsByClassName("falseBR");
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



function toggleHandout(){
	doToggle("toggleHandout", ["期別", "講義"], ["tblShowPhrase", "tblShowHandout"], ["tdPhrase", "tdHandout"]);
}



function toggleStartLen(){
	doToggle("toggleStartLen", ["於", "長"], ["tblPlayStart", "tblPlayLen"]);
}



function copyDeviceUA(value){
	var x = document.createElement("INPUT");
	x.setAttribute("type", "text");
	document.body.appendChild(x);
	x.value = value;
	x.select();
	document.execCommand("Copy");
	document.body.removeChild(x);
}




//pageList.onchange
function showPageTocSelect(e){
	document.getElementById("dlgPagToc").showModal();
}


function onPageListChange(e){
	location.href = "#" + base_List.htmlIdPrefix.page + "p" + e.options[e.selectedIndex].innerText;
	document.getElementById("dlgPagToc").close();
}

function openBookWin(bkId) {
	window.open("./htm/" + bkId + ".html");
	localStorage.setItem("mys_BookId", bkId);
}
