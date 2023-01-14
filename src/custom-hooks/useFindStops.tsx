import { FC, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Stop } from "../types/firestore";
import { ErrorData } from "@firebase/util";
import { useFirestoreQuery } from "./useFirstoreQuery";

const _pushData = (data: string) => {
  try {
    return data.replace(" ", "-").toLowerCase()
  } catch (e) { console.log("Error Occured while getting the data to stored from server _pushData fn ", e) }
}

const _pullData = (data: string) => {
  try {
    return data.replace("-", " ")
  } catch (e) { console.log("Error Occured while getting the data to pulled from server _pushData fn ", e) }
}

/*
 * Find the stop by stopname
 * - create a storage for the stopname and result
 * - check if the stopname change trigger the handleStopName function
 * - get the associated stop from the firebase
 * - set the result value and return it
 */


export const useFindStop_ = (colName_?: string, docName_?: string, cond_?: string): any => {
  const [colName, setColName] = useState(colName_)
  const [docName, setDocName] = useState(docName_)
  const [cond, setCond] = useState(cond_)
  const firestoreData = useFirestoreQuery()

  useEffect(() => {

    console.log("handle Find change : ", firestoreData)

    if (!cond) {

      console.log("doc and collection ")

      if (!docName) {

        console.log("collection query")

        if (!colName) {
          // firestoreData[3](collection(db, "buses"))
          return
        }

        firestoreData[3](collection(db, colName))
        console.log("Collection Query")

        return
      }

      console.log("Document query !")

      if (!colName || !docName) {
        // firestoreData[3](doc(db, colName, docName))
        return
      }

      console.log("**************************", colName, docName)

      firestoreData[3](doc(db, colName, docName))

      console.log("doc Query")

      return

    }

    console.log("Condition Query")


  }, [colName, docName, cond])

  return [
    [colName, docName, cond],
    [setColName, setDocName, setCond],
    firestoreData
  ]
}

export const useFindStops = () => {
  const [stopName, setStopName] = useState<string | Stop>("");
  const [result, setResult] = useState<[] | Stop[]>([]);

  const handleStopName = async () => {
    try {

      console.log(stopName)

      // transform the arguments
      let _stopName = stopName.toLowerCase();

      if (!stopName) {
        console.log("Searching all the stops ... ", _stopName);
        let querySnapshot = await getDocs(collection(db, "stops"));
        let tempArr: Stop[] = [];
        querySnapshot.forEach((doc: any) => {
          // doc.data() is never undefined for query doc snapshot
          tempArr.push(doc.data());
        });
        setResult(tempArr);

        return
      }

      console.log("Searching the stops ... ", _stopName);
      let querySnapshot = await getDocs(
        query(
          collection(db, "stops"),
          where("stopName", "==", _stopName)
        )
      );
      let tempArr: Stop[] = [];
      querySnapshot.forEach((doc: any) => {
        // doc.data() is never undefined for query doc snapshot
        tempArr.push(doc.data());
      });
      setResult(tempArr);
    } catch (e) {
      console.log("Error Occured in the handleStopName custom hook : ", e);
    }
  };

  useEffect(() => {
    handleStopName();
  }, [stopName]);

  return [stopName, setStopName, result];
};

/*
 * Find the collection by the docId
 */
export const useFindDocById = () => {
  const [stopId, setStopId] = useState<string>("");
  const [collection, setCollection] = useState<string>("");
  const [error, setError] = useState<null | { errMsg: string }>(null);
  const [result, setResult] = useState([]);

  const handleDocId = async (collection: string, stopId: string) => {
    console.log("handleDocId ", collection, stopId);
    try {
      if (!stopId || !collection) {
        setError({ errMsg: "stopId and collection name is missing !" });
        return;
      }
      console.log("handle Route Name : ");
      let querySnapshot: any = await getDoc(doc(db, collection, stopId));
      if (querySnapshot.exists()) {
        console.log("-===========", [{ ...querySnapshot.data() }]);
        setResult([{ ...querySnapshot.data() }]);
        return;
      }
      setResult([]);
      setError({ errMsg: "No Document Found !" });
    } catch (e) {
      console.log("Error Occured in the handleDocId custom hook : ", e);
    }
  };

  useEffect(() => {
    handleDocId(collection, stopId);
  }, [stopId, collection]);

  return [
    stopId,
    setStopId,
    collection,
    setCollection,
    result,
    error,
    handleDocId,
  ];
};

export const useFindRoute = () => {
  const [stopName, setStopName] = useState<string>("");
  const [result, setResult] = useState([]);

  const handleRouteName = async () => {
    try {
      console.log("handle Stop Name : ");
      let querySnapshot = await getDocs(collection(db, "stops"));
      let tempArr = [];
      querySnapshot.forEach((doc: any) => {
        // doc.data() is never undefined for query doc snapshot
        tempArr.push(doc.data());
      });
      setResult(tempArr);
    } catch (e) {
      console.log("Error Occured in the handleStopName custom hook : ", e);
    }
  };

  useEffect(() => {
    handleRouteName();
  }, [stopName]);

  return [stopName, setStopName, result];
};

/*
 * Find buses by Stop Id
 */

export const findRouteByStopId = async (
  colName: string,
  fieldName: string,
  stopId: string
) => {
  try {
    console.log(colName, fieldName, stopId);
    let querySnapshot = await getDocs(
      query(
        collection(db, "routes"),
        where("stops", "array-contains", "HPSHIS00001")
      )
    );
    console.log(querySnapshot.empty);
    console.log(querySnapshot);
    let result: any[] = []
    querySnapshot.forEach((doc) => {
      console.log("////// : ", doc.data().routeId);
      let { routeId } = doc.data()
      result.push(routeId)
    });

    // returning the array of routeId'ss
    return result
  } catch (e) {
    console.log(
      "Error Occured while finding the bus with stopId findBusByStopId fn : ",
      e
    );
  }
};

export const findBusByRouteId = async (routesId: any[]) => {
  try {
    console.log("List of routesId : ", routesId)
    let querySnapshot = await getDocs(
      query(
        collection(db, "buses"),
        where("routes", "array-contains-any", routesId)
      )
    );
    console.log(querySnapshot.empty);

    if (querySnapshot.empty) return null

    console.log(querySnapshot);
    let result: any[] = []
    querySnapshot.forEach((doc) => {
      result.push(doc.data())
    });

    return result
  } catch (e) {
    console.log("Error Occured while finding the bus by routeId findBusByRouteId fn :", e)
  }
}

export const _findBusByStopId = async (stopId: string) => {
  try {

    if (!stopId) return null
  } catch (e) {
    console.log("Error Occured while finding the bus from the stopId _findBusByStopId fn : ",)
  }
}


export const findBusByStopId = async (
  colName: string,
  fieldName: string,
  stopId: string,
) => {
  try {
    let routesId = await findRouteByStopId(colName, fieldName, stopId)
    if (routesId) {
      return await findBusByRouteId(routesId)
    }
    console.log(routesId)
  } catch (e) {
    console.log("Error Occured while finding the bus findBusByStopId fn : ", e)
  }
}

/*
 * Finding the bus by stopIds
 */

export const findBusByStopIds = async (
  colName: string,
  fieldName: string,
  stopOneId: string,
  stopTwoId: string
) => {
  console.log(colName, fieldName, stopOneId, stopTwoId);

  try {
    let querySnapshot = await getDocs(
      query(
        collection(db, "routes"),
        where("stops", "in", ["HPSHIS00001"]),
        where("stops", "in", ["HPSHIS00007"])
      )
    );
    console.log(querySnapshot.empty);
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      console.log("////// : ", doc.data());
    });
  } catch (e) {
    console.log(
      "Error Occured while finding the bus by stop IDs useFindBusByStopIds fn : ",
      e
    );
    return {
      message: e.message,
    };
  }
};
