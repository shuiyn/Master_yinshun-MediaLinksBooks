
var mysBooks = function(bkId, lecId) {
	this.bkId = bkId;
	this.lecId = lecId;
	this.phId = null;
	
	this.currDropBtn = null; ///章、目、進度 invoke btn
	this.currDropDown = null; ///章、目、進度 drop
	
	this.maTurning = [];
	this.mnTurningIdx = -1;
	
	this.cm; // course materials
	if(grabLecture(lecId,"cm") != undefined) {
		this.cm = eval(grabLecture(lecId,"cm"));
	}

	this.aux; // aux course materials
	if(grabLecture(lecId,"aux") != undefined) {
		this.aux = eval(grabLecture(lecId,"aux"));
	}
	
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
//	this.selPageListAux = document.getElementById("pageList_hand");
	
	this.dpdnProcess = document.getElementById("dropdnProcess");
	this.dpdnChapterCm = document.getElementById("dpdnChapterCm");
	this.dpdnChapterAux = document.getElementById("dpdnChapterAux");
	this.dpdnTurnPage = document.getElementById("dpdnTurnPage");
	this.dpdnChapterTabs = document.getElementById("dpdnChapterTabs");
}


mysBooks.prototype.onPageListChange=function(e){
	this.mbJumpAnchor = true;
	location.href = "#" + grabIdPrefix("page") + "p" + e.options[e.selectedIndex].innerText + fetchEssayerIdTail();
}


mysBooks.prototype.doFillBook=function(bCM) {
	var src = (bCM ? this.cm : this.aux);
	var lstTitle = "";
	
	if (src) {
		var aChapter = [];
		for (var ch in src) {
			if (ch == "ft") {
//					document.getElementById("toggleNote").disabled = (!this.cm[ch]["note"]);
//					document.getElementById("toggleLineNo").disabled = (!this.cm[ch]["lnNo"]);
			} else {
				if (src[ch].listT)
					lstTitle = src[ch].listT;
				else
					lstTitle = ch;
				
				aChapter.push([ch, lstTitle]);
			}
		}
		
		fillDropdown(bCM, aChapter);
		
		openEssay(bCM, src[aChapter[0][0]], aChapter[0][0]);
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
	var ht = grabLecture(this.lecId, "handout");
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


var onLessonProcessClick=function(selectedIndex) {
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
		var cid = out[i].cid || "";
	 	var sLiText = (out[i].sno ? out[i].sno : out[i].d);
 	

		if (out[i].url) {
			s+= '<option value="' + out[i].url + '" data-lpros="' +lpros+ '"' + ' data-cid="' + cid + '">' + sLiText + '</option>';

		if (lpros)
			aProcess.push('<p><a onclick=onLessonProcessClick(' + nNonGroupIdx + ')><span style="color:blue;">' + sLiText + "</span>：" + lpros + "</a></p>");
		
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
		$("#myAudio").attr("src", "");
//		theAud.aud.src = "";
//		alert(aud.src);為本站址
//		this.ctlShowYin.innerHTML = "";
		return;
	}

	var src = e.value;
	
	if (src.search(/youtu\.be/) > -1) {
		window.open(src);
	} else {
//		if (src.search(/https?:\/\//) != 0) {
//			src = hostImgURL("mp3") + this.phId + "/" + src;
//		}
			
		$("#myAudio").attr("src", src);
		theAud.playStart = 0;
	}
//	theAud.playDuration = 0;
	var mbp = e.getAttribute("data-mbpId").split(",");
	
	fillCues(grabCue(mbp[0], mbp[1], mbp[2], src), e.getAttribute("data-cid"));

}


var fillCues=function(aCue) {
	var dpdn = $("#dropdnCue");
	
	$("#btnDropdnCue").attr("disabled", !aCue);
	
	dpdn.empty();
	
	var cid = $("#selLesson :selected").attr("data-cid");
	var aCid = [];
	if (cid) {
		cid.split(",").map(function(t) {
			aCid.push(t.trim());
		});
	}
	
	if (aCue) {
		var nCurrCidPos = 0;
		
		for (var i=0; i < aCue.length; i++) {
			var elCuePoint = $("<a></a>").html("<span style='color:blue'>" + aCue[i].t + "</span> " + aCue[i].c);

			
			if (aCid.length > 0) {
				//此行之後，如不同 cid 需重新設入
				if (aCue[i].o) {
					nCurrCidPos = aCue[i].o;
				}
				
				elCuePoint.attr("onclick", 'onCuePointClicked($(this), "' + aCue[i].t + '","' + aCid[nCurrCidPos] + '")')
			} else {
				elCuePoint.attr("onclick", 'onCuePointClicked($(this), "' + aCue[i].t + '")')
			}
			
			dpdn.append(elCuePoint);

//			dpdn.append($("<a></a>").html("<span style='color:blue'>" + aCue[i].t + "</span> " + aCue[i].c).attr("onclick", 'theAud.cuePointPlay("' + aCue[i].t + '")'));
		}
	}
}


var onCuePointClicked=function(el, t, cid) {
	var dpdn = $("#dropdnCue");
	dpdn.children("a").each(function() {
//		console.log($(this).children("span:first").css("color"));
		
		//只能以 rgb(255, 0, 0) 形式判斷，red #ff0000 都錯
		if ($(this).children("span:first").css("color") == "rgb(255, 0, 0)") {
//			console.log($(this).children("span:first").text());
			$(this).children("span:first").css("color", "blue");
			return false;
		}
	});
	
	if (cid) {
		var jqTmp = $('#esyTitlePool').children('[data-chapid="' + cid + '"]');
//			jqTmp 是 DOM.element，不是 jq element ?
		//"ht-" 在 rawBookTo.parseChapter() 中加入的 
		var bCM = (cid.substr(0,2)=="h-" ? false : true);
		if (!bCM)
			cid = cid.substr(2);
		
		var dsrc = (bCM ? theBook.cm : theBook.aux);
		if (jqTmp.length == 0) {
			openEssay(bCM, dsrc[cid], cid, true);
		}
		else {
			showCM("content" + fetchEssayerIdTail(jqTmp[0].id), true);
//			showCM("content" + fetchEssayerIdTail(jqTmp[0].attr("id")), true);
		}
	}
	
	el.children("span:first").css("color", "red");
	var ma = el.text().match(/^(\s*\d+:\d+[ ]+)(p\d+)(L\d+)/);

	if (ma) {
		var bFrom = false;
		var sPgId = grabIdPrefix("page") + ma[2] + fetchEssayerIdTail();
		var sLnNo = ma[3].substr(1);
		var bHidden = false;
//		console.log("|" + sPgId + "|" + sLnNo + "|");
//		console.log($("#" + currEssayer(true)).find(".__pageNum,sup.falseBR"));

	if (ma[3]) {
//		console.log(ma[3], currEssayer(true));
		
		$("#" + currEssayer(true)).find(".__pageNum,sup.falseBR").each(function(i,e) {
			if (bFrom) {
				if (e.innerText == sLnNo) {
					if ($(this).css("display")=="none") {
						bHidden = true;
						$(this).toggle();
					}
					e.scrollIntoView();
					if (bHidden)
						$(this).toggle();

					return false;
				}
			} else {
				if ($(this).attr("id") == sPgId) {
					bFrom = true;
				}
			}
		});
	} //if (ma[3])
	else {
		location.href = "#" + grabIdPrefix("page") + ma[2] + fetchEssayerIdTail();
		
	}
} // //if (ma)
	
	theAud.cuePointPlay(t);
//	console.log(el.children("span:first").css("color"));
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
	
	var addZero=function(n) {
		if (n < 10) return "0" + n;
		else return n;
	}
	
	if (nType == 5 || nType == 6){ //copy
		var txt = $("title:first").text();
		var sCurrPgNum = $("#pageList" + fetchEssayerIdTail() + " :selected").text();
		var sSel = getSelection().toString();
		var lnNo = sSel.match(/^(\d+)(.*)/);
//console.log(lnNo, lnNo[0]);
		if (lnNo)
			sSel = "p" + sCurrPgNum + "L" + lnNo[1] + " " + lnNo[2]);
		else
			sSel = "p" + sCurrPgNum + " " + sSel;
		//全複製
		if (nType == 5) {
			//般若經講記：宗恆法師 104 般若精舍→12-23
			txt = txt.substr(0, txt.indexOf("／")) + "→"+ $("#selLesson :selected").text() + "\n" ;
			
			txt += '"p":"p' + sCurrPgNum + '","cue":[{"t":"' + (h == 0 ? "" : h + ":") + addZero(m) + ":" + addZero(s) + '","c":"' + sSel + '"}]';
		} else { //只複製 cue node {"t":"", "c":""}
			txt = ', {"t":"' + (h == 0 ? "" : h + ":") + addZero(m) + ":" + addZero(s) + '","c":"' + sSel + '"}';
		}
		
		var hid = $("<textarea></textarea>").val(txt).appendTo("body");
		hid.get(0).select();
		document.execCommand("copy");;
		$(hid).remove();
	}
	
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



mysAud.prototype.cusPlay=function(nType) {
	if (nType == 1) {
		/*
		 $.getScript({url:"../js/try_List.js", success:function(response,status){
				 alert(response);
				 var s = "books\n";
				 for (var x in try_List.books) {
				 	 s += try_List.books[x] + "\n"
				 }
				 
				 s += "\nmasters:\n"
				 for (var x in try_List.masters) {
				 	 s += try_List.masters[x] + "\n"
				 }
				 alert(s);

			 }
		 });
		 */

//$.ajax({async:false, url: "demo_ajax_script.js", dataType: "script"});

//$.ajax({url: "wrongfile.txt", error: function(xhr){
//            alert("An error occured: " + xhr.status + " " + xhr.statusText);
//        }});

//		$.ajax({async:false, url: "cue.txt", success: function(result){
//			alert(result);
////            $("#div1").html(result);
//        }});
        
		if (grabIdPrefix("funny") == $("#palyStartH").val()) {
			$("#playCusTime").attr("onclick","theAud.cusPlay()");
			$(".forMySelf").toggle();
			$("#palyStartH").val("0");
		}
		return;
	}
	
	this.playStart = this.getMS("palyStart");
//	this.playDuration = this.getMS("playDuration");
	this.aud.currentTime = this.playStart;
	this.aud.play();
}



mysAud.prototype.cuePointPlay=function(t){
	if(this.aud.networkState == 3){
		alert("沒有指定音檔");
		return;
	}
	
	var aHms = t.split(":");
	if(aHms.length < 3) aHms.unshift("0");

	var ct = 0;
	for(var i=0; i<aHms.length; i++){
		ct += parseInt(aHms[i])*[3600,60,1][i];
	}
	this.aud.currentTime = ct;
	this.aud.play();
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

