
var mysBooks = function(bkId) {
	this.bkId = bkId;
	this.book = eval(this.bkId + "_book");
	this.bookStyle = eval(this.bkId + "_style");
//	this.handout = eval(this.bkId + "_handout");
	this.mbIsPC = false;
	this.mbIs7inch = false;

	this.tblShowYin = document.getElementById("tblShowYin");
	this.tblShowAux = document.getElementById("tblShowAux");
	this.ctlShowYin = document.getElementById("content");
	this.ctlShowAux = document.getElementById("auxPanel");
//	this.aud = document.getElementById("myAudio");
//	this.aud.addEventListener("timeupdate", onTimeUpdate);

//	document.getElementById("try").innerHTML = ",pc= " + this.mbIsPC + ", 7in= " + this.mbIs7inch;

//	document.getElementById("content").value = "two";
//	document.getElementById("forTest").value = ua;

	
}


mysBooks.prototype.rstCtrlStyle=function() {
	alert(this.mbIsPC);
	if (!this.mbIsPC) { //華為 7 吋
		this.ctlShowYin.style.fontSize = "90%";
		this.ctlShowAux.style.fontSize = "90%";
		if (this.mbIs7inch) {
			this.ctlShowYin.style.height = "23em";
			this.ctlShowAux.style.height = "23em";
		}
		
		//document.getElementById("dlgPagToc").style.width = "90%";
		
//		ctlShowYin.style.width = "99%";
//		ctlShowAux.style.width = "99%";
	} else {
		this.ctlShowYin.style.fontSize = "110%";
		this.ctlShowAux.style.fontSize = "110%";
	}
	alert(this.mbIs7inch);
}



mysBooks.prototype.parseCont = function(){
//	createMenu(this.bkId);
//	var pgList = document.getElementById("pageList");
//	while (pgList.length > 0) pgList.remove(0);
		
	var ct = this.book;
	var styBook = this.bookStyle;
	var pgIdPfx = base_List.htmlIdPrefix.page;
	var tocIdPfx = base_List.htmlIdPrefix.toc;
	var paraIdPfx = base_List.htmlIdPrefix.para;
	
	var out=[];
	var swClass = (this.mbIsPC ? '<span class="srcwords_PC">' : '<span class="srcwords">');

	for(var lineId=0; lineId < ct.length; lineId++){
//		var aLine = ct[lineId];
//		var pg = aLine[0];
//		var fmt = aLine[1];
		var pg = ct[lineId].c;
		var fmt = ct[lineId].lev;
//		var fmt = ct[lineId].bs;
		var stl; //=bookFmt_List[this.bkId][lineId];
		var sTocSty = "";
		
		if (styBook)
			stl=styBook[lineId];
//		var stl=book_fmt[lineId];
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
				sTocSty = "margin-left:" + (Number(ct[lineId].lev) * 0.5) + "em;";
				if (lineId > 0 && ct[lineId-1].lev) {
					sTocSty += "margin-top:0;";
				}
				if (lineId < ct.length-1 && ct[lineId+1].lev) {
					sTocSty += "margin-bottom:0;";
				}

				pg='<h4 style="color:darkblue;font-weight:bold;' + sTocSty + '" id="' + tocIdPfx + ct[lineId].a + '">' + pg + "</h4>";
			}
		} else {
			pg="<p>" + pg + "</p>";
		}
		
		out.push('<span style="display:none;" id="' + paraIdPfx + lineId + '">' + (lineId+1) + '</span>' + pg);
	}
	
//	return out.join("");
	//頁次 Id、selectPage-Option
	return out.join("").replace(/\[p[a-z]?\d+\]/g,function(x){
		var ma = x.match(/\[(p[a-z]?\d+)\]/);
		var opt = document.createElement("option");
		opt.text = ma[1].substr(1);
//		pgList.add(opt);
		return '<hr/><p id="' + pgIdPfx + ma[1] + '" style="color:blue;">' + x + "</p>";
	});
}



