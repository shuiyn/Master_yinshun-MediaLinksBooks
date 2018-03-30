/*
	O:/O_Github/Master_yinshun-MediaLinksBooks/Text/bksrc/jkjjj-mark.txt
	convert to JSON, for checking repeated id
*/

var fs=require("fs");
var lst=["jkjjj-mark.txt"];
//var lst=fs.readFileSync("data/data.lst","utf8").split(/\r?\n/);
var toJSON=function(fn){
	var cont=fs.readFileSync("../Text/bksrc/" + fn,"utf8");
	var lines=cont.split(/\r?\n/);
	var bkid="1.";
	var nLineCount=1;
	var out={};
	/*
{
"1.1":["[p1]",],
"1.2":["一 金剛般若波羅蜜經講記","0"],
"1.3":["──民國三十一年春講於四川法王學院──","c"],
"1.4":["懸論","1"],
"1.5":["金剛經，在中國佛教界，流行極為普遍。如三論、天臺、賢首、唯識各宗，都有注疏。尤",]
	*/
	
	for (var i=0; i<lines.length; i++){
		if (!lines[i]) continue;
		
		var nPos = lines[i].search(/\t[^\t]*$/);
		var id = bkid + nLineCount;
		
		if (nPos > -1) {
			out[id] = [lines[i].slice(0, nPos),lines[i].slice(nPos + 1)];
		} else {
			out[id]= [lines[i],""];
		}
		
		nLineCount++;
	}
	
	return out;
}
 /*
var x_tojson=function(fn) {
//	var content=fs.readFileSync("data/"+fn,"utf8")
	var content=fs.readFileSync(fn,"utf8")
	var lines=content.split(/\r?\n/);
	var out={};

	for (var i=0;i<lines.length;i++) {
		var L=lines[i].split("\t");
		var id=L[0],text=L[1];
		if (out[id]) {
			console.log("repeat id",id,"at line",i+1,"of",fn)
		}
		out[id]=text;
	}
	return out;
}
*/


var writejson=function(json,idx) {
	var outfn="../Text/out/" + lst[idx].slice(0, lst[idx].lastIndexOf(".")) + ".json";
	fs.writeFileSync(outfn,JSON.stringify(json,""," "),"utf8");	
}
var output = lst.map(toJSON);
output.map(writejson);


/* load a set of files, filename is given by a list file*/
 
/*
var fs=require("fs");
var lst=fs.readFileSync("data/data.lst","utf8").split(/\r?\n/);
var showfileline=function(fn,idx) {
	var content=fs.readFileSync("data/"+fn,"utf8")
	var lines=content.split(/\r?\n/);
	console.log(fn,lines.length,"average",content.length/lines.length);
}
lst.map(showfileline);
*/

/*
for (var i=0;i<lst.length;i++) {
	fn=lst[i];
	showfileline(fn,i);
}
*/