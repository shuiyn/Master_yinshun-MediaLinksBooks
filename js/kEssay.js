/*
◆ 每段只能有唯一的 "PS"，且必於該段的第１行
ln
f_br
div
div:"e" 一般 div 結束
div class="notearea"
div:"eoNA" notearea div 結束
✖div:"eoLev" Toc.level div 結束
br true br
CS_
ST_
a
nti_
ntd_
NA
TAG
PS
table
MENU


^^{"EONArea":1} 註區結束
^^{"EOFText":1} 本文區結束


cs: 0 srcwords  1 sutratext  2 textborder

*/

/*
◆ JSON 的字串型別必用 雙引號包住，不可用單引號；雙引號內如含雙引號 前加 \ 即可。
◆ 段落結束，以插入空白行表之
◆ nti_、ntd_ 要末加識別字，以區分「原著、講義」

置於設定行前１行，以 ^^{} 表之
區塊範圍：nStart, nLength
同行有多組相同 pfx 設定時、附加 _nn 識別之，此 pfx 的 scope 只在此行；nti_nn、ntd_nn 則必依註碼序號標之，實體註序未必流水號，文字亦可
用 JSON 寫法：

^^ NA、div 前必留空行（段結束標記）
但 ^^{"NA":1}、^^{"div":"2~1"} 可鄰行而寫 {"div":"e"} ?


{"CS_1":[11,12,"srcwords"],"nti_1":[11,22],"ST_1":[11,22,"font-size:90%;padding:10px"]}

１個設定跨多行時，
^^{"br":0}	"br": 的值不可= null，餘任何值均可
^^{"CS_1":[10,15, "srcwords"],"CS_2":[21,23, "textborder"]}

◆ tblst 如有 style 可逕加入，如 "tblst":"border=1 style='color:red;'"
^^{"table":{"delimter":",", "row":5, "tblst":"border=1", "tdst":["padding:5px;text-align:center;width:40%;", "padding:5px;"]}}

◆ div 要獨立寫在一段，即其前後都空１行
^^{"div":2.5}
^^{"div":"e"}

◆ NA 要獨立寫在一段，即其前後都空１行
◆ TAG: [start, len, tagName, st]

*/
var openEssayData=function(aLine) {
	var esy = new kEssay(aLine);
	return esy.transData();
	
	var out = esy.transData();
	return out.join("").replace(/\[p[a-z]?\d+\]/g,function(x){
	//		var ma = x.match(/\[(p[a-z]?\d+)\]/);
	//		var opt = document.createElement("option");
	//		opt.text = ma[1].substr(1);
	//		pageList_hand.add(opt);
			
	//		return '<hr/><p id="' + pgIdPfx + ma[1] + '_H" style="color:blue;">' + x + "</p>";
			return '<p style="color:blue;">' + x + "</p>";
//			return '<hr/><p style="color:blue;">' + x + "</p>";
	});
}





var kEssay=function(aLine) {
	this.aLine = aLine;
	this.NewPara();
	this.nRowCount = 1; //各頁所有行的行號，人讀、從 1 起計
	this.mnStatMarginLev = 3; // margin-left 開始設值的 level
	this.mnPrevLev = -1; // > -1 表示已有 toc item
//	this.mnCurrLev = 0;
	this.maToc = [];
//	this.nTry = 0;
//	this.paraText = [];
//	this.paraSty = [];
//	this.nIdxInPara = 0;
//	this.transData();
}


//要跳過「註解區」
kEssay.prototype.jumbNAreaTocLevel=function(bStart) {
	var sRet = "";
	if (bStart)
		sRet = this.settleTocLevel(0, true);
	else {
		for (var i=0; i <= this.mnPrevLev; i++) {
			sRet += this.settleTocLevel(i, false, true);
		}
	}
	
	return sRet;
}

kEssay.prototype.settleTocLevel=function(nLev, bCloseToc, bOpenNA) {
	var sRet = "";
	var nDiff = this.mnPrevLev - nLev;
	var sDist = "0.5em"; //"4px";
	
	if (nLev < this.mnStatMarginLev)
		sDist = "0";
	
	var sDivSty = '<div tocLev="' + nLev + '" style="margin-left:' + sDist + ';text-indent:0;">';
	
	if (bOpenNA) return sDivSty;
		
	if (bCloseToc) sDivSty = "";

	if (nDiff < -1) {
		console.log("Level err:PrevLev= ", this.mnPrevLev, ", CurrLev= ", nLev);
		alert("err level, see console.log!");
	} 
	
//	if (nDiff == -1) {
	if (nDiff < -1) {
		sRet = sDivSty;
	} else if (nDiff == 0) {
		sRet = "</div>" + sDivSty;
		//push </div>
		//push sDivSty
	} else {
		for (var i=0; i <= nDiff; i++) {
			sRet += "</div>";
		//push </div>
		}
		sRet += sDivSty;
		//push sDivSty
	}
	
	if (!bCloseToc)
		this.mnPrevLev = nLev;
	
	return sRet;
}


kEssay.prototype.NewPara=function() {
	this.paraText = [];
	this.paraSty = [];
	this.nIdxInPara = 0;
	this.jsPara = null;
}


kEssay.prototype.parseParaStyle=function(bExParaTag) {
	var aHtmB={};//{"66":["<span...>","<a...>", ...]
	var aHtmE={};
	var aVar = [], sStart = "", sEnd = "", sSet = "";//, sTagSty = "";
	
	this.paraSty.map(function(jsn, nIdx) {
		for (var i in jsn) {
			if (typeof jsn[i] == "undefined") continue;
			
			aVar = jsn[i];
			sStart = aVar[0];

			if (sStart != null)
				sEnd = aVar[0] + aVar[1];
			else
				sEnd = aVar[1];

			sSet = aVar[2]; // if length < 2 ??
			
//			if (aVar[3])
//				sTagSty = aVar[3];
		
			if (sStart != null)
				if(!aHtmB[sStart]) aHtmB[sStart] = [];
			
			if (sEnd != null)
				if(!aHtmE[sEnd]) aHtmE[sEnd] = [];

			if (i == "ln") {
				aHtmB[sStart].unshift('<sup class="falseBR">' + sSet + "</sup>");

			} else if (i == "f_br") {
				aHtmE[sEnd].push('<br class="falseBR" />');

			} else if (/^CS_?\d{0,2}$/.test(i)) {
				if (sSet == "srcwords" || sSet == "0")
					sSet = msSourceWords; //定義於 ys_cell.html
				else if (sSet == "1")
					sSet = "sutratext";
				else if (sSet == "2")
					sSet = "textborder";
					
				aHtmB[sStart].push('<span class="' + sSet + '">');
				aHtmE[sEnd].push('</span>');

			} else if (i == "a") {
				aHtmB[sStart].push('<a href="'+ sSet + '" target="_blank">');
				aHtmE[sEnd].push('</a>');

			} else if (i == "br") { // true br
				aHtmE[sEnd].push("<br/>"); //nStart 前已計實 + sLine.length

			} else if (/^nti_\d+$/.test(i)) {
				if (mbIsPC) {
					aHtmB[sStart].push('<sup id="' + i + '" class="noteNum"><a href="#ntd_' + i.substr(4) + '">');
				
					aHtmE[sEnd].push('</a></sup>');

				//◆ 註序前後各附加１個空白
				} else {
					aHtmB[sStart].push('<sup id="' + i + '" class="noteNum"><a href="#ntd_' + i.substr(4) + '"> ');
				
					aHtmE[sEnd].push('&nbsp;</a></sup>'); //不能逕寫空白，無法顯示
				}

			} else if (/^ntd_\d+$/.test(i)) {
				if (mbIsPC) {
					aHtmB[sStart].push('<sup id="' + i + '" class="noteNum"><a href="#nti_' + i.substr(4) + '">');
				//強制加上 <br/> 移除 class="noteDet"
					aHtmE[sEnd].push('</a>〉</sup><br/>');
				} else {
					aHtmB[sStart].push('<sup id="' + i + '" class="noteNum"><a href="#nti_' + i.substr(4) + '">&nbsp;');
				//強制加上 <br/> 移除 class="noteDet"
					aHtmE[sEnd].push(' </a>〉</sup><br/>');
				}

			} else if (/^ST_?\d{0,2}/.test(i)) {
				aHtmB[sStart].push('<span style="' + sSet + '">');
				aHtmE[sEnd].push('</span>');

			} else if (/^TAG_?\d{0,2}/.test(i)) {
				aHtmB[sStart].push(jsn[i].tagO);
				aHtmE[sEnd].push('</' + sSet + '>');
	/* 在 tranData 中加入 PS，確保可將 lnNo 含入 p 內
			} else if (i == "PS") {
				aHtmB[sStart].push(sSet.tagO);
				aHtmE[sEnd].push('</p>');
*/
			} else {
				console.log("Kag style not defined:", i);
			}
		} //eof for (var i in jsn)
	}); //eof this.paraSty.map

	var sParaCont = this.paraText.join("");
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
	
	if (out) {
// 目前尚未有含 <p>、<div>者 04-23 20:19
//		if (out.search(/<(p|div)[^>]*?>/) > -1)
//			console.log(out);
		if (!bExParaTag && out.search(/<(p|div)[^>]*?>/) == -1)
			out = "<p>" + out + "</p>"
	}
	
	return out;

} //eof parseParaStyle


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

kEssay.prototype.processUnLined=function(jsn, nLnIdx) {
	var aRslt, nReadLines = 0, nLevel = -10, htm = "";
	var bOpenNA = false, bCloseNA = false;
	var nJsnCount = 0; //目前行的 JSON 所含的項目數
	
	for (var itm in jsn) {
		nJsnCount++;
		
		if (itm == "lev" && (typeof jsn[itm] != "undefined")) {
			nReadLines = 0;
			nLevel = jsn[itm];
			jsn[itm] = undefined;
		}
		else if (itm == "MENU" && (typeof jsn[itm] != "undefined")) {
			aRslt = this.readMenu(nLnIdx+1);
			
			if (aRslt) {
				nReadLines = aRslt[0];
				htm = this.createReadMenu(aRslt[1]);
			}
			jsn[itm] = undefined;
			
		} else if (itm == "table" && (typeof jsn[itm] != "undefined")) {
			aRslt = this.readTable(nLnIdx+1, jsn["table"]);
			if (aRslt) {
				nReadLines = aRslt[0];
				htm = aRslt[1];
			}
			jsn[itm] = undefined;
		} else if (itm == "NA" && (typeof jsn[itm] != "undefined")) {
			nReadLines = 0;
			htm = '<img src="' + hostImgURL() + 'noteArea.png" width="25%" height="2px" />'; //<br/>';
			jsn[itm] = undefined;
			
		// div 均以 em 為單位
		} else if (itm == "div" && (typeof jsn[itm] != "undefined")) {
			nReadLines = 0;
			
			if (typeof jsn[itm] == "object") {
				htm = this.anaTagStyle(jsn[itm], "div");
				
				if (jsn[itm].cs != undefined && jsn[itm].cs == "notearea")
					bOpenNA = true;
			} else {
				if (jsn[itm] == "eoNA") {
					bCloseNA = true; // </div> 留在 jumbNAreaTocLevel() 中加入
				} else {
					htm = this.anaDivValue(jsn[itm]);
				}
			}

			jsn[itm] = undefined;
		} // if (itm == "div"
	} // for (var itm in jsn)
	
	var unLined = {};
	
	unLined["openNA"] = bOpenNA;
	unLined["closeNA"] = bCloseNA;
	unLined["rLns"] = nReadLines;
	unLined["jiCount"] = nJsnCount;
	
	if (nLevel != -10)
		unLined["lev"] = nLevel;
		
		if (htm) {
			unLined["htm"] = htm;
//		return [nReadLines, htm, nJsnCount];
		}
//	else
//		return [null, null, nJsnCount];
		return unLined;
}


//para align、class、other style
//ch = children
//lns = lines/Line Count to process
//, "lns":3, "br":[LineNo,...], "ch_csst":{"CS":[nSt, nLen, "name"], "st":....}}

//cs: 0 srcwords  1 sutratext  2 textborder
//{"al":"right", "ml":"", "ti":"", "st":"", "cs":""}
//"pbrF":1, "pbrM":1,"pbrL":1} first, middle, last 將 div 內的 p 設其 margin-top/bottom，使其形同 br
kEssay.prototype.anaTagStyle=function(jTmp, sTagName) {
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
		
		return sTag
} // eof anaTagStyle

kEssay.prototype.anaClass=function(cs) {
	var val = cs.toString();

	if (val == "0" || val == "srcwords") return msSourceWords;
	else if (val == "1") return "sutratext";
	else if (val == "2") return "textborder";
	else return cs;
}

kEssay.prototype.anaUnits=function(id) {
	var val = id.toString();
	if (val.search(/px|pt|em/) == -1) {
		return val + "em";
	} else
		return val;
}


// ？？ div 其他 Style，以陣列代入 或 以 | 分隔
// {"div":2.5  "2~1.5"
// {"div":{"ml":1, "ti"}} 套用 TS
// div 均以 em 為單位
kEssay.prototype.anaDivValue=function(value) {
	if (value == "e" || value == "eoNA")
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


kEssay.prototype.transData=function() {
	var out = [];
	var sLine, jsn;

	//nLnIdx <= this.aLine.length 過１行，以確後最１行讀入
	for (var nLnIdx = 0; nLnIdx <= this.aLine.length; nLnIdx++) {
		sLine = this.aLine[nLnIdx];

		if (!sLine || nLnIdx == this.aLine.length) {
			if (this.jsPara) {
				var nLen = 0;
				if (typeof this.jsPara["brLns"] != "undefined") {
					var aLnNo = this.jsPara["brLns"].toString().split("~");
					var nStt = Number(aLnNo[0]);
					var nEnd = nStt;
					if (aLnNo[1])
						nEnd = Number(aLnNo[1]);
					//this.paraText.length-1 最後１行不能加 <br/>
					for (var i=0; i < this.paraText.length-1; i++) {
						nLen += this.paraText[i].length;
						if (i >= nStt && i <= nEnd)
							this.paraSty.push({"br":[null, nLen]});
					}
					//✖加入最後１行的字數，供後參用
//					nLen += this.paraText[i].length;
				}
				
				//在此加入 <p ...>，下面再加 </P>，以確保 lnNo 可置於 <p> </p>之內
				out.push(this.anaTagStyle(this.jsPara));
//				this.paraSty.unshift({"PS":[0,nLen, this.jsPara]});

			} //eof if (this.jsPara)
			
			if (this.paraText.length > 0)
				out.push(this.parseParaStyle(this.jsPara != null));
			
			if (this.jsPara) {
				out.push("</p>");
				this.jsPara = null;
			}

			this.NewPara();
			if (nLnIdx >= this.aLine.length)
				break;
			else
				continue;
		}

		if (/^\^\^\{.*?\}$/.test(sLine)) {
			try {
				jsn = JSON.parse(sLine.substr(2));
			} catch(e) {
				console.log("第", nLnIdx, "行：", sLine);
				throw e
			}
			
//unLined {"lev":0, "htm":"", "rLns":1, "jiCount":1}
			var unLined = this.processUnLined(jsn, nLnIdx);

			if (unLined["lev"] != undefined) {
				var sTocDiv = this.settleTocLevel(unLined["lev"]);

				this.maToc.push([unLined["lev"], this.aLine[nLnIdx + 1]]);
				
				//可能會有 textborder 使用 span, 所以不可定義於 "PS" 中
				//if (/^CS_?\d{0,2}$/.test(i)) {
				var tocCsName = "tocTitle";
				
				if (jsn["title"] != undefined || jsn["sect"] != undefined) {
					if (jsn["title"] != undefined)
						tocCsName = "esyTitle";
					else //if (jsn["sect"] != undefined)
						tocCsName = "esySection";

					if (jsn["PS"] == undefined)
						jsn["PS"] = {};
					
					jsn["PS"].cs = tocCsName;
				} else
				jsn["CS_99"] = [0, this.aLine[nLnIdx + 1].length, tocCsName]; // "tocTitle" defined in common.css
				unLined["jiCount"]++;
				
				nLnIdx += unLined["rLns"];
				out.push(sTocDiv);
			}
			
			//jumbNAreaTocLevel
			if (unLined["openNA"])
				out.push(this.jumbNAreaTocLevel(true));
			
			if (unLined["closeNA"])
				out.push("</div><hr/>" + this.jumbNAreaTocLevel(false));
			
			if (unLined["htm"]) {
				nLnIdx += unLined["rLns"];
				out.push(unLined["htm"]);
				
				if (unLined["jiCount"] == 1) {
					this.NewPara();
					continue;
				}
			}
			/*
			var aUnLined = this.processUnLined(jsn, nLnIdx);
			
			if (aUnLined[1]) {
				nLnIdx += aUnLined[0];
				out.push(aUnLined[1]);
				
				if (aUnLined[2] == 1) {
					this.NewPara();
					continue;
				}
			}
*/
			this.settleJSON(jsn, nLnIdx);
//			console.log(jsn);
		} //eof if (/^\^\^\{.*?\}$/.test(sLine))
		else { //非標記行、即實體文字行
			
			var tagPageNum = /\[p[a-z]?\d+\]/.exec(sLine);

			//全行只有頁次者，[p1]，不遞加 nRowCount，前也不加 行號
			if (tagPageNum == sLine) {
				if (!/\[p[a-z]?1\]/.test(tagPageNum)) //第１頁碼前可能已含 文章標題等
					this.nRowCount = 1; //新段開始，行號重設 1 起計
					
				this.paraText.push(sLine);
				this.nIdxInPara += sLine.length;
				continue;
			}
			
			jsn = {"ln":[this.nIdxInPara, null, this.nRowCount]};
			this.paraSty.unshift(jsn); //unshift 置首，以免被其他 tag <span> 等包住而誤顯
			//全段的末行、或同一行已含 true br 者，不另加 false br
			if (!this.paraSty.find(function(x){return (x["br"])})) {
				if (nLnIdx < this.aLine.length-1 && this.aLine[nLnIdx+1]) {
					jsn = {"f_br":[null, this.nIdxInPara + sLine.length]};
					this.paraSty.push(jsn);
				}
			}

			this.paraText.push(sLine);
			this.nIdxInPara += sLine.length;

			if (tagPageNum)
				this.nRowCount = 1;
			else
				this.nRowCount++;
		} // else非標記行、即實體文字行

	} // for nLnIdx this.aLine
	
	if (this.paraText.length > 0)
			out.push(this.parseParaStyle());

	// 收束 Toc div
	if (this.maToc.length > 0) {
		out.push(this.settleTocLevel(0, true));
//		console.log(out);
	}
	
	return out;
}

kEssay.prototype.settleJSON=function(jsn, nLnIdx) {
	for (var ji in jsn) {
		if (jsn[ji] == undefined) continue;
		
		if (ji == "br") { // true br, not false br
			//該行末位
			jsn["br"] = [null, this.nIdxInPara + this.aLine[nLnIdx + 1].length];
		} else if (/^TAG_?\d{0,2}/.test(ji)) {
			var aTmp = jsn[ji];
			var tmpJ = {"st":aTmp[3]};
			jsn[ji].tagO = this.anaTagStyle(tmpJ, aTmp[2]);
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

// idx 是目前 table 所在行的次１行
kEssay.prototype.readTable=function(idx, jsn) {
	var nRead = 0;
	var aTDstyle = jsn["tdst"];
	var out = ["<p><table " + jsn["tblst"] + '>'];
	
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
	
	out.push("</table></p>");
	
	return [nRead, out.join("")];
}

