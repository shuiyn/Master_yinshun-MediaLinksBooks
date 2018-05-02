
var uaNotPC=function() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

//img 網站資料夾的路徑，供 menuTree 使用
var hostImgURL=function(fdn) {
	var sImgPath = location.pathname;
	fdn = fdn || "img";
	return ".".repeat(sImgPath.substr(sImgPath.lastIndexOf("Books/")).split("/").length-1) + "/" + fdn + "/";
}


//目前已建有 課程 的書目，非整個 books
var initUsedBook=function(){
	var out={}; //{bkid:bkName, ...}
	var aRet = [];
	
	for(var id in lecture_List){
		var bkid = lecture_List[id].bkid;
		
		if (!out[bkid]) {
		//取得中文書名
			out[bkid] = 1;
			aRet.push([bkid, base_List.books[bkid]]);
		}
	}
		//慧日的所有課程
		var aBook = ["十住毘婆沙論","大乘廣五蘊論","大乘廣五蘊論講記","大智度論","中阿含經選讀","中論","中觀今論","印度佛教史","如來藏之研究","成佛之道","佛在人間","佛法概論","妙雲集選讀","初期大乘佛教之起源與開展","空之探究","阿含經","青年的佛教","修定——修心與唯心．秘密乘","俱舍論","般若經講記","淨土學論集","華雨集選讀","學佛三要","雜阿含經論會編","寶積經講記"];

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



var grabLecture=function(bkid){
	var lst={}; //id:0001, 開仁法師 104 般若精舍
	for (var id in lecture_List) {
		var lec=lecture_List[id];
		if (lec.bkid == bkid) {
			lst[id] = [base_List.masters[lec.master], lec.byear, base_List.crooms[lec.croom]].join(" ");
		}
	}
	return lst;
}



var grabPhase=function(lecId){
	return [lecture_List[lecId].master, lecture_List[lecId].phase];
}



var grabLesson=function(masterId, bkId, phId){
	return lesson_List[masterId][bkId][phId];
}



//old: grabYbkCont("jkjjj","1.31~1.36") 同 slice：不含 36
//grabYbkCont("jkjjj","31~36") 同 slice：不含 36
var grabYbkCont_Old=function(bkid, lineScope){
	var ybk=book_jkjjj;
	var se=lineScope.split("~"); //Start & End Line
	if (!se[1]) se[1]="~~toEndOfFile";
	
	var bStart=false;
	var out={};
	//列號必為連續，且從 1 （程式從 0）計起
	//是否改為 for(var i=se[0]; i < se[1]; i++)
	//	out[lineId]=ybk[i];
	for(var lineId in ybk){
		if (!bStart) {
			if (lineId==se[0]) bStart=true;
		}

		if (bStart) {
			if (lineId==se[1]) break;
			out[lineId]=ybk[lineId];
		}
	}
	
	return out;
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



var grabCue=function(masterId, bkId, phId, mp3Id){
//	console.log(masterId, bkId, phId, mp3Id);
	if (cuePoint_List[masterId])
		if (cuePoint_List[masterId][bkId])
			if (cuePoint_List[masterId][bkId][phId])
				return cuePoint_List[masterId][bkId][phId][mp3Id];
}
