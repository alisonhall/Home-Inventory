import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { databaseRef, itemsRef, locationsRef } from './firebase';
import ItemPreview from './ItemPreview';

type ParamsType = {
    itemId: string
}

type ViewItemProps = {
    currentItemId: string | undefined,
    setCurrentItemId: Dispatch<SetStateAction<string | undefined>>,
    parentItemId: string | undefined,
    setParentItemId: Dispatch<SetStateAction<string | undefined>>
}

interface Item {
    id?: string,
    name?: string,
    images?: string[],
    files?: string[],
    containing?: string[],
    containedWithin?: string
}

function ViewItem(props: ViewItemProps) {
    let { itemId }: ParamsType = useParams();
    const [item, setItem] = useState<Item | null>(null);
    const [containingItemIds, setContainingItemIds] = useState<string[]>([]);
    const [withinItem, setWithinItem] = useState<Item | null>(null);
    const [locationIds, setLocationIds] = useState<string[]>([]);
    useEffect(() => {
        itemId && itemsRef.child(itemId).on('value', (snapshot) => {
            let item = snapshot.val();
            setItem({ ...item, id: itemId });

            const childIds: string[] | undefined = item && item.containing && Object.values(item.containing);
            setContainingItemIds(childIds);
        });
    }, [itemId]);
    useEffect(() => {
        item && item.containedWithin && itemsRef.child(item.containedWithin).on('value', (snapshot) => {
            let containingItem = snapshot.val();
            setWithinItem({ ...containingItem, id: item.containedWithin });
        });
        if (!item || !item.containedWithin) {
            setWithinItem(null);
        }
    }, [item]);
    useEffect(() => {
        locationsRef.on('value', (snapshot) => {
            let item = snapshot.val();
            setLocationIds(Object.values(item));
        });
    }, []);

    let history = useHistory();

    if (!item) {
        return null;
    }

    const deleteItem = (e: React.FormEvent<EventTarget>) => {
        try {
            e.preventDefault();

            console.log({ item, withinItem, containingItemIds });
            if (containingItemIds) {
                alert('Unable to delete because this item contains other items within it. Delete or move those items within before trying again.')
            } else {
                let parentContainingIds = withinItem && withinItem.containing && Object.values(withinItem.containing);

                if (parentContainingIds) {
                    const itemIndexInParent = parentContainingIds && parentContainingIds.indexOf(itemId);

                    console.log({ itemIndexInParent, parentContainingIds });

                    if (typeof itemIndexInParent === 'number' && itemIndexInParent >= 0) {
                        parentContainingIds.splice(itemIndexInParent, 1);

                        const updatedParentItem = {
                            ...withinItem,
                            containing: parentContainingIds
                        };

                        console.log({updatedParentItem});
            
                        const updates: any = {};
                        updates[`/items/${withinItem && withinItem.id}`] = updatedParentItem;
                        databaseRef.update(updates);
                    }

                    itemsRef.child(itemId).remove();

                    return history.push(`/view/${withinItem && withinItem.id}`);
                } else {
                    const itemIndexInLocations = locationIds && locationIds.indexOf(itemId);
                    const updatedLocations = [...locationIds];
                    if (itemIndexInLocations && itemIndexInLocations >= 0) {
                        updatedLocations.splice(itemIndexInLocations, 1);

                        const updates: any = {};
                        updates[`/locations`] = [...updatedLocations];
                        databaseRef.update(updates);
                    }

                    itemsRef.child(itemId).remove();

                    return history.push(`/`);
                }
            }
        } catch (error) {
            console.error('ERROR in ViewItem.jsx, deleteItem function', error);
        }
    };

    return (
        <>
            {withinItem && (
                <Link aria-label="view parent item" to={`/view/${withinItem.id}`}>
                    Within {withinItem.name}
                </Link>
            )}
            <h3>{item.name}</h3>
            <img src={item.images && item.images[0]} alt="" className="preview-image" />
            <img src={item.images && item.images[1]} alt="" className="preview-image" />
            <img src={item.images && item.images[2]} alt="" className="preview-image" />
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
            <Divider />
            {containingItemIds && containingItemIds.map((itemId: string, i: number) => (
                <React.Fragment key={i}>
                    <ItemPreview itemId={itemId} {...props} />
                    {i < containingItemIds.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </>
    );
}
export default ViewItem;