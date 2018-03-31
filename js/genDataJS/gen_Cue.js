
var fs = require("fs");
var aLine = fs.readFileSync("cue_List.txt","utf8").split(/\r?\n/);
var sLine = "";
var out = {};
var master="",book="",phase="", mp3Main="";

for (var i=0; i<aLine.length; i++) {
	sLine = aLine[i].trim();
	
	if (!sLine) continue;
	if (sLine.startsWith("//")) continue;
	if (sLine.startsWith("#")) continue;
	
	if (sLine.startsWith("◆")) {
		var aId = sLine.substr(1).trim().split("_");
		master = aId[0].trim();
		book = aId[1].trim();
		phase = aId[2].trim();
		
	} else if (sLine.startsWith("✈")) {
		if (!out[master]) out[master]={};
		if (!out[master][book]) out[master][book]={};
		if (!out[master][book][phase]) out[master][book][phase]={};

		mp3Main=sLine.substr(1).trim();
		out[master][book][phase][mp3Main]=[];
		
	} else if (/^\d/.test(sLine)) {
		out[master][book][phase][mp3Main].push(sLine);
	}
}

//console.log("var course_list=\n" + JSON.stringify(out,""," "));
fs.writeFileSync("cue_List.js", "var cue_List=\n" + JSON.stringify(out,""," "), "utf8");

