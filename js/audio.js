
var aud;
var nPlayStart = 0;
var nPlayDuration = 0;


function onClassClick(e) {
	//alert(e.value + ', ' + e.selectedIndex);
	aud.src=e.value;
	nPlayStart = 0;
	nPlayDuration = 0;
}

function onPeriodClick(e) {
	document.getElementById('goSite').href=e.value;
	var p=e.options[e.selectedIndex].text.match(/\d+/g)[1];
	fillClass(p);
}


function fillPeriod(){
	var s='<select id="selPeriod" onchange="onPeriodClick(this);"> ';
	for(var i=0; i< kzpn_ffgl_period.length; i++) {
		s+= ' <option value="' + kzpn_ffgl_period[i].url + '">' + kzpn_ffgl_period[i].p + '</option>'
	}
	
	s+=" </select>";
	document.getElementById("dvPeriod").innerHTML = s;
}

function fillClass(period){
	var s='<select id="selClass" onchange="onClassClick(this);"> ';
	for(var i=0; i< ffgl_kr_pn.length; i++) {
		if(ffgl_kr_pn[i].p == period) {
			s+= ' <option value="' + ffgl_kr_pn[i].url + '">' + ffgl_kr_pn[i].d + '</option>';
		}
	}
	
	s+=" </select>";
	document.getElementById("dvClass").innerHTML = s;
}



function onLoad() {
	aud = document.getElementById("myAudio");
//	aud.ontimeupdate = onTimeUpdate;
	aud.addEventListener("timeupdate", onTimeUpdate);
	
	fillPeriod();
	onPeriodClick(document.getElementById('selPeriod'));
	
//	document.getElementById('goSite').href=document.getElementById('selPeriod').value;
//	fillClass();
}


function onTimeUpdate() {
	if(nPlayDuration<1) return;
//	document.getElementById("palyLength").value = aud.currentTime;
	if(aud.currentTime > (nPlayStart+nPlayDuration)) {
		aud.pause();
//		alert("End");
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
	aud.currentTime = nPlayStart;//document.getElementById("palyStart").value;
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
