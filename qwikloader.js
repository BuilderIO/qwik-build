(()=>{const t=(t,e,n)=>(t=t.closest("[q\\:container]"),new URL(e,new URL(t?t.getAttribute("q:base"):n,n))),e=t=>{throw Error("QWIK: "+t)};((n,o)=>{const s="__q_context__",r=["on:","on-window:","on-document:"],a=(t,e,o)=>{e=e.replace(/([A-Z])/g,(t=>"-"+t.toLowerCase())),n.querySelectorAll("[on"+t+"\\:"+e+"]").forEach((t=>c(t,e,o)))},i=(t,e)=>t.dispatchEvent(new CustomEvent("qSymbol",{detail:{name:e},bubbles:!0,composed:!0})),c=async(o,a,c)=>{for(const u of r){const r=o.getAttribute(u+a);if(r){o.hasAttribute("preventdefault:"+a)&&c.preventDefault();for(const a of r.split("\n")){const r=t(o,a,n.baseURI);if(r){const t=l(r),a=(window[r.pathname]||await import(r.href.split("#")[0]))[t]||e(r+" does not export "+t),u=n[s];try{n[s]=[o,c,r],a(c,o,r)}finally{n[s]=u,i(o,t)}}}}}},l=t=>t.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",u=(t,e)=>{if((e=t.target)==n)setTimeout((()=>a("-document",t.type,t)));else for(;e&&e.getAttribute;)c(e,t.type,t),e=t.bubbles?e.parentElement:null},p=t=>n.addEventListener(t,u,{capture:!0}),d=t=>{t=n.readyState,o||"interactive"!=t&&"complete"!=t||(o=1,a("","q-init",new CustomEvent("qInit")))};{const t=n.querySelector("script[events]");if(t)t.getAttribute("events").split(/[\s,;]+/).forEach(p);else for(const t in n)t.startsWith("on")&&p(t.slice(2))}n.addEventListener("readystatechange",d),d()})(document)})();