(function(e){function t(t){for(var r,c,u=t[0],i=t[1],s=t[2],l=0,f=[];l<u.length;l++)c=u[l],Object.prototype.hasOwnProperty.call(a,c)&&a[c]&&f.push(a[c][0]),a[c]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);p&&p(t);while(f.length)f.shift()();return o.push.apply(o,s||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,c=1;c<n.length;c++){var i=n[c];0!==a[i]&&(r=!1)}r&&(o.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},a={app:0},o=[];function c(e){return u.p+"js/"+({about:"about"}[e]||e)+"."+{about:"27c03fc3"}[e]+".js"}function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n=a[e];if(0!==n)if(n)t.push(n[2]);else{var r=new Promise((function(t,r){n=a[e]=[t,r]}));t.push(n[2]=r);var o,i=document.createElement("script");i.charset="utf-8",i.timeout=120,u.nc&&i.setAttribute("nonce",u.nc),i.src=c(e);var s=new Error;o=function(t){i.onerror=i.onload=null,clearTimeout(l);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;s.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",s.name="ChunkLoadError",s.type=r,s.request=o,n[1](s)}a[e]=void 0}};var l=setTimeout((function(){o({type:"timeout",target:i})}),12e4);i.onerror=i.onload=o,document.head.appendChild(i)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/",u.oe=function(e){throw console.error(e),e};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],s=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var p=s;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"0983":function(e,t,n){"use strict";(function(e){var r=n("1da1"),a=n("d4ec"),o=n("bee2"),c=(n("ac1f"),n("1276"),n("a15b"),n("d3b7"),n("25f0"),n("96cf"),n("bc3a")),u=n.n(c),i=n("1c46"),s=n.n(i),l="pubkey",p=function(){function t(){Object(a["a"])(this,t)}return Object(o["a"])(t,null,[{key:"getPubkey",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,u.a.get(l);case 3:return t=e.sent,e.abrupt("return",t.data);case 7:e.prev=7,e.t0=e["catch"](0),console.log(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));function t(){return e.apply(this,arguments)}return t}()},{key:"decSim",value:function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(n,r){var a,o,c,u;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=n.split(":"),o=e.from(a.shift(),"hex"),c=s.a.createDecipheriv("aes256",r,o),u=c.update(a.join(":"),"hex","utf8"),u+=c.final("utf8"),t.abrupt("return",u);case 6:case"end":return t.stop()}}),t)})));function n(e,n){return t.apply(this,arguments)}return n}()},{key:"encrypt",value:function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(n,r){var a,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=e.from(n,"utf8"),o=s.a.publicEncrypt(r,a),t.abrupt("return",o.toString("base64"));case 3:case"end":return t.stop()}}),t)})));function n(e,n){return t.apply(this,arguments)}return n}()},{key:"makeid",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(t){var n,r,a,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(n=[],r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=r.length,o=0;o<t;o++)n.push(r.charAt(Math.floor(Math.random()*a)));return e.abrupt("return",n.join(""));case 5:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()}]),t}();t["a"]=p}).call(this,n("b639").Buffer)},1:function(e,t){},10:function(e,t){},11:function(e,t){},12:function(e,t){},13:function(e,t){},14:function(e,t){},2:function(e,t){},3:function(e,t){},4:function(e,t){},5:function(e,t){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"bg-blue-50 h-screen",attrs:{id:"app"}},[n("router-view")],1)},o=[],c=n("2877"),u={},i=Object(c["a"])(u,a,o,!1,null,null,null),s=i.exports,l=(n("d3b7"),n("3ca3"),n("ddb0"),n("8c4f")),p=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"container mx-auto space-y-4 px-1"},[n("h1",{staticClass:"text-9xl text-gray-700 font-sans font-semibold antialiased"},[e._v(" Login ")]),n("h2",{staticClass:"text-4xl text-gray-500"},[e._v(" Il codice login è disponible sullo schermo del computerino. ")]),n("form",[n("div",{staticClass:"space-x-4 w-full bg-red-300 p-4 rounded shadow-md"},[e._m(0),n("div",{staticClass:"inline-block w-4/5"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.codice,expression:"codice"}],staticClass:"mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0",attrs:{type:"text",placeholder:"Inserire il codice mostrato sullo schermo del computerino"},domProps:{value:e.codice},on:{input:function(t){t.target.composing||(e.codice=t.target.value)}}})]),n("button",{staticClass:"bg-gray-300 p-2 rounded block m-4",on:{click:function(t){return t.preventDefault(),e.login(t)}}},[e._v(" Sign in ")])])]),200==e.code?n("div",{staticClass:"text-red-600"},[e._v(" Il codice verrà mostrato per 5 minuti, ricaricare la pagina per mostrane un'altro. ")]):500==e.code?n("div",{staticClass:"text-red-600"},[e._v(" Sì è generato un erroe nella creazione del codice. ")]):e._e()])},f=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"inline-block ml-4"},[n("label",{staticClass:"font-semibold"},[e._v("Codice ")])])}],d=n("1da1"),b=(n("96cf"),n("bc3a")),m=n.n(b),v=n("0983"),h={data:function(){return{token:"",codice:null,pubkey:null,chiave:null,code:null}},created:function(){return Object(d["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:localStorage.token;case 1:case"end":return e.stop()}}),e)})))()},mounted:function(){var e=this;return Object(d["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,m.a.get("/codice");case 3:n=t.sent,e.code=n.status,t.next=11;break;case 7:t.prev=7,t.t0=t["catch"](0),console.error(t.t0),e.code=500;case 11:if(!localStorage.pubkey){t.next=15;break}e.pubkey=localStorage.pubkey,t.next=18;break;case 15:return t.next=17,v["a"].getPubkey();case 17:e.pubkey=t.sent;case 18:return t.next=20,v["a"].makeid(32);case 20:e.chiave=t.sent;case 21:case"end":return t.stop()}}),t,null,[[0,7]])})))()},methods:{login:function(){var e=this;return Object(d["a"])(regeneratorRuntime.mark((function t(){var n,r,a,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n={},n.codice=e.codice,n.chiave=e.chiave,e.pubkey){t.next=7;break}return t.next=6,v["a"].getPubkey();case 6:e.pubkey=t.sent;case 7:return t.next=9,v["a"].encrypt(JSON.stringify(n),e.pubkey);case 9:return r=t.sent,t.next=12,m.a.post("login",r,{headers:{"Content-Type":"text/plain"}});case 12:if(a=t.sent,200!=a.status){t.next=23;break}return t.t0=JSON,t.next=17,v["a"].decSim(a.data,e.chiave);case 17:t.t1=t.sent,o=t.t0.parse.call(t.t0,t.t1),e.token=o.token,e.redirect(),t.next=24;break;case 23:e.code=500;case 24:case"end":return t.stop()}}),t)})))()},redirect:function(){this.$router.push({name:"Home"})}},watch:{pubkey:function(e){localStorage.pubkey=e},token:function(e){console.log("Local storage aggiornato"),localStorage.token=e}}},g=h,y=Object(c["a"])(g,p,f,!1,null,null,null),k=y.exports;r["a"].use(l["a"]);var x=[{path:"/",name:"Login",component:k},{path:"/Home",name:"Home",component:function(){return n.e("about").then(n.bind(null,"bb51"))}}],w=new l["a"]({mode:"history",base:"/",routes:x}),j=w;n("7d05");r["a"].config.productionTip=!1,new r["a"]({router:j,render:function(e){return e(s)}}).$mount("#app")},6:function(e,t){},7:function(e,t){},"7d05":function(e,t,n){},8:function(e,t){},9:function(e,t){}});
//# sourceMappingURL=app.9212925b.js.map