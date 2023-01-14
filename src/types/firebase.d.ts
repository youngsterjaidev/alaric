export interface Bus {
    allotedroute: string,
    busCategory: string,
    busId: string,
    busName: string,
    routes: [string, string],
    time: string
}

export interface Fare {
    distance: string,
    fareId: string,
    stops: string[]
}

interface RouteStop {
    coordinates: {
        latitude: string,
        longitude: string
    },
    stopName: string
}

export interface Route {
    destination: string,
    distance: string,
    routeId: string,
    source: string,
    stops: [RouteStop]
}

export interface Stop {
    buses: string[],
    coordinates: [string, string],
    stopId: string,
    stopName: string
}

export interface CurrentLocation {
    latitude: string,
    longitude: string
}

export interface Location {
    busName: string,
    currentLocation: CurrentLocation
}
