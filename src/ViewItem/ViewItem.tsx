import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import { Container, Card, CardContent, Divider, Fab, IconButton, Button } from '@material-ui/core';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, FileCopy as FileCopyIcon, ArrowBackIos as ArrowBackIosIcon } from '@material-ui/icons';

import { databaseRef, itemsRef, locationsRef } from '../firebase';
import { ItemType as Item } from '../helpers';
import MoveList from '../MoveList/MoveList';
import ItemPreview from '../ItemPreview/ItemPreview';
import Loader from '../Loader/Loader';
import './ViewItem.scss';

type ParamsType = {
    itemId: string
}

type ViewItemProps = {
    showJSON: boolean,
    moveList: string[],
    setMoveList: Dispatch<SetStateAction<string[]>>
}

function ViewItem(props: ViewItemProps) {
    let { itemId }: ParamsType = useParams();
    const { showJSON, moveList, setMoveList } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [item, setItem] = useState<Item | null>(null);
    const [containingItemIds, setContainingItemIds] = useState<string[]>([]);
    const [withinItem, setWithinItem] = useState<Item | null>(null);
    const [locationIds, setLocationIds] = useState<string[]>([]);

    // Get the specified item details from Firebase, as well as the IDs of the items within the specified item
    useEffect(() => {
        itemId && itemsRef.child(itemId).on('value', (snapshot) => {
            let item = snapshot.val();
            setItem({ ...item, id: itemId });

            // Get and save the IDs of the items within the retrieved item
            const childIds: string[] | undefined = item && item.containing && Object.values(item.containing);
            setContainingItemIds(childIds);
            setIsLoading(false);
        });
        return () => { itemId && itemsRef.child(itemId).off(); }
    }, [itemId]);
    // Get the details of the parent item
    useEffect(() => {
        item && item.containedWithin && itemsRef.child(item.containedWithin).on('value', (snapshot) => {
            let containingItem = snapshot.val();
            setWithinItem({ ...containingItem, id: item.containedWithin });
        });
        if (!item || !item.containedWithin) {
            setWithinItem(null);
        }
        return () => { item && item.containedWithin && itemsRef.child(item.containedWithin).off(); }
    }, [item]);
    // Get the list of location IDs
    useEffect(() => {
        locationsRef.on('value', (snapshot) => {
            let item = snapshot.val();
            setLocationIds(Object.values(item));
        });
        return () => { locationsRef.off(); }
    }, []);

    let history = useHistory();

    // Don't render anything if the item is not found
    if (!item) {
        return null;
    }

    const deleteItem = (e: React.FormEvent<EventTarget>) => {
        try {
            e.preventDefault();

            if (containingItemIds) {
                // Prevent deleting an item that has other items within it
                alert('Unable to delete because this item contains other items within it. Delete or move those items within before trying again.')
            } else {
                setIsLoading(true);

                let parentContainingIds = withinItem && withinItem.containing && Object.values(withinItem.containing);

                if (parentContainingIds) {
                    // Condition for an item that is not a location
                    // Find the item ID within the parent item's containing items list
                    const itemIndexInParent = parentContainingIds && parentContainingIds.indexOf(itemId);

                    if (typeof itemIndexInParent === 'number' && itemIndexInParent >= 0) {
                        // Remove the item ID from the parent item's containing items list
                        parentContainingIds.splice(itemIndexInParent, 1);

                        // Data of the parent item to be updated
                        const updatedParentItem = {
                            ...withinItem,
                            containing: parentContainingIds
                        };

                        const updates: any = {};
                        // Update the parent item with the updated data
                        updates[`/items/${withinItem && withinItem.id}`] = updatedParentItem;
                        // Remove the item
                        updates[`/items/${itemId}`] = null;

                        console.warn('Removing item', { updates });

                        // Apply the updates to the Firebase database
                        databaseRef.update(updates, function (error) {
                            if (error) {
                                alert('The updating of data failed!');
                                console.error(error);
                            }
                        });

                        // Redirect the page to view the parent item
                        return history.push(`/view/${withinItem && withinItem.id}`);
                    } else {
                        alert("Error: The item was not deleted");
                        console.error("The item was not found within the parent's containing items list", { parentContainingIds, withinItem, itemId, itemIndexInParent })
                    }
                } else {
                    // Condition for a location
                    // Find the item ID within the locations array of IDs
                    const itemIndexInLocations = locationIds && locationIds.indexOf(itemId);
                    const updatedLocations = [...locationIds];

                    if (itemIndexInLocations && itemIndexInLocations >= 0) {
                        // Remove the item ID from the locations array
                        updatedLocations.splice(itemIndexInLocations, 1);

                        const updates: any = {};
                        // Update the locations array to use the updated list of location ids
                        updates[`/locations`] = [...updatedLocations];
                        // Remove the item
                        updates[`/items/${itemId}`] = null;

                        console.warn('Removing location', { updates });

                        // Apply the updates to the Firebase database
                        databaseRef.update(updates, function (error) {
                            if (error) {
                                alert('The updating of data failed!');
                                console.error(error);
                            }
                        });

                        // Redirect the page to the list of locations
                        return history.push(`/`);
                    } else {
                        alert("Error: The item was not deleted");
                        console.error("The item was not found within the list of location ids", { parentContainingIds, withinItem, locationIds, itemId, itemIndexInLocations })
                    }
                }
                setIsLoading(false);
            }
        } catch (error) {
            console.error('ERROR in ViewItem.jsx, deleteItem function', error);
        }
    };

    return (
        <>
            <MoveList moveList={moveList} setMoveList={setMoveList} showJSON={showJSON} />
            <Container className="container" maxWidth="sm">
                <div className="view-item">
                    <Card className="view-item-content">
                        <CardContent>
                            {isLoading
                                ? <Loader />
                                : (
                                    <>
                                        <div className="actions">
                                            {withinItem && (
                                                <Button
                                                    className="parent-item-link"
                                                    variant="contained"
                                                    startIcon={<ArrowBackIosIcon />}
                                                    component={Link}
                                                    to={`/view/${withinItem.id}`}
                                                >
                                                    Go back to {withinItem.name}
                                                </Button>
                                            )}
                                            {!withinItem && (
                                                <Button
                                                    className="parent-item-link"
                                                    variant="contained"
                                                    startIcon={<ArrowBackIosIcon />}
                                                    component={Link}
                                                    to="/"
                                                >
                                                    Go back to All Locations
                                                </Button>
                                            )}
                                            <Fab className="add-button" title="Add item within" color="secondary">
                                                <Link className="link-icon" aria-label="add new item within" to={`/add/${item.id}`}>
                                                    <AddIcon fontSize="large" />
                                                </Link>
                                            </Fab>
                                            <IconButton title="Edit item" color="primary">
                                                <Link className="link-icon" aria-label="edit item" to={`/edit/${item.id}`}>
                                                    <EditIcon fontSize="large" />
                                                </Link>
                                            </IconButton>
                                            <IconButton title="Delete item" aria-label="delete item" color="primary" onClick={deleteItem}>
                                                <DeleteIcon fontSize="large" />
                                            </IconButton>
                                        </div>
                                        <h1>{item.name}</h1>
                                        <p>{item.notes}</p>
                                        <p>{item.expiryDate}</p>
                                        {(item.images || item.files || showJSON) && <Divider />}
                                        <div className="assets">
                                            {item.images && item.images.map((image, index) => (
                                                <a className="image-link" href={image} key={index}>
                                                    <img src={image} alt="" className="image" />
                                                </a>
                                            ))}
                                            {item.files && item.files.map((file, index) => (
                                                <a className="file-link" href={file} key={index}>
                                                    <FileCopyIcon />
                                                </a>
                                            ))}
                                        </div>
                                        {showJSON && (<pre><code>{JSON.stringify(item, null, 2)}</code></pre>)}
                                    </>
                                )}
                        </CardContent>
                    </Card>
                    {containingItemIds && (
                        <Card className="containing-items">
                            <CardContent>
                                <h2>Items within:</h2>
                                <Divider />
                                {containingItemIds && containingItemIds.map((itemId: string, i: number) => (
                                    <React.Fragment key={i}>
                                        <ItemPreview itemId={itemId} {...props} />
                                        {i < containingItemIds.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </Container>
        </>
    );
}
export default ViewItem;