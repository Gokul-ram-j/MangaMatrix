import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, firestore } from "../../auth/firebase"; // Ensure correct path

export default async function storeData(searchData) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("No authenticated user.");
      return;
    }

    const { db, ...dataWithoutDb } = searchData; // Remove 'db' field
    const userEmail = user.email.toLowerCase(); // Ensure case consistency
    console.log(db,dataWithoutDb)
    // Reference to the Firestore document
    const docRef = doc(firestore, db, userEmail);

    // Append the new search data to 'searchedData' array
    await updateDoc(docRef, {
      searchedData: arrayUnion(dataWithoutDb)
    });

    console.log("Data stored successfully:", dataWithoutDb);
  } catch (error) {
    console.error("Error storing data:", error);
  }
}
