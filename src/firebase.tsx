// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database"
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAa9TwCMfkEwsuaxx1yIbmVdK0fYhxCRR8",
  authDomain: "alaric-339008.firebaseapp.com",
  databaseURL: "https://alaric-339008-default-rtdb.firebaseio.com",
  projectId: "alaric-339008",
  storageBucket: "alaric-339008.appspot.com",
  messagingSenderId: "264727266576",
  appId: "1:264727266576:web:10bb6e7980b695c701d195",
  measurementId: "G-V0ZQ4YTKPT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const rdb = getDatabase(app)
export const auth = getAuth(app);

// Get doc data and merge doc.id
const getDocData = (doc) => {
  console.log("Doc : ", doc.exists());
  return doc.exists() === true ? { id: doc.id, ...doc.data() } : null;
};

// Get array of doc data from collection
const getCollectionData = (collection) => {
  return collection.docs.map(getDocData);
};


interface FirebaseDAO {
  firestore: {
    findDocById
  },
  database: {
    findDocByRef: (
      id?: string | null,
      setMarkers: any
    ) => void
  }
}

export const firebaseDAO: FirebaseDAO = {
  firestore: {
    findDocById: async (id, colName, setData) => {
      console.log("Hit the findDocById ")
      try {
        // check if the arguments are present or not
        let docRef;
        if (!id) {
          docRef = collection(db, colName)
        } else {
          docRef = doc(db, colName, id)
        }

        let data;
        onSnapshot(docRef, response => {

          data = response.docs
            ? getCollectionData(response)
            : getDocData(response);

          setData(data)

          console.log("Response Data : ", data)
        })

        console.log("The Data : ", data)

        return data

      } catch (e) {
        console.log("Error Occured while finding the doc by docId findDocById fn : ", e)
      }
    }
  },
  database: {
    findDocByRef: (id, setMarkers) => {
      let docRef;
      if (!id) {
        docRef = ref(rdb, 'location/')
      } else {
        docRef = ref(rdb, 'location/' + id)
      }
      onValue(docRef, snapshot => {
        if (snapshot.exists()) {
          // console.log("red")
          let newArr = Object.keys(snapshot.val()).map((key) => {
            let data = snapshot.val()[key];
            console.log(data)
            return data;
          });

          console.log("Marker Data: ", newArr)
          setMarkers([newArr])

          return newArr
        }

        return null
      })
    }
  }
}
