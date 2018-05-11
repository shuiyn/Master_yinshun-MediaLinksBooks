	/*
var togglePageNum=function() {
	var eHrNums = document.getElementsByClassName("__pageNumHrDiv");
	var sDisp = "none";
	if (eHrNums && (eHrNums[0].style.display == "none"))
		sDisp = "block";

	var eNums = document.getElementsByClassName("__pageNum");
	
	if (eHrNums) {
		for (var i=0; i < eHrNums.length; i++) {
			eHrNums[i].style.display = sDisp;
		}
	}
}

var togglePageNum_ALL=function(nMode) {
	var eNums = document.getElementsByClassName("__pageNum");
	var bNumsBlock = false;
	if (eNums && ("" != eNums[0].innerHTML))
		bNumsBlock = true;
	
	var eHrNums = document.getElementsByClassName("__pageNumHrDiv");
	var bHrNumsBlock = false;
	if (eHrNums && (eHrNums[0].style.display != "none"))
		bHrNumsBlock = true;
	
	var bNums = false, bHrNums = false;

	if (nMode == 0) { //全隱
	} else if (nMode == 1) { //只顯 pgNum
		bNums = true;
	} else if (nMode == 2) { //顯 hr-pgNum
		bHrNums = true;
	}
	
	if (eNums) {
		if (bNums && !bNumsBlock) {
			for (var i=0; i < eNums.length; i++) {
//				eNums[i].style.padding = "2px";
				eNums[i].innerHTML = eNums[i].getAttribute("pgNum");
			}
		} else if (!bNums && bNumsBlock) {
			for (var i=0; i < eNums.length; i++) {
//				eNums[i].style.padding = "0px";
				eNums[i].innerHTML = "";
			}
		}
	}
	
	if (eHrNums) {
		var sDisp = "";
		if (bHrNums && !bHrNumsBlock)
			sDisp = "block";
		else if (!bHrNums && bHrNumsBlock)
			sDisp = "none";
			
		if (sDisp) {
			for (var i=0; i < eHrNums.length; i++) {
				eHrNums[i].style.display = sDisp;
			}
		}
	}
}
*/


	/* 移到 ys)cell.html
//讀取書本的各「章」名稱，作為選單
var grabEssayChapter=function(jsEsy) {
	var aChapt = [];
	for (s in jsEsy) {
		aChapt.push(s);
	}
	
	return aChapt;
}

//將指定的「章」，填入展示的 divRoot
//var openEssay=function(divRoot, jsnChapter, selPageList) {
var openEssay=function(bCM, jsnChapter) {
	var divRoot = (bCM ? theBook.ctlShowYin : theBook.ctlShowAux);
	var selPageList = (bCM ? theBook.selPageListYin : theBook.selPageListAux);
	var idTail = (bCM ? "" : "_H");

	divRoot.innerHTML = "";
	
	while (selPageList.length > 0) selPageList.remove(0);
	
	var esy = new kEssayNode(divRoot, jsnChapter, selPageList, idTail);
	esy.transData();
	createCmMenu(esy.maToc);
	
	doToggleBR();
}
*/

/*
需要斷行者：
	noteArea

*/

var kEssayNode=function(divRoot, jsnChapter, selPageList, idTail) {
	this.divRoot = divRoot;
	this.selPageList = selPageList;
	this.msIdTail = idTail || "";
	
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
	this.ndCurrDiv = this.divRoot;//目前增入、處理中的 <div>，divRoot 或新增的
	this.ndCurrPara = null;//目前增入、處理中的 <p>
	
	this.nRowCount = 1; //各頁所有行的行號，人讀、從 1 起計
	this.mnPrevLev = -1; // > -1 表示已有 toc item
	this.mbPrevParaIsNTDno = false; //前段是否全段 = 註釋的註序號
	this.mbFitDevice = true; // Kag Line 是否適用裝置
	this.moTable = null;
	this.nTry = 0;
}


kEssayNode.prototype.NewPara=function() {
	this.paraText = [];
	this.paraSty = [];
	this.nIdxInPara = 0;
	this.mnReadExtra = 0; //在 transData() 外，額外已讀行數
	this.mnJsnCount = 0; //當行所有 jsn 數
	this.jsPara = null;
	this.ndCurrPara = null;
//	this.mbPrevParaIsNTDno = false; 不可清除，影響 LineNo 要否寫入
}


kEssayNode.prototype.transData=function() {
	var sLine, jsn;

	//nLnIdx <= this.aLine.length 過１行，以確後最１行讀入
	for (var nLnIdx = 0; nLnIdx <= this.aLine.length; nLnIdx++) {
		sLine = this.aLine[nLnIdx];

		if (!sLine || nLnIdx == this.aLine.length) {
			if (this.paraText.length == 0)
				continue;
			
			this.stuffPara(nLnIdx);
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
			this.ndCurrDiv.appendChild(this.genNode(sLine));
		}
		else { //非標記行、即實體文字行
			var aPageNumTag = sLine.match(/\[p[a-z]?\d+\]/g);
			var tagPageNum = null;
			if (aPageNumTag) {
				tagPageNum = aPageNumTag[0];
			}
			
			var jTmpLine = null;
			
		if (this.mbHasLineNum) {
			if (!this.moTable) {
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
			}
			
			this.nIdxInPara += sLine.length;
			
			if (jTmpLine || this.nRowCount == 0)
				this.nRowCount++;
		} // else非標記行、即實體文字行
	} // for nLnIdx this.aLine
} // eof transData()


//要跳過「註解區」
kEssayNode.prototype.jumbNAreaTocLevel=function(bStart, nLnIdx) {
	if (bStart)
		this.settleTocLevel(0, true, false, nLnIdx);
	else {
		for (var i=0; i <= this.mnPrevLev; i++) {
			this.settleTocLevel(i, false, true, nLnIdx);
		}
	}
}

//nLnIdx
kEssayNode.prototype.settleTocLevel=function(nLev, bCloseToc, bOpenNA, nLnIdx) {
	var sRet = "";
	var nDiff = this.mnPrevLev - nLev;
	var sDist = "0.5em"; //"4px";
	
	if (nLev < this.mnStartMarginLev)
		sDist = "0";
	
	var sDivSty = '<div style="margin-left:' + sDist + ';text-indent:0;">';
	
	if (!bOpenNA) {
		
		if (bCloseToc) sDivSty = "";

		if (nDiff < -1) {
			console.log("Level err:PrevLev= ", this.mnPrevLev, ", CurrLev= ", nLev);
			throw "err level, see console.log!";
		} 
		
	//	if (nDiff == -1) {
		if (nDiff < -1) {
	//		sRet = sDivSty;
		} else if (nDiff == 0) {
				this.closeCurrDiv(nLnIdx);
		} else {
			for (var i=0; i <= nDiff; i++) {
				this.closeCurrDiv(nLnIdx);
			}
		}
		
		if (!bCloseToc)
			this.mnPrevLev = nLev;
	}
	
	if (sDivSty) {
		var nd = this.genNode(sDivSty);
		this.ndCurrDiv.appendChild(nd);
		this.ndCurrDiv = nd;
	}
}



//收束當前 div，並檢查是否已達 rootDiv
kEssayNode.prototype.closeCurrDiv=function(nLnIdx) {
	if (this.paraText.length > 0) {
		this.stuffPara(nLnIdx);
		this.NewPara();
	}

	if (this.ndCurrDiv == this.divRoot) {
		throw "目前 div 已是頂點，divRoot 不能收束！";
	}
	else
		this.ndCurrDiv = this.ndCurrDiv.parentNode;
}


kEssayNode.prototype.processUnLined=function(jsn, nLnIdx) {
	var aRslt, nReadLines = 0, nLevel = -10, htm = "";
	var nJsnCount = 0; //目前行的 JSON 所含的項目數
	var nd;
	
	for (var itm in jsn) {
		nJsnCount++;

//		if (/^(end_table|td|tr|\/td)$/i.test(itm)) {
		if (/^(end_table|td|tr)$/i.test(itm)) {
			if (this.paraText.length > 0)	{
					this.stuffPara(nLnIdx); //paraSty 插入 br
					this.ndCurrPara.style.marginTop = "0";
					this.ndCurrPara.style.marginBottom = "0";
					this.NewPara();
					
//					if (this.moTable.ndPrevDiv)
					this.ndCurrDiv = this.moTable.ndPrevDiv;
			}
			
			if (itm == "tr" && (jsn[itm] != undefined)) {
				this.genTRow(jsn["tr"]);

			} else if (itm == "td" && (jsn[itm] != undefined)) {
				this.genTData(nLnIdx, jsn["td"]);
			} else if ("end_table" == itm) {
//	console.log("end_table", jsn[itm], nLnIdx, this.ndCurrDiv);
				this.ndCurrDiv = this.moTable.ndPrevDiv
				this.moTable = null;
			}
			jsn[itm] = undefined;
			continue;
		}


		
		if (itm == "toc" && (jsn[itm] != undefined)) {
			nReadLines = 0;
			this.anaToc(jsn, nLnIdx);
//			nLevel = jsn[itm];
			jsn[itm] = undefined;
		}
		else if (itm == "MENU" && (jsn[itm] != undefined)) {
			aRslt = this.readMenu(nLnIdx+1);
			
			if (aRslt) {
				nReadLines = aRslt[0];
				htm = this.createReadMenu(aRslt[1]);
				this.ndCurrDiv.appendChild(this.genNode(htm));
			}
			jsn[itm] = undefined;
			
		} else if (itm == "tableNode" && (jsn[itm] != undefined)) {
			this.genTableNode(jsn["tableNode"]);
			jsn[itm] = undefined;

		/*} else if (itm == "old_tableNode" && (jsn[itm] != undefined)) {
			aRslt = this.genTableNode(nLnIdx+1, jsn["tableNode"]);
			if (aRslt) {
				nReadLines = aRslt[0];
				this.ndCurrDiv.appendChild(aRslt[1]);
			}
			
			jsn[itm] = undefined;
			
		} else if (itm == "table" && (jsn[itm] != undefined)) {
			aRslt = this.readTable(nLnIdx+1, jsn["table"]);
			if (aRslt) {
				nReadLines = aRslt[0];
				htm = aRslt[1];
				this.ndCurrDiv.appendChild(this.genNode(htm));
		}
			jsn[itm] = undefined;*/
		} else if (itm == "NA" && (jsn[itm] != undefined)) {
			nReadLines = 0;
			htm = '<img src="' + hostImgURL() + 'noteArea.png" width="25%" height="2px" />';
			
			this.ndCurrDiv.appendChild(this.genNode(htm));
				
			jsn[itm] = undefined;
			
		} else if (itm == "img" && (jsn[itm] != undefined)) {
			nReadLines = 0;
			var jTmp = jsn[itm];
			var nWid = jTmp.t*16;
			var nHei = Math.floor(nWid * (jTmp.h / jTmp.w));
			htm = '<img src="' + hostImgURL() + jTmp.s + '" width="' + nWid + 'px" height="' + nHei + 'px" />';
			
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
			this.ndCurrDiv.appendChild(this.genNode(htm));
				
			jsn[itm] = undefined;
			
		// div 均以 em 為單位
		} else if (itm == "div" && (jsn[itm] != undefined)) {
			nReadLines = 0;
			
			if (typeof jsn[itm] == "object") {
				if (jsn[itm].cs != undefined && jsn[itm].cs.startsWith("notearea")) //mobil is notearea_m
					this.jumbNAreaTocLevel(true, nLnIdx);

				nd = this.anaTagStyle(jsn[itm], "div");
				this.ndCurrDiv.appendChild(nd);
				this.ndCurrDiv = nd;
				
			} else {
				if (jsn[itm] == "eoNA") {
					this.closeCurrDiv(nLnIdx);
					this.jumbNAreaTocLevel(false, nLnIdx);
				} else {
					htm = this.anaDivValue(jsn[itm]);
					if (htm == '</div>')
						this.closeCurrDiv(nLnIdx);
					else {
						nd = this.genNode(htm);
						this.ndCurrDiv.appendChild(nd);
						this.ndCurrDiv = nd;
					}
				}
			}

			jsn[itm] = undefined;
		} // if (itm == "div"
	} // for (var itm in jsn)
	
	this.mnReadExtra = nReadLines;
	this.mnJsnCount = nJsnCount;
}



kEssayNode.prototype.anaToc=function(jsn, nLnIdx) {
	var jToc = jsn["toc"];
	var tocIdPfx = base_List.htmlIdPrefix.toc;
	var sTmpLine = this.aLine[nLnIdx + 1];
	var nTitRight = sTmpLine.search(/（p[^）]+）$/);
	if (nTitRight > -1) {
		sTmpLine = sTmpLine.slice(0, nTitRight);
	}
	
	this.settleTocLevel(jToc["lev"], false, false,nLnIdx);
	
	if (jsn["PS"] == undefined) //此為 jsn 非 jToc，供 transData() 處理
		jsn["PS"] = {};
	
	jsn["PS"].id = tocIdPfx + this.maToc.length + this.msIdTail;
//	this.mnTocSno++;
	this.maToc.push({"a":jsn["PS"].id, "lev":jToc["lev"], "c":sTmpLine});
	
	//可能會有 textborder 使用 span, 所以不可定義於 "PS" 中
	var tocCsName = "tocTitle";
	
	// "tocTitle、esyTitle、esySection" defined in common.css
	if (jToc["title"] != undefined || jToc["sect"] != undefined) {
		if (jToc["title"] != undefined)
			tocCsName = "esyTitle";
		else
			tocCsName = "esySection";

//		if (jsn["PS"] == undefined) //此為 jsn 非 jToc，供 transData() 處理
//			jsn["PS"] = {};
		
		jsn["PS"].cs = tocCsName;
	} else {
//		var sTmpLine = this.aLine[nLnIdx + 1];
//		var nTitRight = sTmpLine.search(/（p[^）]+）$/);
//		if (nTitRight > -1) {
//			sTmpLine = sTmpLine.slice(0, nTitRight);
//		}
		
		if (jToc["noBox"] != undefined)
			tocCsName = ""; //沒有外框

	//if (/^CS_?\d{0,2}$/.test(i)) 所以 CS_99
		jsn["CS_99"] = [0, sTmpLine.length, tocCsName];//此為 jsn 非 jToc，供 transData() 處理
	}
}


// ？？ div 其他 Style，以陣列代入 或 以 | 分隔
// {"div":2.5  "2~1.5"
// {"div":{"ml":1, "ti"}} 套用 TS
// div 均以 em 為單位
kEssayNode.prototype.anaDivValue=function(value) {
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


//kEssayNode.prototype.stuffPara=function(nLnIdx, isNotParaTag) {
kEssayNode.prototype.stuffPara=function(nLnIdx) {
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
		
//		if (isNotParaTag)
//			return this.anaTagStyle(this.jsPara);
//		else
			this.ndCurrPara = this.anaTagStyle(this.jsPara);

	} //eof if (this.jsPara)
	else {
//		if (isNotParaTag)
//			return null;
		
		this.ndCurrPara = document.createElement("P");
	}
	
	var sPara = this.parseParaStyle();
	this.ndCurrPara.innerHTML = sPara;
	this.ndCurrDiv.appendChild(this.ndCurrPara);

	this.settlePageNum();
} // eof stuffPara()


kEssayNode.prototype.anaTagStyle=function(jTmp, sTagName, bHtmText) {
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
	if (sTagName.search(/^(p|div|td|table)$/i) > -1) {
		if (typeof jTmp["ml"] != "undefined")
				aPgSty.push("margin-left:" + this.anaUnits(jTmp["ml"]));
		if (typeof jTmp["ti"] != "undefined")
				aPgSty.push("text-indent:" + this.anaUnits(jTmp["ti"]));
		
		if (typeof jTmp["al"] != "undefined") {
			if (sTagName.toLowerCase() != "table")
				aPgSty.push(this.anaAlignment(jTmp["al"]));
			else
				sTblAttr += ' align="' + this.anaAlignment(jTmp["al"], true) + '" ';
		}
	}
	
	if (sTagName == "p") {
		if (typeof jTmp["pbrF"] != "undefined")
			aPgSty.push("margin-bottom:0");
		if (typeof jTmp["pbrM"] != "undefined")
			aPgSty.push("margin-top:0;margin-bottom:0");
		if (typeof jTmp["pbrL"] != "undefined")
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
	/*
	if (jTmp["cs"] != undefined) {
		var sTmp = this.anaClass(jTmp["cs"]);
		
		if (sTag)
			sTag += ' class="' + sTmp + '"';
		else
			sTag = '<' + sTagName + ' class="' + sTmp + '"';
	}*/
	
//	if (sTag) sTag += '>';
//	else sTag = '<' + sTagName + '>';
	if (bHtmText)
		return sTag;
	else
		return this.genNode(sTag);
} // eof anaTagStyle


kEssayNode.prototype.genNode=function(htm) {
	var ndDiv = document.createElement("DIV");//span 非容器
	ndDiv.insertAdjacentHTML("beforeend", htm);

	return ndDiv.lastElementChild;
}


kEssayNode.prototype.anaClass=function(cs) {
	var aCss = cs.toString().split(/ /);
	var aRet = [];
	
	for (var i = 0; i < aCss.length; i++) {
		aCss[i] = aCss[i].trim();
		if (!aCss[i]) continue;
		
		if (aCss[i] == "0" || aCss[i] == "srcwords")
//			aRet.push(msSourceWords);
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

kEssayNode.prototype.anaUnits=function(id) {
	var val = id.toString();
	if (val.search(/px|pt|em/) == -1) {
		return val + "em";
	} else
		return val;
}


//尾均附加 ";"
kEssayNode.prototype.anaAlignment=function(al, bTable) {
	var sRet = (bTable ? "" : "text-align:");
	if (al == "c")
		sRet += "center";
	else if (al == "r")
		sRet += "right";
	else
		sRet += al;
	
	return sRet + (bTable ? "" : ";");
}

kEssayNode.prototype.parseParaStyle=function() {
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
				var pgIdPfx = base_List.htmlIdPrefix.page;
				var id = sSet.replace(/\[|\]/g, "");
		var opt = document.createElement("option");
		opt.text = id.substr(1);
		this.selPageList.add(opt);
				
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

			} else if (/^nti_\d+$/.test(jItm)) {
				if (mbIsPC) {
					aHtmB[sStart].push('<sup id="' + jItm + '" class="noteNum"><a href="#ntd_' + jItm.substr(4) + '">');
				
					aHtmE[sEnd].unshift('</a></sup>');

				//◆ 註序前後各附加１個空白
				} else {
					aHtmB[sStart].push('<sup id="' + jItm + '" class="noteNum"><a href="#ntd_' + jItm.substr(4) + '"> ');
				
					aHtmE[sEnd].unshift('&nbsp;</a></sup>'); //不能逕寫空白，無法顯示
				}

			} else if (/^ntd_\d+$/.test(jItm)) {
				bHasNTD = true;
				aHtmB[sStart].push('<span id="' + jItm + '" class="noteNum"><a href="#nti_' + jItm.substr(4) + '">註 ');
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
kEssayNode.prototype.settlePageNum=function() {
	var aPageNum = this.ndCurrPara.getElementsByClassName("__pageNum");
	
	if (!aPageNum)
		return;
	
	for (var i = 0; i < aPageNum.length; i++) {
		var sPgNum = aPageNum[i].getAttribute("pgNum");
		var nd = aPageNum[i];
		var dvHr = this.genPageNumHrDiv(sPgNum);
		nd.innerHTML = "";
		//全段只有頁碼
//		if (this.ndCurrPara.innerText.trim() == "" && this.ndCurrPara.children.length == 1)
		if (this.ndCurrPara.innerText.trim() == "")
			this.ndCurrPara.style.textAlign = "right";
		
		nd.insertAdjacentElement("afterend", dvHr);
		
		dvHr.style.marginLeft = -dvHr.offsetLeft + "px";
	}
}


kEssayNode.prototype.genPageNumHrDiv=function(sPg) {
	var ndDiv = document.createElement("DIV");//span 非容器
	var sHtm = '<span class="__pageNumInDiv" >' + sPg + '</span>';
	ndDiv.style.position = "relative";
	ndDiv.appendChild(document.createElement("HR"));
	ndDiv.insertAdjacentHTML("beforeend", sHtm);
	ndDiv.className = "__pageNumHrDiv";
	return ndDiv;
}


kEssayNode.prototype.parseJSON=function(jsn, nLnIdx) {
	for (var ji in jsn) {
		if (jsn[ji] == undefined) continue;
		
		if (ji == "br") { // true br, not false br
			//該行末位
			jsn["br"] = [null, this.nIdxInPara + this.aLine[nLnIdx + 1].length];
		} else if (/^TAG_?\d{0,2}/.test(ji)) {
			var aTmp = jsn[ji];
			var tmpJ = {"st":aTmp[3]};
			jsn[ji].tagO = this.anaTagStyle(tmpJ, aTmp[2], true);
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



kEssayNode.prototype.readMenu=function(idx) {
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
kEssayNode.prototype.createReadMenu=function(aItem) {
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



// idx 是目前 table 所在行的次１行
kEssayNode.prototype.readTable=function(idx, jsn) {
	var nRead = 0;
	var aTDstyle = jsn["tdst"];
//	var out = ["<p><table " + jsn["tblst"] + '>'];
// 加 <p> this.genNode() 只會產生空 p tag，不會含入 table
	var out = ["<table " + jsn["tblst"] + '>'];
	
	for (; idx < this.aLine.length; idx++) {
		nRead++;
		var sLine = this.aLine[idx];
		if (!sLine) continue;
		
		if (/^\^\^\{"end_table".*\}/.test(sLine)) break;
		
		out.push('<tr><td style="' + (aTDstyle[0] || "") + '">');
		
		var aCol = 	sLine.split(jsn.delimter);
		
		aCol.map(function(m, nRowIdx){
			if (nRowIdx < aCol.length-1)
				out.push(m + '</td><td style="' + aTDstyle[nRowIdx+1] + '">');
			else
				out.push(m + "</td></tr>");
		});
	}
	
	out.push("</table>");
//	out.push("</table></p>");
	
	return [nRead, out.join("")];
}


kEssayNode.prototype.isKagLine=function(sLine, nLnIdx) {
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
kEssayNode.prototype.genTableNode=function(jsn) {
	var jTbl = {};
	
	jTbl.nTrIdx = 0;
	
//	if (jsn["nth_e"])
		jTbl.nth_e = jsn["nth_e"] || "";
	
//	if (jsn["nth_o"])
		jTbl.nth_o = jsn["nth_o"] || "";
	
	jTbl.sTDcommonStyle = jsn["tdst"] || "";

//	var ndTbl = document.createElement("TABLE");
	var ndPara = document.createElement("P");
	var ndTbl = this.anaTagStyle(jsn, "table");
	var ndTBody = document.createElement("TBODY");
	
	if (!jsn["noborder"])
		ndTbl.border = 1;
	
	ndTbl.appendChild(ndTBody);
	ndPara.appendChild(ndTbl);
	
	this.ndCurrDiv.appendChild(ndPara)
//	this.ndCurrDiv.appendChild(ndTbl)
	jTbl.table = ndTbl;
//	jTbl.TBody = ndTBody;
	jTbl.currTRow = null;
	//因外裹 <p>
	jTbl.ndPrevDiv = this.ndCurrDiv;
	
	this.moTable = jTbl;
}


//jsn 傳入上層的 jsn["tr"]
kEssayNode.prototype.genTRow =function(jsn) {
//	var htm = this.anaTagStyle(jsn, "tr", true);
//	this.moTable.TBody.insertAdjacentHTML("beforeend", htm);
//	
//	var ndTR = this.moTable.TBody.lastElementChild;
	var ndTR = document.createElement("TR");
	this.moTable.table.appendChild(ndTR);

	if (this.moTable.nTrIdx % 2 == 0 && this.moTable.nth_e)
		ndTR.style.backgroundColor = this.moTable.nth_e;
	else if (this.moTable.nTrIdx % 2 == 1 && this.moTable.nth_o)
		ndTR.style.backgroundColor = this.moTable.nth_o;

	this.moTable.currTRow = ndTR;
	this.moTable.nTrIdx++;
}



//jsn 傳入上層的 nLnIdx, jsn["td"]
kEssayNode.prototype.genTData =function(nLnIdx, jsn) {
	var nRead = 0;
	
	if (!jsn["st"])
		jsn["st"] = this.moTable.sTDcommonStyle;
	else
		jsn["st"] += ";" + this.moTable.sTDcommonStyle;

	var	htm = this.anaTagStyle(jsn, "td", true);
	//htm 此時已含 <td>
//	htm += "</td>";
	this.moTable.currTRow.insertAdjacentHTML("beforeend", htm);
	var ndTD = this.moTable.currTRow.lastElementChild;
	
//	var ndTD = document.createElement("TD");
	
	if (jsn.csp != undefined) {
		ndTD.colSpan = parseInt(jsn.csp);
		jsn.csp = undefined;
	}
	if (jsn.rsp != undefined) {
		ndTD.rowSpan = parseInt(jsn.rsp);
		jsn.rsp = undefined;
	}

	if (jsn.c == undefined) {
		this.ndCurrDiv = ndTD;
		/*nLnIdx++;
		for (; nLnIdx < this.aLine.length; nLnIdx++) {
			nRead++;
			
			var sLine = this.aLine[nLnIdx];
			
//			if (/^\^\^\{"end_table"|\{"td"|\{"\/td".*\}|\{"tr"/i.test(sLine))
			if (/^\^\^\{("end_table"|"td"|"tr")/i.test(sLine)) {
				nRead--;

				ndPara = this.stuffPara(nLnIdx); //paraSty 插入 br
//				this.parseParaStyle();
//				htm += this.parseParaStyle();
				this.NewPara();
	this.ndCurrDiv = ndPrevDiv;
				break;
			} else {
				this.paraText.push(sLine);
			}
		}*/
	} // if (!jValue.c)
	else {
		/*
		var nd = this.anaTagStyle(jsn.c, "p");
		if (!nd.style.marginTop)
			nd.style.marginTop = "0px";
		if (!nd.style.marginBottom)
			nd.style.marginBottom = "0px";
		
		ndTD.appendChild(nd);
		*/
//		ndTD.innerHTML = '<p style="margin-top:0;margin-bottom:0;">' + jsn.c + '</p>';
		ndTD.innerHTML = jsn.c;
	}
}


kEssayNode.prototype.genTableNode_p =function(nLnIdx, jsn) {
	var nRead = 0;
	var nth_e = "";
	if (jsn["nth_e"])
		nth_e = jsn["nth_e"];
	
	var nth_o = "";
	if (jsn["nth_o"])
		nth_o = jsn["nth_o"];
	
	var sTDcommonStyle = jsn["tdst"] || "";

	var ndTbl = document.createElement("TABLE");
	var ndTBody = document.createElement("TBODY");
	
	if (!jsn["noborder"])
		ndTbl.border = 1;
	
	ndTbl.appendChild(ndTBody);
//  var ndTH = document.createElement("TH");
  var ndTR = null;
  var ndTD = null;
  var ndPara = null;
  var jValue = null;
  var nRowSpan = 0;
  var nColSpan = 0;
	
	var nTrIdx = 0, htm = "";
	
	for (; nLnIdx < this.aLine.length; nLnIdx++) {
		nRead++;
		
		var sLine = this.aLine[nLnIdx];
		if (!sLine) continue;
		
		if (/^\^\^\{"end_table".*\}/.test(sLine)) break;
		
		jsn = this.isKagLine(sLine, nLnIdx);
		if (!this.mbFitDevice)
			continue;
		
		if (jsn) {
			//tr 沒有文字內容，不必 anaParaStyle
			if (jsn["tr"]) {
				jValue = jsn["tr"];
 				htm = this.anaTagStyle(jValue, "tr", true);
				ndTBody.insertAdjacentHTML("beforeend", htm);
				ndTR = ndTBody.lastElementChild;
				
				if (nTrIdx % 2 == 0 && nth_e)
					ndTR.style.backgroundColor = nth_e;
				else if (nTrIdx % 2 == 1 && nth_o)
					ndTR.style.backgroundColor = nth_o;
				
				nTrIdx++;
			
			//td 格式：
			// 欄位內容沒有格式者，可逕寫 {"td":{"c":"欄位內容"}}
			// 有格式者：分兩行，◆ 不能含空白行
			// ^^{"td":{"st":"", ...} td Tag 的格式，非 欄位內容
			// ^^{"nti_xx":......}不能含 "PS"
//^^{"td":{"c":""}} 表示此欄為空白，<br/> 可逕寫其中
//^^{"td":{}} 表示此欄內容在下方數列中
			} else if (jsn["td"]) {
				jValue = jsn["td"];

				if (!jValue["st"]) {
					jValue["st"] = "";
					jValue["st"] += sTDcommonStyle;
				} else {
					jValue["st"] += ";" + sTDcommonStyle;
//					console.log(jValue);
				}
//				jsn["td"].st += (jValue.st.slice(-1) == ";" ? "" : ";") + sTDcommonStyle;

				htm = this.anaTagStyle(jValue, "td", true);
				//htm 此時已含 <td>
				
				nRowSpan = 0;
				nColSpan = 0;
				if (jValue.csp) {
					nColSpan = parseInt(jValue.csp);
					jValue.csp = undefined;
				}
				if (jValue.rsp) {
					nRowSpan = parseInt(jValue.rsp);
					jValue.rsp = undefined;
				}

				if (jValue.c == undefined) {
					nLnIdx++;
					for (; nLnIdx < this.aLine.length; nLnIdx++) {
						nRead++;
						sLine = this.aLine[nLnIdx];
						/*
						if (/^\^\^\{"\/td".*\}/.test(sLine)) {
							ndPara = this.stuffPara(nLnIdx, true); //paraSty 插入 br
							htm += this.parseParaStyle();
							this.NewPara();
							break;
						}
						*/

						jsn = this.isKagLine(sLine, nLnIdx);
						if (!this.mbFitDevice)
							continue;
						
						if (jsn) {
							this.parseJSON(jsn, nLnIdx);
						} else {
							this.paraText.push(sLine);
							this.nIdxInPara += sLine.length;
						}
					}
				} // if (!jValue.c)
				else {
					htm += jValue.c;
				}

				htm += "</td>";
				ndTR.insertAdjacentHTML("beforeend", htm);
				ndTD = ndTR.lastElementChild;

				if (nColSpan > 0)
					ndTD.colSpan = nColSpan;
				if (nRowSpan > 0)
					ndTD.rowSpan = nRowSpan;
			}
		}
				
	}
//	console.log(ndTbl);
//	如有 div 時
//	this.ndCurrDiv = this.divRoot;
	return [nRead, ndTbl];
}
