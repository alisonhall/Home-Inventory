import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link, useParams } from 'react-router-dom';
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

    if (!item) {
        return null;
    }

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