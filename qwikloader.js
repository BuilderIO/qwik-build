((e,t)=>{const n="__q_context__",o=window,i=new Set,r=t=>e.querySelectorAll(t),s=(e,t,n=t.type)=>{r("[on"+e+"\\:"+n+"]").forEach((o=>f(o,e,t,n)))},a=(e,t)=>e.getAttribute(t),l=t=>{let n=(t===e.documentElement?e.body:t).lastElementChild;for(;n;){if("SCRIPT"===n.tagName&&"qwik/json"===a(n,"type")){t._qwikjson_=JSON.parse(n.textContent.replace(/\\x3C(\/?script)/g,"<$1"));break}n=n.previousElementSibling}},c=(e,t)=>new CustomEvent(e,{detail:t}),f=async(t,o,i,r=i.type)=>{const s="on"+o+":"+r;t.hasAttribute("preventdefault:"+r)&&i.preventDefault();const c=t._qc_,f=null==c?void 0:c.li.filter((e=>e[0]===s));if(f&&f.length>0){for(const e of f)await e[1].getFn([t,i],(()=>t.isConnected))(i,t);return}const p=a(t,s);if(p){const o=t.closest("[q\\:container]"),r=new URL(a(o,"q:base"),e.baseURI);for(const s of p.split("\n")){const a=new URL(s,r),c=a.hash.replace(/^#?([^?[|]*).*$/,"$1"),f=performance.now(),p=import(a.href.split("#")[0]);l(o);const d=u(await p,c),w=e[n];if(t.isConnected)try{e[n]=[t,i,a],b("qsymbol",{symbol:c,element:t,reqTime:f}),await d(i,t)}finally{e[n]=w}}}},b=(t,n)=>{e.dispatchEvent(c(t,n))},u=(e,t)=>{if(t in e)return e[t];for(const n of Object.values(e))if("object"==typeof n&&n&&t in n)return n[t]},p=e=>e.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),d=async e=>{let t=p(e.type),n=e.target;for(s("-document",e,t);n&&n.getAttribute;)await f(n,"",e,t),n=e.bubbles&&!0!==e.cancelBubble?n.parentElement:null},w=e=>{s("-window",e,p(e.type))},q=()=>{var n;const s=e.readyState;if(!t&&("interactive"==s||"complete"==s)&&(t=1,b("qinit"),(null!=(n=o.requestIdleCallback)?n:o.setTimeout).bind(o)((()=>b("qidle"))),i.has("qvisible"))){const e=r("[on\\:qvisible]"),t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),f(n.target,"",c("qvisible",n)))}));e.forEach((e=>t.observe(e)))}},v=(e,t,n,o=!1)=>e.addEventListener(t,n,{capture:o}),y=t=>{for(const n of t)i.has(n)||(v(e,n,d,!0),v(o,n,w),i.add(n))};if(!e.qR){const t=o.qwikevents;Array.isArray(t)&&y(t),o.qwikevents={push:(...e)=>y(e)},v(e,"readystatechange",q),q()}})(document);