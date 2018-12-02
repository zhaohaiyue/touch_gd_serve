if(typeof PluginManager === "undefined"){
	window.PluginManager = {
		    exec: function(arg0, arg1, arg2) {
		        prompt('_$$_SafelyJsInterface:_' + JSON.stringify({
		            inf: 'PluginManager',
		            func: 'exec',
		            args: [arg0, arg1, arg2]
		        }));
		    },
	};
}
var ua = navigator.userAgent;

var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

if (ipad || iphone || ipod) {
	window["TerminalType"] = 'i';
}
