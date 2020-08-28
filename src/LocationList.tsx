import React, { useState, useEffect } from "react";
import Divider from "@material-ui/core/Divider";

import { locationsRef } from "./firebase";
import Location from "./Location";

function LocationList() {
    const [locations, setLocations] = useState<any>([]);
    useEffect(() => {
        locationsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    id: item,
                    name: items[item].name,
                });
            }
            setLocations(newState)
        });
    }, [])
    return (
        <>
            {locations.map((location: any, i: number) => (
                <React.Fragment key={location.id}>
                    <Location location={location} />
                    {i < locations.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </>
    );
}
export default LocationList;