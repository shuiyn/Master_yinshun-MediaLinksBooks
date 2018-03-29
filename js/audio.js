
var aud;
var nPlayStart = 0;
var nPlayDuration = 0;


function fillBook(){
	var arr=initUsedBook(); //傳回 類別
	var s='<select id="selBook" onchange="onBookChange(this);"> ';
	
//	for(var b in arr){
//		s+= ' <option value="' + b + '">' + arr[b] + '</option>'
//	}
	for(var i=0; i< arr.length; i++) {
		s+= ' <option value="' + arr[i].id + '" data-url="' + arr[i].url + '">' + arr[i].name + '</option>'
	}
	
	s+=" </select>";
	document.getElementById("dvBook").innerHTML = s;

	onBookChange(document.getElementById('selBook'));
}


function onBookChange(e){
//	document.getElementById("bookURL").href = e.options[e.selectedIndex].getAttribute("data-url");

	fillMasterCourse(e.value);
}

function fillMasterCourse(bookId){
	var arr=initMasterCourses(bookId);

	var s='<select id="selMaster" onchange="onMasterCourseChange(this);"> ';
	for(var i=0; i< arr.length; i++) {
		s+= ' <option value="' + arr[i].id + '">' + arr[i].title + '</option>'
	}
	
	s+=" </select>";
	document.getElementById("dvMaster").innerHTML = s;
		
	onMasterCourseChange(document.getElementById('selMaster'));
}


function onMasterCourseChange(e){
	fillPhase(e.value);
}

function fillPhase(courseId){
	var arr=grabPhaseById(courseId);
	var s='<select id="selPhase" onchange="onPhaseChange(this);"> ';
	
	if(arr){
		for(var i=0; i< arr.length; i++) {
			s+= ' <option value="' + arr[i].url + '">' + arr[i].p + '</option>'
		}
	}
	s+=" </select>";
	document.getElementById("dvPhase").innerHTML = s;

	onPhaseChange(document.getElementById('selPhase'));
}

function onPhaseChange(e) {
//{"item":"ffgl", "master":"kr", "croom":"pn", "period":"9"}
	document.getElementById('goSite').href=e.value;
	var courseId=document.getElementById('selMaster').value;
	
	var pa=e.options[e.selectedIndex].text.match(/\d+/g);
	var p=pa[pa.length-1];
	
//var tofind = {"item":"ffgl", "master":"kr", "croom":"pn"};//, "period":"9"};
//	tofind.period = p;
	var out = grabCourse(courseId, p);//search(tofind);

	fillClass(out);
}




function onClassChange(e) {
	var ctl=document.getElementById("content");

	if(!e.value){
		aud.src="";
		ctl.innerHTML="";
		return;
	}
	
	aud.src=e.value;
	nPlayStart = 0;
	nPlayDuration = 0;
	
	var bkid=e.options[e.selectedIndex].getAttribute("data-ybk");
	if(!bkid) ctl.innerHTML="";
	else ctl.innerHTML=grabYbkCont(null,bkid);
}


function fillClass(out){
	var s='<select id="selClass" onchange="onClassChange(this);"> ';
	for(var i=0; i< out.length; i++) {
		var bkid=(out[i].ybk ? out[i].ybk : "");
		s+= ' <option value="' + out[i].url + '" data-ybk="' +bkid+ '">' + out[i].d + '</option>';
	}
	
	s+=" </select>";
	document.getElementById("dvClass").innerHTML = s;

	onClassChange(document.getElementById('selClass'));
}


function onLoad() {
	aud = document.getElementById("myAudio");
	aud.addEventListener("timeupdate", onTimeUpdate);
	
	fillBook();
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
