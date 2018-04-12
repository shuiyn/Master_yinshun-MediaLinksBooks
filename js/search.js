
//var loadBook=function(bkid) {
//	var fs = require("fs");
//	var ct = fs.readFileSync("../data/book_List.js", "utf-8");
//	console.log(ct);
//}


//目前已建有 課程 的書目，非整個 books
var initUsedBook=function(){
	var out={}; //{bkid:bkName, ...}
	
	for(var id in lecture_List){
		var bkid = lecture_List[id].bkid;
		
		if (!out[bkid]) {
		//取得中文書名
			out[bkid] = base_List.books[bkid];
		}
	}
	
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
