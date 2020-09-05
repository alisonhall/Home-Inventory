import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Card, CardContent, Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { locationsRef } from './firebase';
import ItemsList from './ItemsList';
import Loader from './Loader';

type HomeProps = {
    showJSON: boolean
}

function Home(props: HomeProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [locations, setLocations] = useState<string[]>([]);

    // Get the list of location IDs
    useEffect(() => {
        locationsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            const locationIds: string[] = items && Object.values(items);
            setLocations(locationIds);
            setIsLoading(false);
        });
        return () => { locationsRef.off(); }
    }, []);

    return (
        <Card>
            <CardContent>
                {isLoading
                    ? <Loader />
                    : (
                        <>
                            <h3>Locations</h3>
                            <Fab>
                                <Link aria-label="add new location" to="/add-location">
                                    <AddIcon fontSize="large" />
                                </Link>
                            </Fab>
                            <ItemsList itemsList={locations} {...props} withinCard />
                        </>
                    )}
            </CardContent>
        </Card>
    );
}
export default Home;
