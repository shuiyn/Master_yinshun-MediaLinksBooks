
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



var grabYbkCont=function(bk, id){
//	var ybk=ybk_Diamond;
//	for(var i=0; i<ybk.length;i++){
//		if(ybk[i].id==id) return ybk[i].cnt;
//	}
//grabYbkCont(null,"1.31~1.36")
	var ybk=book_jkjjj;
	var be=id.split("~");
	if (!be[1]) be[1]="~~toEndOfFile";
	
	var bStart=false;
	var out={};
	for(var lineId in ybk){
		if (!bStart) {
			if (lineId==be[0]) bStart=true;
		}

		if (bStart) {
			if (lineId==be[1]) break;
			out[lineId]=ybk[lineId];
		}
	}
	
	return out;
}



var grabCue=function(masterId, bkId, phId, mp3Id){
//	console.log(masterId, bkId, phId, mp3Id);
	if (cue_List[masterId])
		if (cue_List[masterId][bkId])
			if (cue_List[masterId][bkId][phId])
				return cue_List[masterId][bkId][phId][mp3Id];
}
