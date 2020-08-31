import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

import { locationsRef } from './firebase';
import ItemsList from './ItemsList';

type HomeProps = {
    currentItemId: string | undefined,
    setCurrentItemId: Dispatch<SetStateAction<string | undefined>>,
    parentItemId: string | undefined,
    setParentItemId: Dispatch<SetStateAction<string | undefined>>
}

function Home(props: HomeProps) {
    const [locations, setLocations] = useState<string[]>([]);
    useEffect(() => {
        locationsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            const locationIds: string[] = items && Object.values(items);
            setLocations(locationIds)
        });
    }, []);
    return (
        <>
            <h3>Locations</h3>
            <Link to="/add-location">Add New Location</Link>
            <ItemsList
                itemsList={locations}
                {...props}
            />
        </>
    );
}
export default Home;
