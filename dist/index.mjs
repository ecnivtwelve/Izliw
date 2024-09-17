import e from"axios";function t(e){return parseFloat(e.replace(",",".").replace("€","").trim())}function n(e,t=" à "){const[n,a]=e.split(t),[o,s,r]=n.split("/"),[i,c]=a.split(":");return new Date(parseInt(r),parseInt(s)-1,parseInt(o),parseInt(i),parseInt(c))}function a(e,t){const n=new RegExp(`<${t}[^>]*>(.*?)</${t}>`,"s"),a=e.match(n);return a?a[1].trim():""}function o(e,t,n=0){const a=new RegExp(`<[^>]*class=[^>]*${t}[^>]*>(.*?)</`,"g"),o=[...e.matchAll(a)];return o[n]?o[n][1].trim():""}function s(e,t){const n=new RegExp(`<[^>]*id="${t}"[^>]*>(.*?)</`,"s"),a=e.match(n);return a?a[1].trim():""}function r(e){return e.match(/<li[^>]*class="[^"]*list-group-item[^"]*"[^>]*>[\s\S]*?<\/li>/g)||[]}var i=class{axiosInstance;cookies;constructor(){this.axiosInstance=e.create({withCredentials:!0,maxRedirects:0,validateStatus:()=>!0,headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7","Accept-Language":"fr-FR,fr;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6,es;q=0.5"}}),this.cookies=[]}updateCookies(e){if(e["set-cookie"]){const t=Array.isArray(e["set-cookie"])?e["set-cookie"]:[e["set-cookie"]];this.cookies=[...this.cookies,...t],this.axiosInstance.defaults.headers.Cookie=this.cookies.join("; ")}}async makeRequest(e,t,n=null,a={}){const o={method:e,url:t,headers:{...this.axiosInstance.defaults.headers,...a},data:n};this.cookies.length>0&&(o.headers=o.headers||{},o.headers.Cookie=this.cookies.join("; "));const s=await this.axiosInstance(o);return this.updateCookies(s.headers),s}async login(e,t){try{let n=await this.makeRequest("GET","https://mon-espace.izly.fr/Home/Logon",null,{Referer:"https://mon-espace.izly.fr/"});const a=function(e){const t=e.match(/<input[^>]*name=["']__RequestVerificationToken["'][^>]*value=["']([^"']+)["'][^>]*>/i);return t?t[1]:""}(n.data);if(!a)throw new Error("Failed to extract request verification token");if(n=await this.makeRequest("POST","https://mon-espace.izly.fr/Home/Logon",`__RequestVerificationToken=${encodeURIComponent(a)}&ReturnUrl=&Username=${encodeURIComponent(e)}&Password=${encodeURIComponent(t)}`,{"Content-Type":"application/x-www-form-urlencoded",Origin:"https://mon-espace.izly.fr",Referer:"https://mon-espace.izly.fr/Home/Logon"}),302===n.status){const e=n.headers.location;n=await this.makeRequest("GET",`https://mon-espace.izly.fr${e}`,null,{Referer:"https://mon-espace.izly.fr/Home/Logon"})}if(n=await this.makeRequest("GET","https://mon-espace.izly.fr/",null,{Referer:"https://mon-espace.izly.fr/Home/Logon"}),200!==n.status)throw new Error("Failed to login");return!0}catch(e){return console.error("Login error:",e.message),!1}}getAxiosInstance(){return this.axiosInstance}};var c=class{loginService;axiosInstance;loggedIn=!1;constructor(){this.loginService=new i,this.axiosInstance=this.loginService.getAxiosInstance()}async login(e,t){try{return this.loggedIn=await this.loginService.login(e,t),this.loggedIn}catch(e){return console.error("Login error:",e.message),!1}}checkLogin(){if(!this.loggedIn)throw new Error("Not logged in. Please login first.")}async getProfile(){return this.checkLogin(),async function(e){try{const t=await e.get("https://mon-espace.izly.fr/Profile",{headers:{Referer:"https://mon-espace.izly.fr/"}});if(200===t.status){const e=t.data;return{name:a(e,"h1"),identifier:o(e,"heading-label-value",0),pseudo:o(e,"heading-label-value",1),birthDate:o(e,"heading-label-value",2),address:`${o(e,"addWay")}, ${o(e,"addZipCode")} ${o(e,"addCity")}`,primaryEmail:o(e,"rectangle",1),secondaryEmail:s(e,"emailPersonnel"),phoneNumber:s(e,"currentPhoneNumber"),companyCode:o(e,"rectangle",4),tariffCode:o(e,"rectangle",5),crousRightsEndDate:o(e,"rectangle",6)}}throw new Error("Failed to retrieve profile information")}catch(e){throw console.error("Error retrieving profile information:",e.message),e}}(this.axiosInstance)}async getNotifications(){return this.checkLogin(),async function(e){try{const t=await e.get("https://mon-espace.izly.fr/Profile?page=1",{headers:{Accept:"text/html, */*; q=0.01","X-Requested-With":"XMLHttpRequest",Referer:"https://mon-espace.izly.fr/Profile"}});if(200===t.status){const e=t.data,a=[];return(e.match(/<tr>[\s\S]*?<\/tr>/g)||[]).forEach((e=>{const t=function(e){return[...e.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((e=>e[1].replace(/<[^>]*>/g,"").trim()))}(e);if(t.length>=3){const e=n(t[1]," à "),o=t[2];a.push({date:e,description:o})}})),a}throw new Error("Failed to retrieve notifications")}catch(e){throw console.error("Error retrieving notifications:",e.message),e}}(this.axiosInstance)}async getBalance(){return this.checkLogin(),async function(e){const a=(await e.get("https://mon-espace.izly.fr/",{headers:{Referer:"https://mon-espace.izly.fr/Home/Logon"}})).data,r=t(s(a,"balance")),i=n(o(a,"balance-heading-date")," à ");if(isNaN(r))throw new Error("Failed to extract balance. Possible page structure change.");return{date:i,amount:r}}(this.axiosInstance)}async getDeposits(){return this.checkLogin(),async function(e){const a=(await e.get("https://mon-espace.izly.fr/Home/GetTopups",{headers:{Referer:"https://mon-espace.izly.fr/","X-Requested-With":"XMLHttpRequest"}})).data,s=[];return r(a).forEach((e=>{const a=o(e,"operation-type"),[r,i]=a.split(" - ").map((e=>e.trim())),c=n(o(e,"oeration-date")," "),l=t(o(e,"operation-amount")),h=o(e,"badge");s.push({type:r,method:i,date:c,amount:l,status:h})})),s}(this.axiosInstance)}async getPayments(){return this.checkLogin(),async function(e){const a=(await e.get("https://mon-espace.izly.fr/Home/GetPayments",{headers:{Referer:"https://mon-espace.izly.fr/","X-Requested-With":"XMLHttpRequest"}})).data,s=[],i=r(a);return console.log(i),i.forEach((e=>{const a=o(e,"operation-type"),r=n(o(e,"oeration-date")," "),i=t(o(e,"operation-amount")),c=o(e,"badge");s.push({label:a,date:r,amount:i,status:c})})),s}(this.axiosInstance)}async generateQRCode(){return this.checkLogin(),async function(e,t=1){try{const n=await e.post("https://mon-espace.izly.fr/Home/CreateQrCodeImg",`numberOfQrCodes=${t}`,{headers:{Accept:"text/html, */*; q=0.01","X-Requested-With":"XMLHttpRequest","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",Origin:"https://mon-espace.izly.fr",Referer:"https://mon-espace.izly.fr/Home/GenerateQRCode"}});if(200===n.status)return n.data;throw new Error("Failed to generate QR Code(s)")}catch(e){throw console.error("Error generating QR Code(s):",e.message),e}}(this.axiosInstance)}};export{c as default};//# sourceMappingURL=index.mjs.map