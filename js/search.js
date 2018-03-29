
//目前已建有 課程 的書目，非整個 books
var initUsedBook=function(){
	var arr=book_master_croom;
	var bk={}; //類別，書名 id
	
	for(var i=0; i<arr.length; i++){
		var sutra=arr[i].book;
		//取得中文書名
		if(!bk[sutra]){
			/*
			for(var j=0; j<books.length; j++){
				if(books[j].id==sutra){
					bk[sutra]=books[j].name;
					break;
				}
			}*/
			
			books.map(function(m){
				if(m.id==sutra){
					bk[sutra]=m.name;
					return; //map()內不可使用 break
				}
			});
		}
	}
	return bk;
}

//目前已建有 課程 的書目
var initMasterCourses=function(bk){
	var arr=book_master_croom;
	var lst=[]; //id:0001, 開仁法師 104 般若精舍
	var item={};
	
	for(var i=0; i<arr.length; i++){
		if(arr[i].book==bk){
			item={};
			item.id=arr[i].id;

			masters.map(function(m){
				if(m.id==arr[i].master){
					item.title=m.name;
					return; //map()內不可使用 break
				}
			});
			
			item.title+=" " + arr[i].byear + "年 ";

			crooms.map(function(m){
				if(m.id==arr[i].croom){
					item.title+=m.name;
					return; //map()內不可使用 break
				}
			});
			
			lst.push(item);
		}
	}
	return lst;
}



var grabPhaseById=function(courseId){
	var arr=null;
	try{
		arr= eval("phase_"+courseId);
	}
	catch(e){
	}
	return arr;
}

var grabCourse=function(courseId, phaseId){
	var arr=null;
	try{
		arr= eval("course_"+courseId);
	}
	catch(e){
		return;
	}
	
	var out=[];
	
	for(var i=0; i<arr.length; i++){
		if(arr[i].p==phaseId){
			out.push(arr[i]);
		}
	}
	
	return out;
}

