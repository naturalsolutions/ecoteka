if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let i=Promise.resolve();return n[e]||(i=new Promise((async i=>{if("document"in self){const n=document.createElement("script");n.src=e,document.head.appendChild(n),n.onload=i}else importScripts(e),i()}))),i.then((()=>{if(!n[e])throw new Error(`Module ${e} didn’t register its module`);return n[e]}))},i=(i,n)=>{Promise.all(i.map(e)).then((e=>n(1===e.length?e[0]:e)))},n={require:Promise.resolve(i)};self.define=(i,s,a)=>{n[i]||(n[i]=Promise.resolve().then((()=>{let n={};const c={uri:location.origin+i.slice(1)};return Promise.all(s.map((i=>{switch(i){case"exports":return n;case"module":return c;default:return e(i)}}))).then((e=>{const i=a(...e);return n.default||(n.default=i),n}))})))}}define("./sw.js",["./workbox-7288c796"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/Wcy1xHE_l5Yq20guAErFv/_buildManifest.js",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/Wcy1xHE_l5Yq20guAErFv/_ssgManifest.js",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/chunks/framework-75df34428e686d763503.js",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/chunks/main-109ef6f1c3f32e101fcf.js",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/chunks/pages/_app-139feca0ff92e7518ce9.js",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/chunks/pages/_error-737a04e9a0da63c9d162.js",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/chunks/pages/index-2d52e391c0d6e2d6cf2c.js",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/chunks/pages/legacy-9a700e63d7cb001b764c.js",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/chunks/polyfills-a40ef1678bae11e696dba45124eadd70.js",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/chunks/webpack-fb76148cfcfb42ca18eb.js",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/css/8e4ca9b2bb854444ed67.css",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/inter-all-400-normal.10f84849b8a69b4844b2925080f81a97.woff",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/inter-cyrillic-400-normal.bc3898d7951d9a7c0dc70d18bdd3ddc7.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/inter-cyrillic-ext-400-normal.c5e8f07ad3c08f221d1e058fa6b5c9c4.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/inter-greek-400-normal.f58e259d41ec5af980dfc66f731a0165.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/inter-greek-ext-400-normal.6af00e5dcf12ad72af064289c648e944.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/inter-latin-400-normal.351b7924dd5e53fb9e5ec938459741d2.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/inter-latin-ext-400-normal.fb78ad31672f0b26438f7c975077411d.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/inter-vietnamese-400-normal.bc4d514951f3d398fda2549e3ffb186e.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/merriweather-all-400-normal.e94ffc8dce25aa443538b731ba70cc30.woff",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/merriweather-cyrillic-400-normal.38a2a7065c8ee606648fa47372ae73de.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/merriweather-cyrillic-ext-400-normal.6686f0b95cf086511cdbba7b8ec73b2d.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/merriweather-latin-400-normal.c18b437f8f3115aacd19ad9b071877c2.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/merriweather-latin-ext-400-normal.4aa05907b7a713ab6c582cadbf106838.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/_next/static/media/merriweather-vietnamese-400-normal.bb64ba848d6510074c30d5ab5d46d32b.woff2",revision:"Wcy1xHE_l5Yq20guAErFv"},{url:"/background.jpg",revision:"23ebe9e5038599eb791d5fe36e98f74e"},{url:"/background.svg",revision:"526e71bb468d15564a6b8c36b583afd9"},{url:"/favicon.ico",revision:"a4f2dd80f513e76f34148e004e0798d5"},{url:"/icons/favicon-16x16.png",revision:"eec97098122e85e340be2b8fa7c876ea"},{url:"/icons/favicon-32x32.png",revision:"1b84c87347fb12da62d4f176e99d459f"},{url:"/icons/icon-128x128.png",revision:"e851caa4f808b833b69cd0aaf562c7b3"},{url:"/icons/icon-144x144.png",revision:"e66e2e9c3fabc95f7ea8727cd256fcac"},{url:"/icons/icon-152x152.png",revision:"fbad96e7dc3709735fcdcfeb779e997a"},{url:"/icons/icon-192x192.png",revision:"85c51f5b0763e725d14ceeb76481698c"},{url:"/icons/icon-384x384.png",revision:"d95b11747db5e39e251b2a82894441d9"},{url:"/icons/icon-512x512.png",revision:"90467cadc1b208100ce0cf3d331da2b8"},{url:"/icons/icon-72x72.png",revision:"dc5779e30a87dd60817980fcc223cad1"},{url:"/icons/icon-96x96.png",revision:"b6a3c0c56ef58a9621e751076f0e77e6"},{url:"/keys/knowledge.svg",revision:"2cb12c8178f43f46630867f8456056aa"},{url:"/keys/manage.svg",revision:"c68170110483dba2c0a793d4705cdf41"},{url:"/keys/think.svg",revision:"465203725a55c33c47b1fa2258726ca2"},{url:"/landing_page.jpg",revision:"23ebe9e5038599eb791d5fe36e98f74e"},{url:"/logo-short-white.svg",revision:"7ccebe77e5e2eed1a78b9f110bdb8464"},{url:"/logo-short.png",revision:"dc5779e30a87dd60817980fcc223cad1"},{url:"/logo-short.svg",revision:"f427425f75d466c593bf69f22ab0295c"},{url:"/logo.svg",revision:"98e155ad5fe6f1409d0b3c24a06fca9c"},{url:"/manifest.json",revision:"a49582ebeae71de6207f94544a4d5da8"},{url:"/references/background.png",revision:"5971ce3c5d8f6b7b6349e965f23033b6"},{url:"/references/hubspot.svg",revision:"65e6947fbe04a216c9536304f1d1ec1a"},{url:"/references/manon_fredout.png",revision:"39e676ea8b6b5154f8ac16331d7f17e5"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:i,event:n,state:s})=>i&&"opaqueredirect"===i.type?new Response(i.body,{status:200,statusText:"OK",headers:i.headers}):i}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const i=e.pathname;return!i.startsWith("/api/auth/")&&!!i.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
