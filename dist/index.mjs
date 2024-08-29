import*as e from"cheerio";import t from"axios";function r(e){return parseFloat(e.replace(",",".").replace("€","").trim())}function o(e,t=" à "){const[r,o]=e.split(t),[i,a,n]=r.split("/"),[s,c]=o.split(":");return new Date(parseInt(n),parseInt(a)-1,parseInt(i),parseInt(s),parseInt(c))}var i=class{axiosInstance;cookies;constructor(){this.axiosInstance=t.create({withCredentials:!0,maxRedirects:0,validateStatus:()=>!0,headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7","Accept-Language":"fr-FR,fr;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6,es;q=0.5"}}),this.cookies=[]}updateCookies(e){if(e["set-cookie"]){const t=Array.isArray(e["set-cookie"])?e["set-cookie"]:[e["set-cookie"]];this.cookies=[...this.cookies,...t],this.axiosInstance.defaults.headers.Cookie=this.cookies.join("; ")}}async makeRequest(e,t,r=null,o={}){const i={method:e,url:t,headers:{...this.axiosInstance.defaults.headers,...o},data:r};this.cookies.length>0&&(i.headers=i.headers||{},i.headers.Cookie=this.cookies.join("; "));const a=await this.axiosInstance(i);return this.updateCookies(a.headers),a}async login(t,r){try{let o=await this.makeRequest("GET","https://mon-espace.izly.fr/Home/Logon",null,{Referer:"https://mon-espace.izly.fr/"});const i=e.load(o.data)('input[name="__RequestVerificationToken"]').val();if(o=await this.makeRequest("POST","https://mon-espace.izly.fr/Home/Logon",`__RequestVerificationToken=${encodeURIComponent(i)}&ReturnUrl=&Username=${encodeURIComponent(t)}&Password=${encodeURIComponent(r)}`,{"Content-Type":"application/x-www-form-urlencoded",Origin:"https://mon-espace.izly.fr",Referer:"https://mon-espace.izly.fr/Home/Logon"}),302===o.status){const e=o.headers.location;o=await this.makeRequest("GET",`https://mon-espace.izly.fr${e}`,null,{Referer:"https://mon-espace.izly.fr/Home/Logon"})}if(o=await this.makeRequest("GET","https://mon-espace.izly.fr/",null,{Referer:"https://mon-espace.izly.fr/Home/Logon"}),200!==o.status)throw new Error("Failed to login");return!0}catch(e){return console.error("Login error:",e.message),!1}}getAxiosInstance(){return this.axiosInstance}},a=class{loginService;axiosInstance;loggedIn;constructor(){this.loginService=new i,this.axiosInstance=this.loginService.getAxiosInstance(),this.loggedIn=!1}async login(e,t){try{return this.loggedIn=await this.loginService.login(e,t),this.loggedIn}catch(e){return console.error("Login error:",e.message),!1}}async getProfile(){if(!this.loggedIn)throw new Error("Not logged in. Please login first.");return async function(t){try{const r=await t.get("https://mon-espace.izly.fr/Profile",{headers:{Referer:"https://mon-espace.izly.fr/"}});if(200===r.status){const t=e.load(r.data);return{name:t("h1").first().text().trim(),identifier:t(".heading-label-value").eq(0).text().trim(),pseudo:t(".heading-label-value").eq(1).text().trim(),birthDate:t(".heading-label-value").eq(2).text().trim(),address:t(".addWay").text().trim()+", "+t(".addZipCode").text().trim()+" "+t(".addCity").text().trim(),primaryEmail:t(".rectangle").eq(1).text().trim(),secondaryEmail:t("#emailPersonnel").text().trim(),phoneNumber:t("#currentPhoneNumber").text().trim(),companyCode:t(".rectangle").eq(4).text().trim(),tariffCode:t(".rectangle").eq(5).text().trim(),crousRightsEndDate:t(".rectangle").eq(6).text().trim()}}throw new Error("Failed to retrieve profile information")}catch(e){throw console.error("Error retrieving profile information:",e.message),e}}(this.axiosInstance)}async getNotifications(){if(!this.loggedIn)throw new Error("Not logged in. Please login first.");return async function(t){try{const r=await t.get("https://mon-espace.izly.fr/Profile?page=1",{headers:{Accept:"text/html, */*; q=0.01","X-Requested-With":"XMLHttpRequest",Referer:"https://mon-espace.izly.fr/Profile"}});if(200===r.status){const t=e.load(r.data),i=[];return t(".table-responsive .table tr").each(((e,r)=>{const a=t(r),n=o(a.find("td:nth-child(2)").text().trim()," à "),s=a.find("td:nth-child(3)").text().trim();i.push({date:n,description:s})})),i}throw new Error("Failed to retrieve notifications")}catch(e){throw console.error("Error retrieving notifications:",e.message),e}}(this.axiosInstance)}async getBalance(){if(!this.loggedIn)throw new Error("Not logged in. Please login first.");return async function(t){const i=await t.get("https://mon-espace.izly.fr/",{headers:{Referer:"https://mon-espace.izly.fr/Home/Logon"}}),a=e.load(i.data),n=r(a("#balance").text().trim()),s=o(a(".balance-heading-date").text().trim()," à ");if(isNaN(n))throw new Error("Failed to extract balance. Possible page structure change.");return{date:s,amount:n}}(this.axiosInstance)}async getDeposits(){if(!this.loggedIn)throw new Error("Not logged in. Please login first.");return async function(t){const i=await t.get("https://mon-espace.izly.fr/Home/GetTopups",{headers:{Referer:"https://mon-espace.izly.fr/","X-Requested-With":"XMLHttpRequest"}}),a=[],n=e.load(i.data);return n(".list-group-item").each(((e,t)=>{const i=n(t),s=i.find(".operation-type").text().split(" - ")[0]?.trim(),c=i.find(".operation-type").text().split(" - ")[1]?.trim(),l=o(i.find(".oeration-date").text().trim()," "),h=r(i.find(".operation-amount").text().trim()),d=i.find(".badge").text().trim();a.push({type:s,method:c,date:l,amount:h,status:d})})),a}(this.axiosInstance)}async generateQRCode(){if(!this.loggedIn)throw new Error("Not logged in. Please login first.");return async function(e,t=1){try{const r=await e.post("https://mon-espace.izly.fr/Home/CreateQrCodeImg",`numberOfQrCodes=${t}`,{headers:{Accept:"text/html, */*; q=0.01","X-Requested-With":"XMLHttpRequest","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",Origin:"https://mon-espace.izly.fr",Referer:"https://mon-espace.izly.fr/Home/GenerateQRCode"}});if(200===r.status)return r.data;throw new Error("Failed to generate QR Code(s)")}catch(e){throw console.error("Error generating QR Code(s):",e.message),e}}(this.axiosInstance)}};export{a as default};//# sourceMappingURL=index.mjs.map