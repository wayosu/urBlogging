// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE,
  authDomain: "urblogging-web-app.firebaseapp.com",
  projectId: "urblogging-web-app",
  storageBucket: "urblogging-web-app.appspot.com",
  messagingSenderId: "423107289757",
  appId: "1:423107289757:web:364f0060d887074133aa74",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Storage
const storage = getStorage(app);

// Google Auth
const provider = new GoogleAuthProvider();
const auth = getAuth();
export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
};

// Upload Image
export const uploadImage = async (img) => {
  let imgUrl = null;

  try {
    // Get a reference to the Firebase Storage bucket
    const storageRef = ref(storage);

    // Generate a unique image name
    const imageName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.jpeg`;

    // Create a reference to the image in the bucket
    const imageRef = ref(storageRef, imageName);

    // Upload the image
    await uploadBytes(imageRef, img, { contentType: "image/jpeg" });

    // Get the download URL for the uploaded image
    imgUrl = await getDownloadURL(imageRef);
  } catch (error) {
    console.error(error.message);
    // Handle errors appropriately, e.g., show an error message to the user
  }

  return imgUrl;
};
