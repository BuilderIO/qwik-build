!function(){const e=(t,n,o,s,r)=>(void 0===o?n?(s=n.getAttribute("q:base"),r=e(t,n.parentNode&&n.parentNode.closest("[q\\:base]"))):s=t.baseURI:o&&(s=o,r=e(t,n.closest("[q\\:base]"))),s?new URL(s,r):void 0);((t,n)=>{const o="__q_context__",s=["on:","on-window:","on-document:"],r=async(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\:"+n+"]").forEach((e=>a(e,n,o)))},a=async(n,r,a,i,d,l)=>{for(const u of s){l=n.getAttribute(u+r)||"";for(const s of l.split("\n"))if(i=e(t,n,s)){const e=c(i,window[i.pathname]||await import(
/* @vite-ignore */
(i+"").split("#")[0]));d=document[o];try{document[o]=[n,a,i],e(n,a,i)}finally{document[o]=d}}}},c=(e,t,n)=>t[n=e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default"]||(e=>{throw Error("QWIK: "+e)})(e+" does not export "+n),i=async(e,n)=>{if((n=e.target)==t)setTimeout((()=>r("-document",e.type,e)));else for(;n&&n.getAttribute;)a(n,e.type,e),n=e.bubbles?n.parentElement:null},d=e=>t.addEventListener(e,i,{capture:!0}),l=e=>{e=t.readyState,n||"interactive"!=e&&"complete"!=e||(n=1,r("","q-init",new CustomEvent("qInit")))};{const e=t.querySelector("script[events]");if(e)(e.getAttribute("events")||"").split(/[\s,;]+/).forEach(d);else for(const e in t)0==e.indexOf("on")&&d(e.substring(2))}t.addEventListener("readystatechange",l),l()})(document)}();