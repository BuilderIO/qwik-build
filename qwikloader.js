((e,t)=>{const n="__q_context__",o=["on:","on-window:","on-document:"],r=(t,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),e.querySelectorAll("[on"+t+"\\:"+n+"]").forEach((e=>c(e,n,o)))},s=(e,t)=>e.dispatchEvent(new CustomEvent("qsymbol",{detail:{name:t},bubbles:!0,composed:!0})),i=e=>{throw Error("QWIK "+e)},a=(t,n)=>(t=t.closest("[q\\:container]"),new URL(n,new URL(t?t.getAttribute("q:base"):e.baseURI,e.baseURI))),c=async(t,r,c)=>{for(const u of o){const o=t.getAttribute(u+r);if(o){t.hasAttribute("preventdefault:"+r)&&c.preventDefault();for(const r of o.split("\n")){const o=a(t,r);if(o){const r=l(o),a=(window[o.pathname]||await import(o.href.split("#")[0]))[r]||i(o+" does not export "+r),u=e[n];if(t.isConnected)try{e[n]=[t,c,o],a(c,t,o)}finally{e[n]=u,s(t,r)}}}}}},l=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",u=(t,n)=>{if((n=t.target)==e)setTimeout((()=>r("-document",t.type,t)));else for(;n&&n.getAttribute;)c(n,t.type,t),n=t.bubbles?n.parentElement:null},b=n=>{if(n=e.readyState,!t&&("interactive"==n||"complete"==n)&&(t=1,r("","qresume",new CustomEvent("qresume")),"undefined"!=typeof IntersectionObserver)){const t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),c(n.target,"qvisible",new CustomEvent("qvisible",{bubbles:!1,detail:n})))}));e.qO=t,new MutationObserver((e=>{for(const n of e)t.observe(n.target)})).observe(document.documentElement,{attributeFilter:["on:qvisible"],subtree:!0}),e.querySelectorAll("[on\\:qvisible]").forEach((e=>t.observe(e)))}},f=t=>e.addEventListener(t,u,{capture:!0});if(!e.qR){e.qR=1;{const t=e.querySelector("script[events]");if(t)t.getAttribute("events").split(/[\s,;]+/).forEach(f);else for(const t in e)t.startsWith("on")&&f(t.slice(2))}e.addEventListener("readystatechange",b),b()}})(document);