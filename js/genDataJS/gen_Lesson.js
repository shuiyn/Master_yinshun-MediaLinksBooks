
var fs = require("fs");
var aLine = fs.readFileSync("lesson_List.txt","utf8").split(/\r?\n/);
var sLine = "";
var out = {};
var master="",book="",phase="";

for (var i=0; i<aLine.length; i++) {
	sLine = aLine[i].trim();
	
	if (!sLine) continue;
	if (sLine.startsWith("//")) continue;
	
	if (!sLine.startsWith("◆")) {
		if (!out[master]) out[master]={};
		if (!out[master][book]) out[master][book]={};
		if (!out[master][book][phase]) out[master][book][phase]=[];
		var aVal=sLine.split(",");
		aVal.length = 3;
		if (!aVal[1]) aVal[1]="";
		if (!aVal[2]) aVal[2]="";
		out[master][book][phase].push({"d":aVal[0].trim(),"url":aVal[1].trim(), "ybk":aVal[2].trim()});
		
	} else {
		var aId = sLine.substr(1).trim().split("_");
		master = aId[0].trim();
		book = aId[1].trim();
		phase = aId[2].trim();
	}
}

//console.log("var course_list=\n" + JSON.stringify(out,""," "));
fs.writeFileSync("lesson_List.js", "var lesson_List=\n" + JSON.stringify(out,""," "), "utf8");

