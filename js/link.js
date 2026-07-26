import { auth, db } from "./firebase.js";

import {
collection,
addDoc,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const title=document.getElementById("title");
const url=document.getElementById("url");
const addBtn=document.getElementById("addBtn");
const list=document.getElementById("linksList");

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="login.html";
return;

}

loadLinks(user.uid);

addBtn.onclick=async()=>{

await addDoc(collection(db,"links"),{

uid:user.uid,

title:title.value,

url:url.value

});

title.value="";
url.value="";

loadLinks(user.uid);

};

});

async function loadLinks(uid){

list.innerHTML="";

const q=query(collection(db,"links"),where("uid","==",uid));

const snap=await getDocs(q);

snap.forEach(doc=>{

const data=doc.data();

list.innerHTML+=`
<div class="link-item">
<b>${data.title}</b><br>
${data.url}
</div>
`;

});

}
