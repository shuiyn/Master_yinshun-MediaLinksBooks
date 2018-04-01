
var aud, tblShowYin, ctlShowYin, tblShowAux, ctlShowAux;
var nPlayStart = 0;
var nPlayDuration = 0;
var mbIsPC = false;

//selBook: <value:bookId>bookName
function fillBook(){
	var arr = initUsedBook(); //傳回 類別
	var s = '<select id="selBook" onchange="onBookChange(this);"> ';
	
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
}


//selLecture: <value:lectureId>master_byear_croom
function fillLecture(bkid){
	var lecs=grabLecture(bkid);

	var s='<select id="selLecture" onchange="onLectureChange(this);"> ';
	for(var lecId in lecs) {
		s+= ' <option value="' + lecId + '">' + lecs[lecId] + '</option>'
	}
	
	s+=" </select>";
	document.getElementById("dvLecture").innerHTML = s;
		
	onLectureChange(document.getElementById('selLecture'));
}



function onLectureChange(e){
	fillPhase(e.value);
}



function fillPhase(lecId){
	var phs=grabPhase(lecId);
	var masterId=phs[0];
	var arr=phs[1];
	var s='<select id="selPhase" onchange="onPhaseChange(this)" ' + '" data-masterId="' + masterId + '"> ';
	
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

	var s='<select id="selLesson" onchange="onLessonChange(this)" '+ 'data-mbpId="' + [masterId, bkId, phId].join(",") + '"> ';
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

	var mbpId=e.getAttribute("data-mbpId");
	fillCue(mbpId, e.value); // e.value == url
	
	var bkid=e.options[e.selectedIndex].getAttribute("data-ybk");
	if(!bkid) ctl.innerHTML="";
	else {
		var ct=grabYbkCont(null,bkid);
		ctl.innerHTML = parseCont(ct);
	}
}



function fillCue(mbpId, url){
	var eCue=document.getElementById("cueList");
	var mp3Main = url.slice(url.lastIndexOf("/")+1, url.lastIndexOf("."));
	var mbp = mbpId.split(",");
	var aCuePoint = grabCue(mbp[0], mbp[1], mbp[2], mp3Main);
	
	if (aCuePoint) {
		aCuePoint.map(function(x){
			var opt = document.createElement("option");
			opt.text = x;
			eCue.add(opt);
		});
	} else {
		while (eCue.length > 0) eCue.remove(0);
	}
}



function parseCont(ct){
	var out=[];
	var swClass = (mbIsPC ? '<span class="srcwords_PC">' : '<span class="srcwords">');

	for(var lineId in ct){
		var aLine = ct[lineId];
		var pg = aLine[0];
		var fmt = aLine[1];
		var stl=book_fmt[lineId];
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
	
	return out.join("");
}



function onLoad() {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		mbIsPC = false;
	} else {
		mbIsPC = true;
	}

	document.getElementById("forTest").value = navigator.userAgent;

//	document.getElementById("content").height=document.body.scrollHeight/3*2;
//		alert(document.body.scrollHeight + ", " + document.getElementById("content").height + ", " + document.getElementById("content").scrollHeight);
	
	tblShowYin = document.getElementById("tblShowYin");
	tblShowAux = document.getElementById("tblShowAux");
	ctlShowYin = document.getElementById("content");
	ctlShowAux = document.getElementById("auxPanel");
	aud = document.getElementById("myAudio");
	aud.addEventListener("timeupdate", onTimeUpdate);
	fillBook();
}


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


function OpenBook() {
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
		var nLastFrom = aBrIdx.length - 2;
		
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
	toggleAux();
	toggleBR();
}



function toggleAux(){
	var btn = document.getElementById("toggleAux");

	if (btn.innerHTML == "輔") {
		btn.innerHTML = "文";
		tblShowYin.style.visibility = "visible";
		ctlShowYin.style.visibility = "visible";
			//visibility:collapse,visibility:visible,visibility:hidden
		tblShowAux.style.visibility = "collapse";
		ctlShowAux.style.visibility = "hidden";
	} else {
		if (!ctlShowAux.innerHTML) OpenBook();

		btn.innerHTML = "輔";
		ctlShowYin.style.visibility = "hidden";
		tblShowYin.style.visibility = "collapse";
		ctlShowAux.style.visibility = "visible";
		tblShowAux.style.visibility = "visible";
	}
}

function toggleBR(){
	var a = ctlShowAux.getElementsByClassName("falseBR");
	var sDisp = ctlShowAux.getAttribute("brMode");
	sDisp = (sDisp=="none" ? "block" : "none");
	ctlShowAux.setAttribute("brMode", sDisp);
	for(var i=0; i < a.length; i++) a[i].style.display = sDisp;
}

