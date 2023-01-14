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
  const [busDocs, setBusDocs] = useState<any>([])
  const [routeDocs, setRouteDocs] = useState()
  // const [, [setColName, setDocName], [status, data, error]] = useFindStop_("buses", param.bus)
  // const [, [setRouteColName, setrouteDocsName, setRouteCondName], [routeStatus, routeData, routeError]] = useFindStop_()

  const setCoordsData = (coords) => {
    return Object.values(coords).map((geopoint) => [geopoint.coordinates.longitude, geopoint.coordinates.latitude]).join(";")
  }

  const fetchData = async () => {
    try {
      console.log("Fetch Data: ", param.bus)

      firestore.findDocById(param.bus, "buses", setBusDocs)

      // setDocName(param.bus)

      // console.log("Before Fetch Data =============== ", data, routeData);

      // if (data) {
      //   console.log("The routes data")
      //   setRouteColName("routes")
      //   if (data.allotedroute.id) {
      //     setrouteDocsName(data.allotedroute.id)
      //     return
      //   }
      //   setrouteDocsName(data.allotedroute)
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

    if (!busDocs) {
      console.log("Result is missing")
      return
    }

    if (busDocs.length !== 0) {
      console.log("The result : ", busDocs)
      firestore.findDocById(busDocs.allotedroute.id, "routes", setRouteDocs)
    }

    // fetchData()

    // if (routeData) {
    //   console.log("Route Data: ", routeData)
    //   updateRoute(routeData.stops_)
    // }

  }, [busDocs])

  useEffect(() => {
    if (routeDocs) {
      console.log("Hit the r ")
      updateRoute(routeDocs.stops)
    }
  }, [routeDocs])

  if (!busDocs || !routeDocs) {
    return (
      <>
        <div>Result</div>
      </>
    )
  }

  if (!param) return <div>Something Went Wrong !</div>;

  if (!param.bus) return <div>No such record found !</div>;

  return (
    <>
      <Container>
        <div>{param.bus}</div>
        <section>
          <Heading>{busDocs.busId}</Heading>
          <div>{busDocs.allotedroute.id}</div>
          <div>{busDocs.busName}</div>
        </section>
        <section>
          <Heading>Route {routeDocs.routeName}</Heading>
          <ul>
            {routeDocs.stops.map((stop, index) => {
              return <li key={index}>{stop.stopName}</li>
            })}
          </ul>
        </section>
      </Container>
    </>
  );
};
