const qrlResolver=(e,t)=>{const n=e.ownerDocument,o=e.closest("[q\\:container]"),s=new URL(o?.getAttribute("q:base")??n.baseURI,n.baseURI);return new URL(t,s)};((e,t,n)=>{const o=e=>{e.forEach((e=>{if(e.intersectionRatio>0){const t=e.target,n=t.attributes;for(let e=0;e<n.length;e++){const o=n[e],c=o.name,a=o.value;if(c.startsWith("on:")&&a){const e=qrlResolver(t,a);e.hash=e.search="";const n=e.toString()+".js";s[n]||(s[n]=n,r(n))}}}}))},s={},r=e=>{if(!c){const e=URL.createObjectURL(new Blob(["((e,a)=>{const s={},t=async(e,n)=>{1!==s[n]&&(s[n]=1,((await a(n)).headers.get(\"Link\")||\"\").replace(/<([^>]*)>/g,t))};e.addEventListener(\"message\",(e=>t(\"\",e.data)))})(self,fetch);"],{type:"text/javascript"}));c=new Worker(e)}c.postMessage(e)};let c;e.addEventListener("load",(()=>{const e=new n(o);t.querySelectorAll("[on\\:\\.]").forEach(e.observe.bind(e))}))})(window,document,IntersectionObserver);