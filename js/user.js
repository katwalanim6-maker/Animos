import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const params=new URLSearchParams(window.location.search);

const username=params.get("u");

const q=query(
collection(db,"users"),
where("username","==",username)
);

const snap=await getDocs(q);

if(!snap.empty){

const data=snap.docs[0].data();

document.getElementById("displayName").textContent=data.displayName;

document.getElementById("username").textContent="@"+data.username;

document.getElementById("bio").textContent=data.bio;

document.getElementById("location").textContent=data.location;

const website=document.getElementById("website");

website.href=data.website;
website.textContent=data.website;

}
