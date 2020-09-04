import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { locationsRef } from './firebase';
import ItemsList from './ItemsList';

type HomeProps = {
    showJSON: boolean
}

function Home(props: HomeProps) {
    const [locations, setLocations] = useState<string[]>([]);

    // Get the list of location IDs
    useEffect(() => {
        locationsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            const locationIds: string[] = items && Object.values(items);
            setLocations(locationIds)
        });
    }, []);

    return (
        <Card>
            <CardContent>
                <h3>Locations</h3>
                <IconButton>
                    <Link aria-label="add new location" to="/add-location">
                        <AddCircleOutlineIcon fontSize="small" />
                    </Link>
                </IconButton>
                <ItemsList itemsList={locations} {...props} withinCard />
            </CardContent>
        </Card>
    );
}
export default Home;
