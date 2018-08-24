
//目前已建有 課程 的書目，非整個 books
var initUsedBook=function(){
	var out={}; //{bkid:bkName, ...}
	var aRet = [];

	for(var id in lecture_List){
		var bkid = lecture_List[id].bkid;
		
//只取 pn
//		if (!out[bkid]) {
		if (!out[bkid] && (gBookScope().indexOf(lecture_List[id].croom) > -1 )) {
		//取得中文書名
			out[bkid] = 1;
			aRet.push([bkid, base_List.books[bkid]]);
		}
	}
		//慧日的所有課程
		var aBook = ["十住毘婆沙論","大乘廣五蘊論","大乘廣五蘊論講記","大智度論","中阿含經選讀","中論","中觀今論","印度佛教史","如來藏之研究","成佛之道","佛在人間","佛法概論","妙雲集選讀","初期大乘佛教之起源與開展","空之探究","阿含經","青年的佛教","修定——修心與唯心．秘密乘","俱舍論","般若經講記","淨土學論集","華雨集選讀","學佛三要","雜阿含經論會編","寶積經講記","摩訶般若波羅蜜經","攝大乘論"];

	aRet.sort(function(a,b) {
		var cmp=function(s) {
			return aBook.findIndex(function(m) {
				return (m.search(s.replace(/《|》/g, "")) > -1);
			});
		}
		
		var n1 = cmp(a[1]);
		var n2 = cmp(b[1]);
		
		return (n1-n2);
	});
	
	out={};
	aRet.map(function(a){
		out[a[0]] = a[1];
	});
	
	return out;
}


var gBookScope=function(){
	//reside in dataSrc/localHome.js
	if (typeof grabBookScope != "undefined")
		return grabBookScope();
	else
		return "pn mp xf";
}


//for index.html
var grabLecturesInBook=function(bkid){
	var lst={}; //id:0001, 開仁法師 104 般若精舍
	for (var id in lecture_List) {
		var lec=lecture_List[id];
//		if (lec.bkid == bkid) {
//只取 pn
		if (lec.bkid == bkid && (gBookScope().indexOf(lec.croom) > -1)) {
			lst[id] = [base_List.masters[lec.master], lec.byear, base_List.crooms[lec.croom]].join(" ");
		}
	}
	return lst;
}


//網頁標題
var grabLecTitle=function(lecId){
	var lec = lecture_List[lecId];
	
	return base_List.books[lec.bkid] + "：" + [base_List.masters[lec.master], lec.byear, base_List.crooms[lec.croom]].join(" ");
}

var grabLecture=function(lecId, which){
	if (which)
		return lecture_List[lecId][which];
	else
		return lecture_List[lecId];
}


var grabPhase=function(lecId){
	return [lecture_List[lecId].master, lecture_List[lecId].phase];
}



var grabLesson=function(masterId, bkId, phId){
	return lesson_List[masterId][bkId][phId];
}


var grabBookName=function(which){
	return base_List.books[which];
}

var grabIdPrefix=function(which){
	return base_List.htmlIdPrefix[which];
}


var grabYbkCont=function(bkId, lineScope){
	var ybk=book_List[bkId];
	var se=lineScope.split("~"); //Start & End Line
	
	se[0] = Number(se[0]);
	if (!se[1])
		se[1] = ybk.length;
	else
		se[1] = Number(se[1]);
	
	var out={};
	for(var i = se[0]; i < se[1]; i++){
		out[i]=ybk[i]; //out 另加入 列號
	}
	
	return out;
}



var grabCue=function(masterId, bkId, phId, mp3url){
	var aCue = null;
	
	if (lesson_List[masterId])
		if (lesson_List[masterId][bkId])
			if (lesson_List[masterId][bkId][phId])
				aCue = lesson_List[masterId][bkId][phId];
	
	if (aCue) {
		for (var i=0; i < aCue.length; i++) {
			if (aCue[i].url == mp3url) {
				return (aCue[i].cue);
			}
		}
	}
}

