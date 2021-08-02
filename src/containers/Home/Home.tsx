import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

import { Container, Card, CardContent, Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { locationsRef } from '../../utils/firebase';
import MoveList from '../../components/MoveList/MoveList';
import ItemsList from '../ItemsList/ItemsList';
import Loader from '../../components/Loader/Loader';

type HomeProps = {
    showJSON: boolean,
    userId: string | null,
    moveList: string[],
    setMoveList: Dispatch<SetStateAction<string[]>>
}

function Home(props: HomeProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [locations, setLocations] = useState<string[]>([]);

    // Get the list of location IDs
    useEffect(() => {
        locationsRef && locationsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            const locationIds: string[] = items && Object.values(items);
            setLocations(locationIds);
            setIsLoading(false);
        });
        return () => { locationsRef && locationsRef.off(); }
    }, []);

    return (
        <>
            <MoveList {...props} />
            <Container className="container" maxWidth="sm">
                <Card>
                    <CardContent>
                        {isLoading
                            ? <Loader />
                            : (
                                <>
                                    <h1>Locations</h1>
                                    <Fab className="add-button" color="secondary" title="Add new location" aria-label="add new location" component={Link} to="/add-location">
                                        <AddIcon fontSize="large" />
                                    </Fab>
                                    <ItemsList itemsList={locations} {...props} withinCard />
                                </>
                            )}
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}
export default Home;
