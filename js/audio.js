
var aud;
var nPlayStart = 500;
var nPlayDuration = 5;

function onLoad() {
	aud = document.getElementById("myAudio");
//	aud.ontimeupdate = onTimeUpdate;
	aud.addEventListener("timeupdate", onTimeUpdate);
}

function onPlayDurationChange(e) {
	nPlayDuration = parseInt(e.value);
//	alert(nPlayDuration);
}


function onTimeUpdate() {
//	document.getElementById("palyLength").value = aud.currentTime;
	if(aud.currentTime > (nPlayStart+nPlayDuration)) {
		aud.pause();
//		alert("End");
	}
}

function cusPlay() {
//	var aud = document.getElementById("myAudio");
	aud.currentTime = document.getElementById("palyStart").value;
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
