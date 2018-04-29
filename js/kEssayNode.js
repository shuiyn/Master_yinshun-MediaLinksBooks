
var togglePageNum=function() {
	var eHrNums = document.getElementsByClassName("__pageNumHrDiv");
	var sDisp = "none";
	if (eHrNums && (eHrNums[0].style.display == "none"))
		sDisp = "block";

	var eNums = document.getElementsByClassName("__pageNum");
	/*
	if (eNums) {
		if (sDisp == "block") {
			for (var i=0; i < eNums.length; i++) {
				eNums[i].innerHTML = eNums[i].getAttribute("pgNum");
			}
		} else {
			for (var i=0; i < eNums.length; i++) {
				eNums[i].innerHTML = "";
			}
		}
	}*/
	
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


//讀取書本的各「章」名稱，作為選單
var grabEssayChapter=function(jsEsy) {
	var aChapt = [];
	for (s in jsEsy) {
		aChapt.push(s);
	}
	
	return aChapt;
}

//將指定的「章」，填入展示的 divRoot
var openEssay=function(divRoot, jsnChapter) {
	var esy = new kEssayNode(divRoot, jsnChapter);
	esy.transData();
}


/*
需要斷行者：
	noteArea

*/

var kEssayNode=function(divRoot, jsnChapter) {
	this.divRoot = divRoot;
	this.aLine = jsnChapter.c;
	this.mnStartMarginLev = 3; // margin-left 開始設值的 level，1 是「節」
	if (jsnChapter.mlStartLev != undefined)
		this.mnStartMarginLev = jsnChapter.mlStartLev;
	// pgNum -> [p[a-z]?\d+]
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
		
		if (/^\^\^\{.*?\}$/.test(sLine)) {
			try {
				jsn = JSON.parse(sLine.substr(2));
			} catch(e) {
				console.log("第", nLnIdx, "行：", sLine);
				throw e
			}
			
			this.processUnLined(jsn, nLnIdx);
			nLnIdx += this.mnReadExtra;
			
			this.parseJSON(jsn, nLnIdx);
			
		} //eof if (/^\^\^\{.*?\}$/.test(sLine))
		else if (sLine.startsWith("<img ")){
			this.ndCurrDiv.appendChild(this.genNode(sLine));
		}
		else { //非標記行、即實體文字行
			var aTestNum = /\[p[a-z]?\d+\]/.exec(sLine);
			var tagPageNum = null;
			if (aTestNum)
				tagPageNum = aTestNum[0];
			
			var jTmpLine = null;
			
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
			
			this.paraText.push(sLine);
			
			if (tagPageNum) {
				this.paraSty.push({"pgNum":[this.nIdxInPara + sLine.indexOf(tagPageNum), tagPageNum.length, tagPageNum]});
				
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
kEssayNode.prototype.jumbNAreaTocLevel=function(bStart) {
	if (bStart)
		this.settleTocLevel(0, true);
	else {
		for (var i=0; i <= this.mnPrevLev; i++) {
			this.settleTocLevel(i, false, true);
		}
	}
}


kEssayNode.prototype.settleTocLevel=function(nLev, bCloseToc, bOpenNA) {
	var sRet = "";
	var nDiff = this.mnPrevLev - nLev;
	var sDist = "0.5em"; //"4px";
	
	if (nLev < this.mnStartMarginLev)
		sDist = "0";
	
	var sDivSty = '<div tocLev="' + nLev + '" style="margin-left:' + sDist + ';text-indent:0;">';
	
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
				this.closeCurrDiv();
		} else {
			for (var i=0; i <= nDiff; i++) {
				this.closeCurrDiv();
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
kEssayNode.prototype.closeCurrDiv=function() {
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
			
		} else if (itm == "table" && (jsn[itm] != undefined)) {
			aRslt = this.readTable(nLnIdx+1, jsn["table"]);
			if (aRslt) {
				nReadLines = aRslt[0];
				htm = aRslt[1];
				this.ndCurrDiv.appendChild(this.genNode(htm));
		}
			jsn[itm] = undefined;
		} else if (itm == "NA" && (jsn[itm] != undefined)) {
			nReadLines = 0;
			htm = '<img src="' + hostImgURL() + 'noteArea.png" width="25%" height="2px" />'; //<br/>';
				this.ndCurrDiv.appendChild(this.genNode(htm));
				
			jsn[itm] = undefined;
			
		// div 均以 em 為單位
		} else if (itm == "div" && (jsn[itm] != undefined)) {
			nReadLines = 0;
			
			if (typeof jsn[itm] == "object") {
				if (jsn[itm].cs != undefined && jsn[itm].cs.startsWith("notearea")) //mobil is notearea_m
					this.jumbNAreaTocLevel(true);

				nd = this.anaTagStyle(jsn[itm], "div");
				this.ndCurrDiv.appendChild(nd);
				this.ndCurrDiv = nd;
				
			} else {
				if (jsn[itm] == "eoNA") {
					this.closeCurrDiv();
					this.jumbNAreaTocLevel(false);
				} else {
					htm = this.anaDivValue(jsn[itm]);
					if (htm == '</div>')
						this.closeCurrDiv();
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
	
	this.settleTocLevel(jToc["lev"]);
	
	//可能會有 textborder 使用 span, 所以不可定義於 "PS" 中
	var tocCsName = "tocTitle";
	
	// "tocTitle、esyTitle、esySection" defined in common.css
	if (jToc["title"] != undefined || jToc["sect"] != undefined) {
		if (jToc["title"] != undefined)
			tocCsName = "esyTitle";
		else
			tocCsName = "esySection";

		if (jsn["PS"] == undefined) //此為 jsn 非 jToc，供 transData() 處理
			jsn["PS"] = {};
		
		jsn["PS"].cs = tocCsName;
	} else {
		var sTmpLine = this.aLine[nLnIdx + 1];
		var nTitRight = sTmpLine.search(/（p[^）]+）$/);
		if (nTitRight > -1) {
			sTmpLine = sTmpLine.slice(0, nTitRight);
		}
		
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
		
		this.ndCurrPara = this.anaTagStyle(this.jsPara);

	} //eof if (this.jsPara)
	else
		this.ndCurrPara = document.createElement("P");
	
	var sPara = this.parseParaStyle();
	this.ndCurrPara.innerHTML = sPara;
	this.ndCurrDiv.appendChild(this.ndCurrPara);

	this.settlePageNum();
} // eof stuffPara()


kEssayNode.prototype.anaTagStyle=function(jTmp, sTagName) {
	var sTagName = sTagName || "p"; //預設為 p，可用於其他 Tag，取代原 TAG
	var sTag = "";
	var aPgSty = [];
	
	if (jTmp["st"])
		aPgSty.push(jTmp["st"]); //.replace(/[;]+$/, "");
	
	if (sTagName == "p" || sTagName == "div") {
		if (typeof jTmp["ml"] != "undefined")
				aPgSty.push("margin-left:" + this.anaUnits(jTmp["ml"]));
		if (typeof jTmp["ti"] != "undefined")
				aPgSty.push("text-indent:" + this.anaUnits(jTmp["ti"]));
		
		if (typeof jTmp["al"] != "undefined")
			aPgSty.push("text-align:" + jTmp["al"]);
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
		sTag = '<' + sTagName + ' style="' + aPgSty.join(";") + '"';
	}
	
	if (typeof jTmp["cs"] != "undefined") {
		var sTmp = this.anaClass(jTmp["cs"]);
		
		if (sTag)
			sTag += ' class="' + sTmp + '"';
		else
			sTag = '<' + sTagName + ' class="' + sTmp + '"';
	}
	
	if (sTag) sTag += '>';
	else sTag = '<' + sTagName + '>';
	
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
				aHtmB[sStart].push('<span class="__pageNum" pgNum="' + sSet + '">');
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

			} else if (/^ST_?\d{0,2}/.test(jItm)) {
				aHtmB[sStart].push('<span style="' + sSet + '">');
				aHtmE[sEnd].unshift('</span>');

			} else if (/^TAG_?\d{0,2}/.test(jItm)) {
				aHtmB[sStart].push(jsn[jItm].tagO);
				aHtmE[sEnd].push('</' + sSet + '>');
			} else {
				console.log("Kag style not defined:", jItm);
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
	if (out.search(/<(p|div)[^>]*?>/) > -1)
		console.log("out 含有 p|div Tag");
	
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
			jsn[ji].tagO = this.anaTagStyle(tmpJ, aTmp[2]).outerHTML;
			jsn[ji][0] += this.nIdxInPara;

		} else if (ji == "PS") { //para align、class、other style
//			jsn["PS"].tagO = this.anaTagStyle(jsn["PS"]);
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
	var sPath = "img/";//hostImgURL();
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
