

//lecture 為陣列，餘為 類別
var lecture_List = [
//宗恒 金剛經 教授班
	{"book":"jkjjj", "master":"zh", "croom":"pn", "phase":[
{"id":"pn1041223", "t":"104 年第 1 期", "url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=690&totable=1"},
{"id":"pn1060913", "t":"106 年第 2 期", "url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=724&totable=1"}
		]
	},
	
//開仁 佛法概論 般若精舍	
	{"book":"ffgl", "master":"kr", "croom":"pn", "phase":[
{"id":"pn1040321", "t":"104 年第 8 期", "url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=687&totable=1"},
{"id":"pn1050910", "t":"105 年第 9 期", "url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=694&totable=1"},
{"id":"pn1060318", "t":"106 年第 10 期", "url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=710&totable=1"},
{"id":"pn1060916", "t":"106 年第 11 期","url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=725&totable=1"}
		]
	},

//開仁 佛法概論 慧日講堂	
	{"book":"ffgl", "master":"kr", "croom":"wl", "phase":[
{"id":"wl20090918", "t":"98 年第 1 期", "url":"http://video.lwdh.org.tw/html/ffgl/ffgl01.html"},
{"id":"wl20100305", "t":"99 年第 2 期", "url":"http://video.lwdh.org.tw/html/ffgl/ffgl02.html"}
		]
	}
]


//{"books":[], "master":[], "croom":[]}
//base_List.book[1].id

var base_List = {
"book":[
	{"name":"佛法概論", "id":"ffgl"},
	{"name":"金剛經講記", "id":"jkjjj"},
	{"name":"成佛之道", "id":"cfzd"}
],

"master":[
{"name":"開仁法師", "id":"kr"},
{"name":"宗恒法師", "id":"zh"}
],

"croom":[
{"name":"慧日講堂", "id":"wl"},
{"name":"福嚴佛學院", "id":"fy"},
{"name":"般若精舍", "id":"pn"}
]
}
	
//以此 data 為中心出發點，往上、下組織相關資料集 phase、course
//各書的授課法師、地點、[初授日]
var book_master_croom=[
{"id":"0003", "book":"jkjjj", "master":"zh", "byear":"104", "croom":"pn"},
{"id":"0001", "book":"ffgl", "master":"kr", "byear":"104", "croom":"pn"},
{"id":"0002", "book":"ffgl", "master":"kr", "byear":"098", "croom":"wl"}
];



var books=[
{"name":"佛法概論", "id":"ffgl", "url":"http://www.mahabodhi.org/files/yinshun/21/yinshun21-01.html"},
{"name":"金剛經講記", "id":"jkjjj", "url":"http://www.mahabodhi.org/files/yinshun/00/yinshun00-02.html"},
{"name":"成佛之道", "id":"cfzd", "url":"http://www.mahabodhi.org/files/yinshun/10/yinshun10-01.html"}
];


//授課法師
var masters=[
{"name":"開仁法師", "id":"kr"},
{"name":"宗恒法師", "id":"zh"}
];

//授課地點 vihara
var crooms=[
{"name":"慧日講堂", "id":"wl"},
{"name":"福嚴佛學院", "id":"fy"},
{"name":"般若精舍", "id":"pn"}
];


//宗恒 金剛經講記 期別 title、phase、url
var 0003=[
{"p":"104 年第 1 期", "url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=690&totable=1"},
{"p":"106 年第 2 期", "url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=724&totable=1"}
];


//宗恒 金剛經講記 課堂別
//url=="" 者，只供顯示、點選之 handler 不回應處理
var course_0003=[
{"p":"1", "d":"104 年", "url":""},
{"p":"1", "d":"12-23", "ybk-o":"01-01-01", "ybk":"1.1~1.31", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1041223.mp3"},
{"p":"1", "d":"105 年", "url":""},
{"p":"1", "d":"01-13: 1　", "ybk-o":"01-01-02", "ybk":"1.1~1.31", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050113-1.mp3"},
{"p":"1", "d":"01-13: 2", "ybk":"1.31~1.36", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050113-2.mp3"},
{"p":"1", "d":"01-27: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050127-1.mp3"},
{"p":"1", "d":"01-27: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050127-2.mp3"},
{"p":"1", "d":"03-09: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050309-1.mp3"},
{"p":"1", "d":"03-09: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050309-2.mp3"},
{"p":"1", "d":"03-23: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050323-1.mp3"},
{"p":"1", "d":"03-23: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050323-2.mp3"},
{"p":"1", "d":"04-13: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050413-1.mp3"},
{"p":"1", "d":"04-13: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050413-2.mp3"},
{"p":"1", "d":"04-27: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050427-1.mp3"},
{"p":"1", "d":"04-27: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050427-2.mp3"},
{"p":"1", "d":"05-11: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050511-1.mp3"},
{"p":"1", "d":"05-11: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050511-2.mp3"},
{"p":"1", "d":"05-25: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050525-1.mp3"},
{"p":"1", "d":"05-25: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050525-2.mp3"},
{"p":"1", "d":"06-01: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050601-1.mp3"},
{"p":"1", "d":"06-01: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050601-2.mp3"},
{"p":"1", "d":"06-22: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050622-1.mp3"},
{"p":"1", "d":"06-22: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1050622-2.mp3"},
{"p":"1", "d":"10-12: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051012-1.mp3"},
{"p":"1", "d":"10-12: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051012-2.mp3"},
{"p":"1", "d":"10-26: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051026-1.mp3"},
{"p":"1", "d":"10-26: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051026-2.mp3"},
{"p":"1", "d":"11-09: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051110-1.mp3"},
{"p":"1", "d":"11-09: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051110-2.mp3"},
{"p":"1", "d":"11-23: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051123-1.mp3"},
{"p":"1", "d":"11-23: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051123-2.mp3"},
{"p":"1", "d":"12-14: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051214-1.mp3"},
{"p":"1", "d":"12-14: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051214-2.mp3"},
{"p":"1", "d":"12-28: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051228-1.mp3"},
{"p":"1", "d":"12-28: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1051228-2.mp3"},
{"p":"1", "d":"106 年", "url":""},
{"p":"1", "d":"01-11: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060111-1.mp3"},
{"p":"1", "d":"01-11: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060111-2.mp3"},
{"p":"1", "d":"03-01: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060301-1.mp3"},
{"p":"1", "d":"03-01: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060301-2.mp3"},
{"p":"1", "d":"03-22: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060322-1.mp3"},
{"p":"1", "d":"03-22: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060322-2.mp3"},
{"p":"1", "d":"04-12: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060412-1.mp3"},
{"p":"1", "d":"04-12: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060412-2.mp3"},
{"p":"1", "d":"04-26: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060426-1.mp3"},
{"p":"1", "d":"04-26: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060426-2.mp3"},
{"p":"1", "d":"05-10: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060510-1.mp3"},
{"p":"1", "d":"05-10: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060510-2.mp3"},
{"p":"1", "d":"05-31: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060531-1.mp3"},
{"p":"1", "d":"05-31: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060531-2.mp3"},
{"p":"1", "d":"06-14: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060614-1.mp3"},
{"p":"1", "d":"06-14: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060614-2.mp3"},
{"p":"1", "d":"06-28: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060628-1.mp3"},
{"p":"1", "d":"06-28: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060628-2.mp3"},

{"p":"2", "d":"106 年", "url":""},
{"p":"2", "d":"09-13: 1　", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060913-1.mp3"},
{"p":"2", "d":"09-13: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060913-2.mp3"},
{"p":"2", "d":"09-27: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060927-1.mp3"},
{"p":"2", "d":"09-27: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1060927-2.mp3"},
{"p":"2", "d":"10-11: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061011-1.mp3"},
{"p":"2", "d":"10-11: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061011-2.mp3"},
{"p":"2", "d":"10-25: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061025-1.mp3"},
{"p":"2", "d":"10-25: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061025-2.mp3"},
{"p":"2", "d":"11-01: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061101-1.mp3"},
{"p":"2", "d":"11-01: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061101-2.mp3"},
{"p":"2", "d":"11-22: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061122-1.mp3"},
{"p":"2", "d":"11-22: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061122-2.mp3"},
{"p":"2", "d":"12-13: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061213-1.mp3"},
{"p":"2", "d":"12-13: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061213-2.mp3"},
{"p":"2", "d":"12-27: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061227-1.mp3"},
{"p":"2", "d":"12-27: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1061227-2.mp3"},

{"p":"2", "d":"107 年", "url":""},
{"p":"2", "d":"01-10: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1070110-1.mp3"},
{"p":"2", "d":"01-10: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1070110-2.mp3"},
{"p":"2", "d":"01-24: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1070124-1.mp3"},
{"p":"2", "d":"01-24: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1070124-2.mp3"},
{"p":"2", "d":"03-28: 1", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1070328-1.mp3"},
{"p":"2", "d":"03-28: 2", "url":"http://220.130.244.41:8080/Study/DiamondSutra/1070328-2.mp3"}
];


//{"p":"2", "d":"04-11: 1", "url":""},
//{"p":"2", "d":"04-11: 2", "url":""},





//開仁 佛法概論 期別
var 0001=[
{"p":"104 年第 8 期", "url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=687&totable=1"},
{"p":"105 年第 9 期", "url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=694&totable=1"},
{"p":"106 年第 10 期", "url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=710&totable=1"},
{"p":"106 年第 11 期","url":"http://www.kyba.org.tw/board/showcontent.asp?bd=11&id=725&totable=1"}
];

//kr 開仁法師 pn 般若精舍 ffgl 佛法概論  104年第 8 期
//開仁 佛法概論 課堂別
//var ffgl_kr_pn=[
var course_0001=[
{"p":"8", "d":"03-21: 1　", "url":"http://220.130.244.41:8080/prajna/20150321-1.mp3"},
{"p":"8", "d":"03-21: 2", "url":"http://220.130.244.41:8080/prajna/20150321-2.mp3"},
{"p":"8", "d":"03-21: 3", "url":"http://220.130.244.41:8080/prajna/20150321-3.mp3"},
{"p":"8", "d":"04-18: 1", "url":"http://220.130.244.41:8080/prajna/20150418-1.mp3"},
{"p":"8", "d":"04-18: 2", "url":"http://220.130.244.41:8080/prajna/20150418-2.mp3"},
{"p":"8", "d":"04-18: 3", "url":"http://220.130.244.41:8080/prajna/20150418-3.mp3"},
{"p":"8", "d":"05-16: 1", "url":"http://220.130.244.41:8080/prajna/20150516-1.mp3"},
{"p":"8", "d":"05-16: 2", "url":"http://220.130.244.41:8080/prajna/20150516-2.mp3"},
{"p":"8", "d":"05-16: 3", "url":"http://220.130.244.41:8080/prajna/20150516-3.mp3"},
{"p":"8", "d":"06-06: 1", "url":"http://220.130.244.41:8080/prajna/20150606-1.mp3"},
{"p":"8", "d":"06-06: 2", "url":"http://220.130.244.41:8080/prajna/20150606-2.mp3"},
{"p":"8", "d":"06-06: 3", "url":"http://220.130.244.41:8080/prajna/20150606-3.mp3"},
{"p":"8", "d":"09-19: 1", "url":"http://220.130.244.41:8080/prajna/20150919-1.mp3"},
{"p":"8", "d":"09-19: 2", "url":"http://220.130.244.41:8080/prajna/20150919-2.mp3"},
{"p":"8", "d":"09-19: 3", "url":"http://220.130.244.41:8080/prajna/20150919-3.mp3"},
{"p":"8", "d":"10-17: 1", "url":"http://220.130.244.41:8080/prajna/20151017-1.mp3"},
{"p":"8", "d":"10-17: 2", "url":"http://220.130.244.41:8080/prajna/20151017-2.mp3"},
{"p":"8", "d":"10-17: 3", "url":"http://220.130.244.41:8080/prajna/20151017-3.mp3"},
{"p":"8", "d":"11-21: 1", "url":"http://220.130.244.41:8080/prajna/20151121-1.mp3"},
{"p":"8", "d":"11-21: 2", "url":"http://220.130.244.41:8080/prajna/20151121-2.mp3"},
{"p":"8", "d":"11-21: 3", "url":"http://220.130.244.41:8080/prajna/20151121-3.mp3"},
{"p":"8", "d":"12-19: 1", "url":"http://220.130.244.41:8080/prajna/20151219-1.mp3"},
{"p":"8", "d":"12-19: 2", "url":"http://220.130.244.41:8080/prajna/20151219-2.mp3"},
{"p":"8", "d":"12-19: 3", "url":"http://220.130.244.41:8080/prajna/20151219-3.mp3"},

{"p":"9", "d":"09-11: 1", "url":"http://220.130.244.41:8080/prajna/20160910-1.mp3"},
{"p":"9", "d":"09-11: 2", "url":"http://220.130.244.41:8080/prajna/20160910-2.mp3"},
{"p":"9", "d":"09-11: 3", "url":"http://220.130.244.41:8080/prajna/20160910-3.mp3"},
{"p":"9", "d":"10-15: 1A　", "url":"http://220.130.244.41:8080/prajna/20161015-1a.mp3"},
{"p":"9", "d":"10-15: 1B", "url":"http://220.130.244.41:8080/prajna/20161015-1b.mp3"},
{"p":"9", "d":"10-15: 2", "url":"http://220.130.244.41:8080/prajna/20161015-2.mp3"},
{"p":"9", "d":"10-15: 3", "url":"http://220.130.244.41:8080/prajna/20161015-3.mp3"},
{"p":"9", "d":"11-19: 1A", "url":"http://220.130.244.41:8080/prajna/20161119-1a.mp3"},
{"p":"9", "d":"11-19: 1B", "url":"http://220.130.244.41:8080/prajna/20161119-1b.mp3"},
{"p":"9", "d":"11-19: 2", "url":"http://220.130.244.41:8080/prajna/20161119-2.mp3"},
{"p":"9", "d":"11-19: 3", "url":"http://220.130.244.41:8080/prajna/20161119-3.mp3"},
{"p":"9", "d":"12-17: 1", "url":"http://220.130.244.41:8080/prajna/20161217-1.mp3"},
{"p":"9", "d":"12-17: 2", "url":"http://220.130.244.41:8080/prajna/20161217-2.mp3"},
{"p":"9", "d":"12-17: 3", "url":"http://220.130.244.41:8080/prajna/20161217-3.mp3"},
	
{"p":"10", "d":"03-18: 1", "url":"http://220.130.244.41:8080/prajna/20170318-1.mp3"},
{"p":"10", "d":"03-18: 2", "url":"http://220.130.244.41:8080/prajna/20170318-2.mp3"},
{"p":"10", "d":"03-18: 3", "url":"http://220.130.244.41:8080/prajna/20170318-3.mp3"},
{"p":"10", "d":"04-15: 1", "url":"http://220.130.244.41:8080/prajna/20170415-1.mp3"},
{"p":"10", "d":"04-15: 2", "url":"http://220.130.244.41:8080/prajna/20170415-2.mp3"},
{"p":"10", "d":"04-15: 3", "url":"http://220.130.244.41:8080/prajna/20170415-3.mp3"},
{"p":"10", "d":"05-20: 1A　", "url":"http://220.130.244.41:8080/prajna/20170520-1a.mp3"},
{"p":"10", "d":"05-20: 1B", "url":"http://220.130.244.41:8080/prajna/20170520-1b.mp3"},
{"p":"10", "d":"05-20: 2", "url":"http://220.130.244.41:8080/prajna/20170520-2.mp3"},
{"p":"10", "d":"05-20: 3", "url":"http://220.130.244.41:8080/prajna/20170520-3.mp3"},
	
{"p":"11", "d":"09-16: 1　", "url":"http://220.130.244.41:8080/prajna/20170916-1.mp3"},
{"p":"11", "d":"09-16: 2", "url":"http://220.130.244.41:8080/prajna/20170916-2.mp3"},
{"p":"11", "d":"09-16: 3", "url":"http://220.130.244.41:8080/prajna/20170916-3.mp3"},
{"p":"11", "d":"10-21: 1", "url":"http://220.130.244.41:8080/prajna/20171021-1.mp3"},
{"p":"11", "d":"10-21: 2", "url":"http://220.130.244.41:8080/prajna/20171021-2.mp3"},
{"p":"11", "d":"10-21: 3", "url":"http://220.130.244.41:8080/prajna/20171021-3.mp3"},
{"p":"11", "d":"11-18: 1", "url":"http://220.130.244.41:8080/prajna/20171118-1.mp3"},
{"p":"11", "d":"11-18: 2", "url":"http://220.130.244.41:8080/prajna/20171118-2.mp3"},
{"p":"11", "d":"11-18: 3", "url":"http://220.130.244.41:8080/prajna/20171118-3.mp3"},
{"p":"11", "d":"12-16: 1", "url":"http://220.130.244.41:8080/prajna/20171216-1.mp3"},
{"p":"11", "d":"12-16: 2", "url":"http://220.130.244.41:8080/prajna/20171216-2.mp3"},
{"p":"11", "d":"12-16: 3", "url":"http://220.130.244.41:8080/prajna/20171216-3.mp3"}
];


var phase_0002=[
{"p":"98 年第 1 期", "url":"http://video.lwdh.org.tw/html/ffgl/ffgl01.html"},
{"p":"99 年第 2 期", "url":"http://video.lwdh.org.tw/html/ffgl/ffgl02.html"}
];


var course_0002=[
{"p":"1", "d":"001A　", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl001A(20090918).mp3"},
{"p":"1", "d":"001B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl001B(20090918).mp3"},
{"p":"1", "d":"002A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl002A(20090925).mp3"},
{"p":"1", "d":"002B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl002B(20090925).mp3"},
{"p":"1", "d":"003A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl003A(20091016).mp3"},
{"p":"1", "d":"003B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl003B(20091016).mp3"},
{"p":"1", "d":"004A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl004A(20091030).mp3"},
{"p":"1", "d":"004B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl004B(20091030).mp3"},
{"p":"1", "d":"005A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl005A(20091106).mp3"},
{"p":"1", "d":"005B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl005B(20091106).mp3"},
{"p":"1", "d":"006A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl006A(20091120).mp3"},
{"p":"1", "d":"006B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl006B(20091120).mp3"},
{"p":"1", "d":"007A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl007A(20091127).mp3"},
{"p":"1", "d":"007B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl007B(20091127).mp3"},
{"p":"1", "d":"008A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl008A(20091204).mp3"},
{"p":"1", "d":"008B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl008B(20091204).mp3"},
{"p":"1", "d":"009A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl009A(20091211).mp3"},
{"p":"1", "d":"009B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl009B(20091211).mp3"},
{"p":"1", "d":"010A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl010A(20091218).mp3"},
{"p":"1", "d":"010B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl010B(20091218).mp3"},
{"p":"1", "d":"011A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl011A(20091225).mp3"},
{"p":"1", "d":"011B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl011B(20091225).mp3"},
{"p":"1", "d":"012A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl012A(20100115).mp3"},
{"p":"1", "d":"012B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl1/ffgl012B(20100115).mp3"},

{"p":"2", "d":"013A　", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl013A(20100305).mp3"},
{"p":"2", "d":"013B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl013B(20100305).mp3"},
{"p":"2", "d":"014A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl014A(20100319).mp3"},
{"p":"2", "d":"014B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl014B(20100319).mp3"},
{"p":"2", "d":"015A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl015A(20100326).mp3"},
{"p":"2", "d":"015B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl015B(20100326).mp3"},
{"p":"2", "d":"016A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl016A(20100402).mp3"},
{"p":"2", "d":"016B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl016B(20100402).mp3"},
{"p":"2", "d":"017A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl017A(20100409).mp3"},
{"p":"2", "d":"017B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl017B(20100409).mp3"},
{"p":"2", "d":"018A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl018A(20100416).mp3"},
{"p":"2", "d":"018B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl018B(20100416).mp3"},
{"p":"2", "d":"019A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl019A(20100423).mp3"},
{"p":"2", "d":"019B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl019B(20100423).mp3"},
{"p":"2", "d":"020A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl020A(20100430).mp3"},
{"p":"2", "d":"020B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl020B(20100430).mp3"},
{"p":"2", "d":"021A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl021A(20100507).mp3"},
{"p":"2", "d":"021B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl021B(20100507).mp3"},
{"p":"2", "d":"022A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl022A(20100514).mp3"},
{"p":"2", "d":"022B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl022B(20100514).mp3"},
{"p":"2", "d":"023A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl023A(20100528).mp3"},
{"p":"2", "d":"023B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl023B(20100528).mp3"},
{"p":"2", "d":"024A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl024A(20100604).mp3"},
{"p":"2", "d":"024B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl024B(20100604).mp3"},
{"p":"2", "d":"025A", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl025A(20100611).mp3"},
{"p":"2", "d":"025B", "url":"http://media.lwdh.org.tw/mp3/lwdh/ffgl/ffgl2/ffgl025B(20100611).mp3"}
];


