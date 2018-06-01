/*
需要斷行者：
	noteArea

*/

//var kEssay=function(divRoot, jsnChapter, selPageList, idTail) {
var kEssay=function(jqRoot, jqPage, jsnChapter, idTail, idEsyerTitle) {
	jqRoot.empty();
	jqPage.empty();
	
	this.jqDivRoot = jqRoot;
	this.jqSelPageList = jqPage;
	this.msIdTail = idTail || "";
	this.msIdEsyerTitle = idEsyerTitle;
	this.mbSetEsyerTitle = false;
	this.esyerTitlePrevDiv = null;
	
//	this.addChapTool();
	
	this.aLine = jsnChapter.c;
	this.mnStartMarginLev = 3; // margin-left 開始設值的 level，1 是「節」
	if (jsnChapter.mlStartLev != undefined)
		this.mnStartMarginLev = jsnChapter.mlStartLev;
	// pgNum -> [p[a-z]?\d+]
	
	this.mbHasLineNum = true;
	if (jsnChapter.lnNo != undefined)
		this.mbHasLineNum = (jsnChapter.lnNo != 0);
	
	this.maToc = [];
	this.paraText = [];
	this.paraSty = [];
	this.nIdxInPara = 0;
	this.mnReadExtra = 0; //在 transData() 外，額外已讀行數
	this.mnJsnCount = 0; //當行所有 jsn 數
	this.jsPara = null;

	this.bOverParaTag = false;//是否已過第１個 [pxx]，行號才歸 0
	this.jqCurrDiv = this.jqDivRoot;//目前增入、處理中的 <div>，divRoot 或新增的
	this.jqCurrPara = null;//目前增入、處理中的 <p>
	
	this.nRowCount = 1; //各頁所有行的行號，人讀、從 1 起計
	this.mnPrevLev = -1; // > -1 表示已有 toc item
	this.mbPrevParaIsNTDno = false; //前段是否全段 = 註釋的註序號
	this.mbFitDevice = true; // Kag Line 是否適用裝置
	this.moTable = null;
//	this.nTry = 0;
}


kEssay.prototype.addChapTool=function() {
//	var jqChapTool = $("<div></div>").css({"position":"sticky", "top":0, "text-align":"right"});
	var jqChapTool = $("<div></div>").css({"position":"sticky", "top":0, "width":"100%", "margin":0, "padding":0});
	jqChapTool.append($("<div></div>").css({"position":"relative", "text-align":"center", "margin":0, "padding":0}).attr("id", "esyerTitle" + this.msIdTail).text("some"));
	//.text("some"));
	
	jqChapTool.append($("<div></div>").css({"position":"absolute", "top":"0", "right":"0"}).append($('<button onclick="closeEssay()" class="dropbtn">✖</button>')));
//	jqChapTool.append($('<button onclick="tglDropDown(this, 1)" class="dropbtn">目</button>'));
//	jqChapTool.append('<div id="dpdnChapterCmxx" class="dropdown-content" style="height:18em;width:5em;margin:0;padding:2px;"></div>');
//		jqChapTool.append('<select style="width:4em;font-size:95%;" id="pageListx" onchange="theBook.onPageListChange(this)"></select>');
////		jqChapTool.append("<span>　</span>");


//		jqChapTool.append($('<button onclick="closeEssay()" class="dropbtn">✖</button>'));

	$("#esyTitlePool").append(jqChapTool);
//	this.jqDivRoot.append(jqChapTool);
}


kEssay.prototype.NewPara=function() {
	this.paraText = [];
	this.paraSty = [];
	this.nIdxInPara = 0;
	this.mnReadExtra = 0; //在 transData() 外，額外已讀行數
	this.mnJsnCount = 0; //當行所有 jsn 數
	this.jsPara = null;
	this.jqCurrPara = null;
//	this.mbPrevParaIsNTDno = false; 不可清除，影響 LineNo 要否寫入
}


kEssay.prototype.transData=function() {
	var sLine, jsn;

	//nLnIdx <= this.aLine.length 過１行，以確後最１行讀入
	for (var nLnIdx = 0; nLnIdx <= this.aLine.length; nLnIdx++) {
		sLine = this.aLine[nLnIdx];

		if (!sLine || nLnIdx == this.aLine.length) {
			if (this.paraText.length == 0)
				continue;
			
			this.stuffPara(nLnIdx);
			
			if (!this.mbSetEsyerTitle) {
				this.mbSetEsyerTitle = true;
				this.jqCurrPara.css({"margin":0,"padding-top":8,"padding-bottom":8}).appendTo($("#" + this.msIdEsyerTitle));
			}
			
			this.NewPara();
			
			if (nLnIdx >= this.aLine.length)
				break;
			else
				continue;
		}

		//轉換 圖檔 在 host 的路徑
		if (/@@\{img\/\}/.test(sLine)) {
			sLine = sLine.replace(/@@\{img\/\}/g, hostImgURL());
		}

		jsn = this.isKagLine(sLine, nLnIdx);
		if (!this.mbFitDevice)
			continue;
		
		if (jsn) {
			this.processUnLined(jsn, nLnIdx);
			nLnIdx += this.mnReadExtra;
			
			this.parseJSON(jsn, nLnIdx);
			
		} //eof if (/^\^\^\{.*?\}$/.test(sLine))
		else if (sLine.startsWith("<img ")){
			this.jqCurrDiv.append(sLine);
		}
		else { //非標記行、即實體文字行
			var aPageNumTag = sLine.match(/\[p[a-z]?\d+\]/g);
			var tagPageNum = null;
			if (aPageNumTag) {
				tagPageNum = aPageNumTag[0];
			}
			
			var jTmpLine = null;
			
			if (this.mbHasLineNum) {
				//文章標題不計入行號
				if (!this.moTable && this.mbSetEsyerTitle) {
					//一行只有一個 tagPageNum 時，才會有tagPageNum == sLine
					if (tagPageNum != sLine && !this.mbPrevParaIsNTDno) {
						jTmpLine = {"ln":[this.nIdxInPara, null, this.nRowCount]};
						this.paraSty.push(jTmpLine); //✖unshift 置首，以免被其他 tag <span> 等包住而誤顯，parseParaStyle() 已有相應作為
					}
					
					//全段的末行、或同一行已含 true br 者，不另加 false br
					if (!this.paraSty.find(function(s){return (s["br"])})) {
						if (nLnIdx < this.aLine.length-1 && this.aLine[nLnIdx+1]) {
							var jTmpF_Br = {"f_br":[null, this.nIdxInPara + sLine.length]};
							this.paraSty.push(jTmpF_Br);
						}
					}
				}
			}
				
			this.paraText.push(sLine);
				
			if (aPageNumTag) {
				//pgNum 不存在同一類別內，∴不必加序號
				for (var i=0; i < aPageNumTag.length; i++) {
					this.paraSty.push({"pgNum":[this.nIdxInPara + sLine.indexOf(aPageNumTag[i]), aPageNumTag[i].length, aPageNumTag[i]]});
				}
				
				if (this.bOverParaTag)
					this.nRowCount = 0; //新段開始，下面 ++ 重設行號 1 起計
				else
					this.bOverParaTag = true;

//						jTmpLine = {"ln":[this.nIdxInPara, null, this.nRowCount]};
			}
			
			//頁次所在行之後的 行號移為次頁的第 1 行，如 jgj
			// 12 …不能摧
			// 13
			//		hr [p3]
			// 壞他 --->
			//		hr [p3]
			// 1 壞他
			if (tagPageNum && jTmpLine) {
				jTmpLine.ln[0] += tagPageNum.length;
				this.nRowCount = 1;
				jTmpLine.ln[2] = 1;
			}
			
			this.nIdxInPara += sLine.length;
			
			if (jTmpLine || this.nRowCount == 0)
				this.nRowCount++;
		} // else非標記行、即實體文字行
	} // for nLnIdx this.aLine
} // eof transData()


//要跳過「註解區」
kEssay.prototype.jumbNAreaTocLevel=function(bStart, nLnIdx) {
	if (bStart)
		this.settleTocLevel(0, true, false, nLnIdx);
	else {
		for (var i=0; i <= this.mnPrevLev; i++) {
			this.settleTocLevel(i, false, true, nLnIdx);
		}
	}
}

//nLnIdx
kEssay.prototype.settleTocLevel=function(nLev, bCloseToc, bOpenNA, nLnIdx) {
	var sRet = "";
	var nDiff = this.mnPrevLev - nLev;
	var sDist = "0.5em"; //"4px";
	
	if (nLev < this.mnStartMarginLev)
		sDist = "0";
	
	var jqTmpDiv = $("<div></div>").css({"margin-left":sDist, "text-indent":"0"});
	
	if (!bOpenNA) {
		
		if (bCloseToc) jqTmpDiv = null;

		if (nDiff < -1) {
//		console.log("Level err:PrevLev= " + this.mnPrevLev + ", CurrLev= " + nLev);
		throw ("Level err:PrevLev= " + this.mnPrevLev + ", CurrLev= " + nLev);
		} 
		
		for (var i=0; i <= nDiff; i++) {
			this.closeCurrDiv(nLnIdx);
		}
		
		if (!bCloseToc)
			this.mnPrevLev = nLev;
	}
	
	if (jqTmpDiv) {
		this.jqCurrDiv.append(jqTmpDiv);
		this.jqCurrDiv = jqTmpDiv;
	}
}



//收束當前 div，並檢查是否已達 rootDiv
kEssay.prototype.closeCurrDiv=function(nLnIdx) {
	if (this.paraText.length > 0) {
		this.stuffPara(nLnIdx);
		this.NewPara();
	}

	if (this.jqCurrDiv == this.jqDivRoot) {
		throw "目前 div 已是頂點，divRoot 不能收束！";
	}
	else
		this.jqCurrDiv = this.jqCurrDiv.parent();
}


kEssay.prototype.gripPreLines=function(jsn, nLnIdx) {
	var out = [];
	var nRead = 0;
	for (; nLnIdx < this.aLine.length; nLnIdx++) {
		nRead++;
		var sLine = this.aLine[nLnIdx];
		if (/^\^\^\{"end_PRE"/.test(sLine)) break;
		out.push(sLine);
	}
	
	return [nRead, out.join("\n")];
}


kEssay.prototype.processUnLined=function(jsn, nLnIdx) {
	var aRslt, nReadLines = 0, nLevel = -10, htm = "";
	var nJsnCount = 0; //目前行的 JSON 所含的項目數
	var jqTmp;
	
	for (var itm in jsn) {
		nJsnCount++;

		if (/^(end_table|td|tr)$/i.test(itm)) {
			if (this.paraText.length > 0)	{
				this.stuffPara(nLnIdx); //paraSty 插入 br
				this.jqCurrPara.css({"marginTop":"0", "marginBottom":"0"});
				this.NewPara();
				
				this.jqCurrDiv = this.moTable.jqPrevDiv;
				
			}
			
			if (itm == "tr" && (jsn[itm] != undefined)) {
				this.genTRow(jsn["tr"]);

			} else if (itm == "td" && (jsn[itm] != undefined)) {
				this.genTData(nLnIdx, jsn["td"]);
			} else if ("end_table" == itm) {
				//所有 td 內的第１個 div 往上提 1em
				this.moTable.jqTable.find("td").children("div:first-of-type").css("margin-top", "-1em");
				
				this.jqCurrDiv = this.moTable.jqPrevDiv
				this.moTable = null;
			}
			jsn[itm] = undefined;
			continue;
		}

		if (itm == "toc" && (jsn[itm] != undefined)) {
			nReadLines = 0;
			this.anaToc(jsn, nLnIdx);
			jsn[itm] = undefined;
		}
		else if (itm == "MENU" && (jsn[itm] != undefined)) {
			aRslt = this.readMenu(nLnIdx+1);
			
			if (aRslt) {
				nReadLines = aRslt[0];
				this.jqCurrDiv.append(this.createReadMenu(aRslt[1]));
			}
			jsn[itm] = undefined;
			
		} else if (itm == "tableNode" && (jsn[itm] != undefined)) {
			this.genTableNode(jsn["tableNode"]);
			jsn[itm] = undefined;

		} else if (itm == "NA" && (jsn[itm] != undefined)) {
			nReadLines = 0;
			htm = '<img src="' + hostImgURL() + 'noteArea.png" width="25%" height="2px" />';
			
			this.jqCurrDiv.append(htm);
				
			jsn[itm] = undefined;
			
		} else if (itm == "img" && (jsn[itm] != undefined)) {
			nReadLines = 0;
			
			var jTmp = jsn[itm];

			htm = '<img src="' + hostImgURL() + jTmp.s + '" data-widthOfCharCount=' +  jTmp.t + ' />';
//✖ err			$(htm).attr("data-widthOfCharCount", jTmp.t);
			
			var sStyMisc = "";
			
			if (jTmp.al)
				sStyMisc += this.anaAlignment(jTmp.al);
			
			if (jTmp.ml)
				sStyMisc += "margin-left:" + this.anaUnits(jTmp.ml) + ";";
			
			if (jTmp.st)
				sStyMisc += jTmp.st + ";";
				
			if (sStyMisc) {
				sStyMisc = 'style="' + sStyMisc;
				htm = '<p ' + sStyMisc + '">' + htm + "</p>";
			}
			
			this.jqCurrDiv.append(htm);
				
			jsn[itm] = undefined;
			
		} else if (itm == "pre" && (jsn[itm] != undefined)) {
			if (this.paraText.length > 0)	{
				this.stuffPara(nLnIdx);
				this.NewPara();
			}
			nReadLines = 0;
			aRslt = this.gripPreLines(jsn, nLnIdx+1);
			nReadLines = aRslt[0];
			this.jqCurrDiv.append($(this.anaTagStyle(jsn[itm], "pre")).html(aRslt[1]));
			jsn[itm] = undefined;
		// div 均以 em 為單位
		} else if (itm == "div" && (jsn[itm] != undefined)) {
			nReadLines = 0;
			
			if (typeof jsn[itm] == "object") {
				if (jsn[itm].cs == "ChapTitleID") {
					this.mbSetEsyerTitle = true; //避免 transData 中誤設
					this.esyerTitlePrevDiv = this.jqCurrDiv;
					this.jqCurrDiv = $("#" + this.msIdEsyerTitle);
				} else {
					if (jsn[itm].cs != undefined && jsn[itm].cs.startsWith("notearea")) //mobil is notearea_m
						this.jumbNAreaTocLevel(true, nLnIdx);

					jqTmp = $(this.anaTagStyle(jsn[itm], "div"));
					this.jqCurrDiv.append(jqTmp);
					this.jqCurrDiv = jqTmp;
				}
			} else {
				if (jsn[itm] == "eoNA") {
					this.closeCurrDiv(nLnIdx);
					this.jumbNAreaTocLevel(false, nLnIdx);
				} else if (jsn[itm] == "eoChapTitleID") {
					this.jqCurrDiv = this.esyerTitlePrevDiv;
				} else {
					htm = this.anaDivValue(jsn[itm]);
					if (htm == '</div>')
						this.closeCurrDiv(nLnIdx);
					else {
						jqTmp = $(htm);
						this.jqCurrDiv.append(jqTmp);
						this.jqCurrDiv = jqTmp;
					}
				}
			}

			jsn[itm] = undefined;
		} // if (itm == "div"
	} // for (var itm in jsn)
	
	this.mnReadExtra = nReadLines;
	this.mnJsnCount = nJsnCount;
}



kEssay.prototype.anaToc=function(jsn, nLnIdx) {
	var jToc = jsn["toc"];
	var tocIdPfx = grabIdPrefix("toc");
	var sTmpLine = this.aLine[nLnIdx + 1];
	var nTitRight = sTmpLine.search(/（p[^）]+）$/);
	if (nTitRight > -1) {
		sTmpLine = sTmpLine.slice(0, nTitRight);
	}
	
	this.settleTocLevel(jToc["lev"], false, false, nLnIdx);
	
	if (jsn["PS"] == undefined) //此為 jsn 非 jToc，供 transData() 處理
		jsn["PS"] = {};
	
	jsn["PS"].id = tocIdPfx + this.maToc.length + this.msIdTail;
	this.maToc.push({"a":jsn["PS"].id, "lev":jToc["lev"], "c":sTmpLine});
	
	//可能會有 textborder 使用 span, 所以不可定義於 "PS" 中
	var tocCsName = "tocTitle";
	
	// "tocTitle、esyTitle、esySection" defined in common.css
	if (jToc["title"] != undefined || jToc["sect"] != undefined) {
		if (jToc["title"] != undefined)
			tocCsName = "esyTitle";
		else
			tocCsName = "esySection";
		
		jsn["PS"].cs = tocCsName;
	} else {
		if (jToc["noBox"] != undefined)
			tocCsName = ""; //沒有外框

	//if (/^CS_?\d{0,2}$/.test(i)) 所以 CS_99
	if (tocCsName)
		jsn["CS_99"] = [0, sTmpLine.length, tocCsName];//此為 jsn 非 jToc，供 transData() 處理
	}
}


// ？？ div 其他 Style，以陣列代入 或 以 | 分隔
// {"div":2.5  "2~1.5"
// {"div":{"ml":1, "ti"}} 套用 TS
// div 均以 em 為單位
kEssay.prototype.anaDivValue=function(value) {
	if (value == "e")
		return '</div>';

	var aTmp = value.toString().split("~");
	var ml = ""; ti = "";
	
	if (aTmp.length == 1) {
		ml = aTmp[0];
		ti = "-" + ml;
	} else {
		ml = aTmp[0];
		ti = aTmp[1];
	}
	
	return '<div style="margin-left:' + ml + 'em;text-indent:' + ti + 'em;">';
} //eof anaDivValue


//kEssay.prototype.stuffPara=function(nLnIdx, isNotParaTag) {
kEssay.prototype.stuffPara=function(nLnIdx) {
	if (this.jsPara) {
		var nLen = 0;
		if (this.jsPara["brLns"] != undefined) {
			var aLnNo = this.jsPara["brLns"].toString().split("~");
			var nStt = Number(aLnNo[0]);
			var nEnd = nStt;
			if (aLnNo[1])
				nEnd = Number(aLnNo[1]);
			//this.paraText.length-1 最後１行不能加 <br/>
			for (var i=0; i < this.paraText.length-1; i++) {
				nLen += this.paraText[i].length;
				if (i >= nStt && i <= nEnd) {
					this.paraSty.push({"br":[null, nLen]});
					//移除前程序所加的 f_br
					this.paraSty.find(function(s){
						if (s["f_br"] != undefined && s["f_br"][1] == nLen) {
							s["f_br"] = undefined;
							return true;
						}
					});
				}
			}
		}
		
		this.jqCurrPara = $(this.anaTagStyle(this.jsPara));
	} //eof if (this.jsPara)
	else {
		this.jqCurrPara = $("<p></p>");
	}
	
	var sPara = this.parseParaStyle();
	this.jqCurrPara.html(sPara);
	this.jqCurrDiv.append(this.jqCurrPara);

	this.settlePageNum();
} // eof stuffPara()


kEssay.prototype.anaTagStyle=function(jTmp, sTagName) {
	var sTagName = sTagName || "p"; //預設為 p，可用於其他 Tag，取代原 TAG
	var sTag = "";
	var sId = "";
	var sClass = "";
	var sStyle = "";
	var sTblAttr = "";
	var aPgSty = [];
	
	if (jTmp["st"])
		aPgSty.push(jTmp["st"]); //.replace(/[;]+$/, "");
	
//	if (sTagName == "p" || sTagName == "div") {
	if (sTagName.search(/^(p|div|td|table|pre)$/i) > -1) {
		if (typeof jTmp["ml"] != "undefined")
			aPgSty.push("margin-left:" + this.anaUnits(jTmp["ml"]));
		if (typeof jTmp["ti"] != "undefined")
			aPgSty.push("text-indent:" + this.anaUnits(jTmp["ti"]));
		
		if (typeof jTmp["v-al"] != "undefined")
			aPgSty.push(this.anaVerAlignment(jTmp["v-al"]));
		
		if (typeof jTmp["al"] != "undefined") {
			if (sTagName.toLowerCase() != "table")
				aPgSty.push(this.anaAlignment(jTmp["al"]));
			else
				sTblAttr += ' align="' + this.anaAlignment(jTmp["al"], true) + '" ';
		}
	}
	
	if (sTagName == "p") {
		if (jTmp["pbrF"] != undefined)
			aPgSty.push("margin-bottom:0");
		if (jTmp["pbrM"] != undefined)
			aPgSty.push("margin-top:0;margin-bottom:0");
		if (jTmp["pbrL"] != undefined)
			aPgSty.push("margin-top:0");
	}
	
	if (aPgSty.length > 0) {
		sStyle = ' style="' + aPgSty.join(";") + '"';
	}
//	if (aPgSty.length > 0) {
//		sTag = '<' + sTagName + ' style="' + aPgSty.join(";") + '"';
//	}
	
	if (jTmp["id"] != undefined)
		sId = ' id="' + jTmp["id"] + '"';
	
	if (jTmp["cs"] != undefined) {
		sClass = ' class="' + this.anaClass(jTmp["cs"]) + '"';
	}

	sTag = '<' + sTagName + sId + sClass + sStyle + sTblAttr + '>';
	
	return sTag;
} // eof anaTagStyle


kEssay.prototype.anaClass=function(cs) {
	var aCss = cs.toString().split(/ /);
	var aRet = [];
	
	for (var i = 0; i < aCss.length; i++) {
		aCss[i] = aCss[i].trim();
		if (!aCss[i]) continue;
		
		if (aCss[i] == "0" || aCss[i] == "srcwords")
			if (mbIsPC)
				aRet.push("srcwords");
			else
				aRet.push("srcwords_m");
		else if (aCss[i] == "1")
			aRet.push("sutratext");
		else if (aCss[i] == "2")
			aRet.push("textborder");
		else if (aCss[i] == "p")
			aRet.push("paraIndent");
		else if (aCss[i] == "notearea")
			if (mbIsPC)
				aRet.push("notearea");
			else
				aRet.push("notearea_m");
		else
			aRet.push(aCss[i]);
	}

	return aRet.join(" ");
}

kEssay.prototype.anaUnits=function(id) {
	var val = id.toString();
	if (val.search(/px|pt|em/) == -1) {
		return val + "em";
	} else
		return val;
}


//尾均附加 ";"
kEssay.prototype.anaAlignment=function(al, bTable) {
	var sRet = (bTable ? "" : "text-align:");
	if (al == "c")
		sRet += "center";
	else if (al == "r")
		sRet += "right";
	else
		sRet += al;
	
	return sRet + (bTable ? "" : ";");
}

//尾均附加 ";"
kEssay.prototype.anaVerAlignment=function(al) {
	var sRet = "vertical-align:";
	if (al == "m")
		sRet += "middle";
	else if (al == "t")
		sRet += "top";
	else if (al == "b")
		sRet += "bottom";
	else
		sRet += al; //-20px、1cm、50%……
	
	return sRet + ";";
}

kEssay.prototype.parseParaStyle=function() {
//	if (this.paraSty.length == 0)
		
	var aHtmB={};//{"66":["<span...>","<a...>", ...]
	var aHtmE={};
	var aVar = [], sStart = "", sEnd = "", sSet = "";//, sTagSty = "";
	var bHasNTD = false;
	
	for (var nIdx = 0; nIdx < this.paraSty.length; nIdx++) {
		var jsn = this.paraSty[nIdx];

		for (var jItm in jsn) {
			if (typeof jsn[jItm] == "undefined") continue;
			
			aVar = jsn[jItm];
			sStart = aVar[0];

			if (sStart != null)
				sEnd = aVar[0] + aVar[1];
			else
				sEnd = aVar[1];

			sSet = aVar[2]; // if length < 2 ??
		
			if (sStart != null)
				if(!aHtmB[sStart]) aHtmB[sStart] = [];
			
			if (sEnd != null)
				if(!aHtmE[sEnd]) aHtmE[sEnd] = [];

			if (jItm == "ln") {
				aHtmB[sStart].unshift('<sup class="falseBR">' + sSet + "</sup>");

			} else if (jItm == "f_br") {
				aHtmE[sEnd].push('<br class="falseBR" />');

			} else if (jItm == "pgNum") {
				var pgIdPfx = grabIdPrefix("page");
				var id = sSet.replace(/\[|\]/g, "");
				this.jqSelPageList.append($("<option></option>").text(id.substr(1)));
				
				aHtmB[sStart].push('<span ' + 'id="' + pgIdPfx + id + this.msIdTail + '" class="__pageNum" pgNum="' + sSet + '">');
				aHtmE[sEnd].unshift('</span>');

			} else if (/^CS_?\d{0,2}$/.test(jItm)) {
				sSet = this.anaClass(sSet);
					
				aHtmB[sStart].push('<span class="' + sSet + '">');
				aHtmE[sEnd].unshift('</span>');

			} else if (jItm == "a") {
				aHtmB[sStart].push('<a href="'+ sSet + '" target="_blank">');
				aHtmE[sEnd].unshift('</a>');

			} else if (jItm == "br") { // true br
				aHtmE[sEnd].push("<br/>"); //nStart 前已計實 + sLine.length

//			} else if (/^nti_\d+$/.test(jItm)) {
			} else if (/^nti_.+$/.test(jItm)) {
				var floatId = jItm + this.msIdTail; //同時載入多章時，註序會衝突
				if (mbIsPC) {
					aHtmB[sStart].push('<sup id="' + floatId + '" class="noteNum"><a href="#ntd_' + floatId.substr(4) + '">');
				
					aHtmE[sEnd].unshift('</a></sup>');

				//◆ 註序前後各附加１個空白
				} else {
					aHtmB[sStart].push('<sup id="' + floatId + '" class="noteNum"><a href="#ntd_' + floatId.substr(4) + '"> ');
				
					aHtmE[sEnd].unshift('&nbsp;</a></sup>'); //不能逕寫空白，無法顯示
				}

//			} else if (/^ntd_\d+$/.test(jItm)) {
			} else if (/^ntd_.+$/.test(jItm)) {
				var floatId = jItm + this.msIdTail; //同時載入多章時，註序會衝突
				bHasNTD = true;
				aHtmB[sStart].push('<span id="' + floatId + '" class="noteNum"><a href="#nti_' + floatId.substr(4) + '">註 ');
			//強制加上 <br/> 移除 class="noteDet"
				aHtmE[sEnd].unshift('</a>〉</span><br/>');

			//simple/shorten style 需 多個 合併 ？？
			} else if (/^sST_?\d{0,2}/.test(jItm)) {
				var sSty = "";
				if (sSet == "B")
					sSty = "font-weight:bold";
				else if (sSet == "U")
					sSty = "border-bottom:1px solid black";
				else if (sSet == "U2")
					sSty = "border-bottom:2px solid black";
				else if (sSet == "U0") // 保留，在 text-border 中時用
					sSty = "text-decoration:underline";
				else //取代原 ST
					sSty = sSet.replace(/;+$/,"");

				aHtmB[sStart].push('<span style="' + sSty + ';">');
				aHtmE[sEnd].unshift('</span>');

			} else if (/^ST_?\d{0,2}/.test(jItm)) {
				aHtmB[sStart].push('<span style="' + sSet + '">');
				aHtmE[sEnd].unshift('</span>');

			} else if (/^TAG_?\d{0,2}/.test(jItm)) {
				aHtmB[sStart].push(jsn[jItm].tagO);
				aHtmE[sEnd].push('</' + sSet + '>');
			} else {
				console.log("Kag style not processed:", jItm);
			}
		} //eof for (var jItm in jsn)
	} // ffor (var nIdx = 0; nIdx < this.paraSty.length

	var sParaCont = this.paraText.join("");
	
	if (/^\d+$/.test(sParaCont) && bHasNTD)
		this.mbPrevParaIsNTDno = true;
	else
		this.mbPrevParaIsNTDno = false;
			
	var out = 
	sParaCont.replace(/./g, function(x, idx) {
		var s = "";
		
		if(aHtmE[idx])
			s = aHtmE[idx].join("");
		if(aHtmB[idx])
			s += aHtmB[idx].join("");

		return s+x;
	});
	
	//在段末的標記
	if(aHtmE[sParaCont.length])
		out += aHtmE[sParaCont.length].join("");
	
// 目前尚未有含 <p>、<div>者 04-23 20:19
	if (out.search(/<(p +|div +)[^>]*?>/) > -1)
		console.log("out 含有 p|div Tag", out);
	
	return out;

} //eof parseParaStyle


//設兩個 pgnum span，隱顯用：只顯 p、顯 hr 及 p、全隱
//<span>[p12]</span> <div><hr/><span>[p12]</span></div>
//第１個頁碼先隱藏，不顯示
kEssay.prototype.settlePageNum=function() {
	var aPageNum = this.jqCurrPara.find(".__pageNum");
//	var aPageNum = this.ndCurrPara.getElementsByClassName("__pageNum");
	
	if (!aPageNum)
		return;
	
//	var jqCurrP = this.jqCurrPara;
	
//	for (var i = 0; i < aPageNum.length; i++) {
	aPageNum.each(function() {
		genPageNumHrDiv($(this));
//		var jqNum = $(this);//aPageNum[i];
//		var sPgNum = jqNum.attr("pgNum");
//		var dvHr = genPageNumHrDiv(sPgNum);
//		jqNum.html("");
		//全段只有頁碼
//		if (jqCurrP.text().trim() == "")
//			jqCurrP.css("textAlign","right");
//			dvHr.insertAfter(jqNum);
	
//		dvHr.css("left",(-dvHr.offset().left-14) + "px");
//console.log(sPgNum + ", " + jqNum.offset().left);

//		dvHr.css("right", "16px");
//		dvHr.css("left",(-jqCurrP.offsetParent().offset().left) + "px");
//		dvHr.insertAfter(jqNum).css("left",(-dvHr.offset().left - $(".essay").offset().left) + "px");
//		dvHr.insertAfter(jqNum).css("left",(-dvHr.offset().left + $(".essay").offset().left) + "px");
	});
}


var genPageNumHrDiv=function(jqNum) {
//	var sWidth = $(".essay").width()-20;
	jqNum.html("");
//	var ndDiv = $("<p></p>").attr("class", "__pageNumHrDiv");//span 非容器
	var ndDiv = $("<div></div>").attr("class", "__pageNumHrDiv");//span 非容器
//	var ndDiv = $("<div></div>").css({"position":"relative","right":"8px"}).attr("class", "__pageNumHrDiv");//span 非容器

	ndDiv.insertAfter(jqNum);
//	ndDiv.css("left",-ndDiv.offset().left);

	var jqNumInDiv = $('<span class="__pageNumInDiv" >' + jqNum.attr("pgNum") + '</span>');
//	ndDiv.append($("<hr/>").css("width", "100%"));
	ndDiv.append(jqNumInDiv);
}


kEssay.prototype.parseJSON=function(jsn, nLnIdx) {
	for (var ji in jsn) {
		if (jsn[ji] == undefined) continue;
		
		if (ji == "br") { // true br, not false br
			//該行末位
			jsn["br"] = [null, this.nIdxInPara + this.aLine[nLnIdx + 1].length];
		} else if (/^TAG_?\d{0,2}/.test(ji)) {
			var aTmp = jsn[ji];
			var tmpJ = {"st":aTmp[3]};
			jsn[ji].tagO = this.anaTagStyle(tmpJ, aTmp[2]);
//			console.log(jsn[ji].tagO);
			jsn[ji][0] += this.nIdxInPara;

		} else if (ji == "PS") { //para align、class、other style
			this.jsPara = jsn["PS"];
			
		} else {
			jsn[ji][0] += this.nIdxInPara;
		}
	}
	
	if (jsn["PS"]) {
		for (var p in jsn) {
			if (jsn[p] != undefined && p != "PS") {
				var newJ = JSON.parse('{"' + p + '":' + JSON.stringify(jsn[p]) + '}');
					this.paraSty.push(newJ)
				}
		}
	} else
		this.paraSty.push(jsn);
	
}



kEssay.prototype.readMenu=function(idx) {
	var aItem = [];
	var nRead = 0;
	
	for (; idx < this.aLine.length; idx++) {
		nRead++;
		var sLine = this.aLine[idx];
		if (/^\^\^\{"end_MENU"/.test(sLine)) break;
		
		var nCount = sLine.lastIndexOf("\t");
		nCount++;
		var itm = {};
		itm.c = sLine.slice(nCount);
		itm.lev = nCount;
		aItem.push(itm);
	}

	return [nRead, aItem];
}

//aItem = [{"c":"", "lev":0}, ...]
kEssay.prototype.createReadMenu=function(aItem) {
	var sPath = hostImgURL();
	var rtUL = document.createElement("UL");
	rtUL.setAttribute("class", "menutree");
	rtUL.setAttribute("onclick", "onMenuClicked(event)");
	
	for (var i=0; i < aItem.length; i++) {
    var textnode = document.createTextNode(aItem[i].c);
    var ndSpan = document.createElement("SPAN");
    var nd = document.createElement("LI");
		var nOffset = -1;

		ndSpan.appendChild(textnode);

		if (aItem[i].lev == 0) {
    	ndUL = rtUL;
			nOffset = -1;
		}
		else
			nOffset = (aItem[i-1].lev - aItem[i].lev);
		
		if (nOffset < -1) {
			alert("Toc.level 錯誤；請檢視 console.log。");
			console.log("Err of Toc.level: prev= ",aItem[i-1].lev,", curr= ", aItem[i].lev);
		}
			
  	if (i==aItem.length-1 || aItem[i+1].lev <= aItem[i].lev) {
    	nd.style.listStyleImage = 'none';
  	} else
	    nd.style.listStyleImage = 'url("' + sPath + 'open_brk.png")';
  		/*
    if (aItem[i].lev > 2) {
    	nd.style.listStyleImage = 'url("' + sPath + 'close_brk.png")';
	 	  nd.style.display = "none";
	 	 } else {
	    nd.style.listStyleImage = 'url("' + sPath + 'open_brk.png")';
    }*/

    nd.appendChild(ndSpan);
		
		if (nOffset == 0) {
			ndUL.appendChild(nd);

			if (i<aItem.length-1 && aItem[i+1].lev > aItem[i].lev) {
	    	ndUL = document.createElement("UL");
				nd.appendChild(ndUL);
			}
		} else if (nOffset < 0){
			ndUL.appendChild(nd);
			if (i<aItem.length-1 && aItem[i+1].lev > aItem[i].lev) {
	    	ndUL = document.createElement("UL");
				nd.appendChild(ndUL);
			}
		} else {
			for (j=0; j<nOffset; j++) {
				ndUL = ndUL.parentNode.parentNode;
			}
				
			ndUL.appendChild(nd);
			
			if (i<aItem.length-1 && aItem[i+1].lev > aItem[i].lev) {
	    		ndUL = document.createElement("UL");
				nd.appendChild(ndUL);
			}
		}
	}
	
	return rtUL.outerHTML;
}


kEssay.prototype.isKagLine=function(sLine, nLnIdx) {
	var jsn = null;
	
	this.mbFitDevice = true;
	
	if (/^\^\^\{.*?\}$/.test(sLine)) {
		try {
			jsn = JSON.parse(sLine.substr(2));
		} catch(e) {
			console.log("第", nLnIdx, "行：", sLine);
			throw e
		}
		

		if (jsn.fPC != undefined) {
			if ((jsn.fPC && !mbIsPC) || (!jsn.fPC && mbIsPC))
				this.mbFitDevice = false;
			
			jsn.fPC = undefined;
		}
	}
	
	return jsn;
}


// nLnIdx 是目前 table 所在行的次１行
kEssay.prototype.genTableNode=function(jsn) {
	var jTbl = {};
	
	jTbl.nTrIdx = 0;
	
	jTbl.nth_e = jsn["nth_e"] || "";
	jTbl.nth_o = jsn["nth_o"] || "";
	
	jTbl.sTDcommonStyle = jsn["tdst"] || "";

	var jqTable = $(this.anaTagStyle(jsn, "table"));
	jqTable.append($("<tbody></tbody>"));
	
	if (!jsn["noborder"])
		jqTable.attr("border", 1);
	
	this.jqCurrDiv.append($("<p></p>").append(jqTable))
	jTbl.jqTable = jqTable;
	jTbl.jqCurrTRow = null;
	//因外裹 <p>
	jTbl.jqPrevDiv = this.jqCurrDiv;
	
	this.moTable = jTbl;
}


//jsn 傳入上層的 jsn["tr"]
kEssay.prototype.genTRow =function(jsn) {
	var jqTR = $(this.anaTagStyle(jsn, "tr"));
//	var jqTR = "<tr></tr>";
	this.moTable.jqTable.append(jqTR);

	if (this.moTable.nTrIdx % 2 == 0 && this.moTable.nth_e)
		jqTR.css("backgroundColor", this.moTable.nth_e);
	else if (this.moTable.nTrIdx % 2 == 1 && this.moTable.nth_o)
		jqTR.css("backgroundColor", this.moTable.nth_o);

	this.moTable.jqCurrTRow = jqTR;
	this.moTable.nTrIdx++;
}


//jsn 傳入上層的 nLnIdx, jsn["td"]
kEssay.prototype.genTData =function(nLnIdx, jsn) {
	if (!jsn["st"])
		jsn["st"] = this.moTable.sTDcommonStyle;
	else
		jsn["st"] = this.moTable.sTDcommonStyle.replace(/;+$/,"") + ";" + jsn["st"]; //置後可覆蓋共同屬性 sTDcommonStyle

	var	jqTD = $(this.anaTagStyle(jsn, "td"));
	this.moTable.jqCurrTRow.append(jqTD);
	
	if (jsn.csp != undefined) {
		jqTD.attr("colSpan", parseInt(jsn.csp));
		jsn.csp = undefined;
	}
	if (jsn.rsp != undefined) {
		jqTD.attr("rowSpan", parseInt(jsn.rsp));
		jsn.rsp = undefined;
	}

	if (jsn.c == undefined) {
		this.jqCurrDiv = jqTD;
	}
	else {
		/*
		var nd = this.anaTagStyle(jsn.c, "p");
		if (!nd.style.marginTop)
			nd.style.marginTop = "0px";
		if (!nd.style.marginBottom)
			nd.style.marginBottom = "0px";
		
		jqTD.appendChild(nd);
		*/
//		jqTD.innerHTML = '<p style="margin-top:0;margin-bottom:0;">' + jsn.c + '</p>';
		jqTD.html(jsn.c);
	}
}

