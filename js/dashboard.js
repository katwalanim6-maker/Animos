import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const welcomeText = document.getElementById("welcomeText");
const username = document.getElementById("username");
const email = document.getElementById("email");
const logoutBtn = document.getElementById("logoutBtn");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const profilePic = document.getElementById("profilePic");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const ref = doc(db, "users", user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {

        const data = docSnap.data();

        welcomeText.textContent = `Welcome back, ${data.name} 👋`;
        username.textContent = data.name;
        email.textContent = data.email;

        if (data.photoURL) {
            profilePic.src = data.photoURL;
        }
    }

    uploadBtn.onclick = () => {
        fileInput.click();
    };

    fileInput.onchange = async () => {

        const file = fileInput.files[0];

        if (!file) return;

        uploadBtn.innerText = "Uploading...";

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "animos-profile");

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/bdya7qoz/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        await updateDoc(ref, {
            photoURL: result.secure_url
        });

        profilePic.src = result.secure_url;

        uploadBtn.innerText = "Uploaded ✅";
    };

});

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});
