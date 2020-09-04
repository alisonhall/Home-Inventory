import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { databaseRef, itemsRef, locationsRef } from './firebase';
import ItemPreview from './ItemPreview';

type ParamsType = {
    itemId: string
}

interface Item {
    id?: string,
    name?: string,
    images?: string[],
    files?: string[],
    containing?: string[],
    containedWithin?: string
}

type ViewItemProps = {
    showJSON: boolean
}

function ViewItem(props: ViewItemProps) {
    let { itemId }: ParamsType = useParams();
    const { showJSON } = props;

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
        });
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
    }, [item]);
    // Get the list of location IDs
    useEffect(() => {
        locationsRef.on('value', (snapshot) => {
            let item = snapshot.val();
            setLocationIds(Object.values(item));
        });
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
            }
        } catch (error) {
            console.error('ERROR in ViewItem.jsx, deleteItem function', error);
        }
    };

    return (
        <>
            <Card>
                <CardContent>
                    {withinItem && (
                        <Link aria-label="view parent item" to={`/view/${withinItem.id}`}>
                            Within {withinItem.name}
                        </Link>
                    )}
                    <h3>{item.name}</h3>
                    {item.images && item.images.map((image, index) => (
                        <Link to={image} key={index}>
                            <img src={image} alt="" className="preview-image" />
                        </Link>
                    ))}
                    {item.files && item.files.map((file, index) => (
                        <Link to={file} key={index}>
                            <FileCopyIcon />
                        </Link>
                    ))}
                    <IconButton>
                        <Link aria-label="new" to={`/add/${item.id}`}>
                            <AddCircleOutlineIcon fontSize="small" />
                        </Link>
                    </IconButton>
                    <IconButton>
                        <Link aria-label="edit" to={`/edit/${item.id}`}>
                            <EditIcon fontSize="small" />
                        </Link>
                    </IconButton>
                    <IconButton aria-label="delete" onClick={deleteItem}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                    {showJSON && (<pre><code>{JSON.stringify(item, null, 2)}</code></pre>)}
                </CardContent>
            </Card>
            {containingItemIds && (
                <Card>
                    <CardContent>
                        <h4>Items within:</h4>
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
        </>
    );
}
export default ViewItem;