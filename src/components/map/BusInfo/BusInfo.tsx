import { useParams } from "@reach/router";
import { collection, doc, getDoc, query, setDoc } from "firebase/firestore";
import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { useFindStop_, useFirestoreQuery } from "../../../custom-hooks"
import { db, firebaseDAO } from "../../../firebase";
import { Loading } from "../../../pages";

const { firestore } = firebaseDAO

const Container = styled.div`
  padding: 1rem;
`;

const Heading = styled.h1`
  padding: 0.2rem 0rem;
  font-weight: bold;
  text-align: center;
  border-radius: 4em;
  color: ${props => props.theme.__textColor};
`

interface Props {
  updateRoute: any;
}

export const BusInfo: FC<Props> = ({ updateRoute }) => {
  const param = useParams();
  const [result, setResult] = useState<any>([])
  const [r, setR] = useState()
  // const [, [setColName, setDocName], [status, data, error]] = useFindStop_("buses", param.bus)
  // const [, [setRouteColName, setRouteDocName, setRouteCondName], [routeStatus, routeData, routeError]] = useFindStop_()

  const setCoordsData = (coords) => {
    return Object.values(coords).map((geopoint) => [geopoint.coordinates.longitude, geopoint.coordinates.latitude]).join(";")
  }

  const fetchData = async () => {
    try {
      console.log("Fetch Data: ", param.bus)

      firestore.findDocById(param.bus, "buses", setResult)

      // setDocName(param.bus)

      // console.log("Before Fetch Data =============== ", data, routeData);

      // if (data) {
      //   console.log("The routes data")
      //   setRouteColName("routes")
      //   if (data.allotedroute.id) {
      //     setRouteDocName(data.allotedroute.id)
      //     return
      //   }
      //   setRouteDocName(data.allotedroute)
      // }


      // console.log("Fetch Data =============== ", data, routeData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {

    fetchData();

  }, [param.bus]);

  useEffect(() => {

    console.log("Re-render busInfo ----", param.bus)

    if (!result) {
      console.log("Result is missing")
      return
    }

    if (result.length !== 0) {
      console.log("The result : ", result)
      firestore.findDocById(result.allotedroute.id, "routes", setR)
    }

    // fetchData()

    // if (routeData) {
    //   console.log("Route Data: ", routeData)
    //   updateRoute(routeData.stops_)
    // }

  }, [result])

  useEffect(() => {
    if (r) {
      console.log("Hit the r ")
      updateRoute(r.stops_)
    }
  }, [r])

  if (result) {
    return (
      <>
        <div>Result</div>
        <div>{result.id}</div>
        {r ? r.id : null}
      </>
    )
  }

  if (!param) return <div>Something Went Wrong !</div>;

  if (!param.bus) return <div>No such record found !</div>;

  return (
    <div>
      Nothing
    </div>
    // <Container>
    //   <div>{param.bus}</div>
    //   <section>
    //     <Heading>{data.busId}</Heading>
    //     <div>{data.allotedroute.id}</div>
    //     <div>{data.busName}</div>
    //   </section>
    //   <section>
    //     <Heading>Route {routeData.routeName}</Heading>
    //     <ul>
    //       {Object.values(routeData.stops_ || {}).map(stop => <li>{stop.stopName}</li>)}
    //     </ul>
    //   </section>
    // </Container>
  );
};
