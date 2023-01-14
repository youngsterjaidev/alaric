import { onSnapshot, refEqual, getDoc, getDocs, collection } from "firebase/firestore";
import { useEffect, useReducer, useState } from "react";
import { useMemoCompare } from "./useMemoCompare";

// Get doc data and merge doc.id
const getDocData = (doc) => {
  console.log("Doc : ", doc.exists());
  return doc.exists() === true ? { id: doc.id, ...doc.data() } : null;
};

// Get array of doc data from collection
const getCollectionData = (collection) => {
  return collection.docs.map(getDocData);
};

const reducer = (state, action) => {
  switch (action.type) {
    case "idle":
      return { status: "idle", data: undefined, error: undefined };
    case "loading":
      return { status: "loading", data: undefined, error: undefined };
    case "success":
      return { status: "success", data: action.payload, error: undefined };
    case "error":
      return { status: "error", data: undefined, error: action.payload };
    default:
      throw new Error("invalid action");
  }
};

// Hook
export const useFirestoreQuery = (query) => {
  const [q, setQ] = useState(query)
  // console.log("The Query : ", query);

  // Our initial state
  // Start with the "idle" status if query is falsy as that mean hook
  // consumer is waiting on required data before creating the query object

  const initialState = {
    status: query ? "loading" : "idle",
    data: undefined,
    error: undefined,
  };

  // setup Our state and actions
  const [state, dispatch] = useReducer(reducer, initialState);

  // Get cached Firestore Query object with useMemoCompare
  // Needed because firestore.collection("profiles").doc(uid) will always
  // being a new object reference causing effect to
  // run -> state change -> rerender -> effect runs etc ...
  // This is nicer that requiring hook consumer to always memorize query with useMemo
  // ( that a  useMemoCompare hook in our case )

  const queryCached = useMemoCompare(q, (prevQuery) => {
    // Use built-in Firestore isEqual method to determine if "equal"
    return prevQuery && q && refEqual(q, prevQuery);
  });

  // console.log("The cached query : ", queryCached);

  useEffect(() => {
    // console.log("Handle Change !")

    // Return early if query is falsy and reset to "idle" status in case
    // We're comming from "success" or "error" status due to query change
    if (!queryCached) {
      dispatch({ type: "idle" });
      return;
    }

    dispatch({ type: "loading" });

    // Subscibe to query with onSnaphot
    // will unsubscribe on cleanup since this reurns an unsubscribe function

    // console.log("New Query : ", queryCached, q);

    return onSnapshot(queryCached, (response) => {

      // console.log("The Response : ", response)

      // Get Data for collection or doc
      const data = response.docs
        ? getCollectionData(response)
        : getDocData(response)

      dispatch({ type: "success", payload: data })
    }, (error) => {
      dispatch({ type: "error", payload: error });
    })

  }, [queryCached]);

  return [...Object.values(state), setQ]
};

