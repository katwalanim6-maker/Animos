import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const displayName=document.getElementById("displayName");
const username=document.getElementById("username");
const bio=document.getElementById("bio");
const location=document.getElementById("location");
const website=document.getElementById("website");

const saveBtn=document.getElementById("saveBtn");

onAuthStateChanged(auth,async(user)=>{

if(!user){
location.href="login.html";
return;
}

const ref=doc(db,"users",user.uid);

const snap=await getDoc(ref);

if(snap.exists()){

const data=snap.data();

displayName.value=data.displayName||"";
username.value=data.username||"";
bio.value=data.bio||"";
location.value=data.location||"";
website.value=data.website||"";

}

saveBtn.onclick=async()=>{

await setDoc(ref,{

displayName:displayName.value,

username:username.value.toLowerCase(),

bio:bio.value,

location:location.value,

website:website.value,

email:user.email

},{merge:true});

alert("Profile Saved!");

};

});
