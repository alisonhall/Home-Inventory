import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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
            <IconButton>
                <Link aria-label="add new location" to="/add-location">
                    <AddCircleOutlineIcon fontSize="small" />
                </Link>
            </IconButton>
            <ItemsList
                itemsList={locations}
                {...props}
            />
        </>
    );
}
export default Home;
