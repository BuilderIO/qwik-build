!function(){const e=(t,n,o,a,s)=>(void 0===o?n?(a=n.getAttribute("q:base"),s=e(t,n.parentNode&&n.parentNode.closest("[q\\:base]"))):a=t.baseURI:o&&(a=o,s=e(t,n.closest("[q\\:base]"))),a?new URL(a,s):void 0),t=e=>{throw Error("QWIK: "+e)};((n,o)=>{const a="__q_context__",s=["on:","on-window:","on-document:"],r=async(e,t,o)=>{t=t.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),n.querySelectorAll("[on"+e+"\\:"+t+"]").forEach((e=>c(e,t,o)))},c=async(o,r,c,d,l,p)=>{for(const b of s){p=o.getAttribute(b+r)||"";for(const s of p.split("\n"))if(d=e(n,o,s)){const e=i(d),s=(window[d.pathname]||await import((d+"").split("#")[0]))[e]||t(d+" does not export "+e);l=n[a];try{n[a]=[o,c,d],s(o,c,d)}finally{n[a]=l,u=e,o.dispatchEvent(new CustomEvent("qSymbol",{detail:{name:u},bubbles:!0,composed:!0}))}}}var u},i=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",d=async(e,t)=>{if((t=e.target)==n)setTimeout((()=>r("-document",e.type,e)));else for(;t&&t.getAttribute;)c(t,e.type,e),t=e.bubbles?t.parentElement:null},l=e=>{e=n.readyState,o||"interactive"!=e&&"complete"!=e||(o=1,r("","q-init",new CustomEvent("qInit")))};window.qEvents.forEach((e=>n.addEventListener(e,d,{capture:!0}))),n.addEventListener("readystatechange",l),l()})(document)}();