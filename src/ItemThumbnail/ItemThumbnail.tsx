import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

import { Button } from '@material-ui/core';
import { RemoveCircleOutline as RemoveCircleOutlineIcon } from '@material-ui/icons';

import { itemsRef } from '../firebase';
import { ItemType as Item, removeFromMoveList } from '../helpers';
import Loader from '../Loader/Loader';
import './ItemThumbnail.scss';

type ItemThumbnailProps = {
    itemId: string,
    moveList: string[],
    setMoveList: Dispatch<SetStateAction<string[]>>
}

function ItemThumbnail(props: ItemThumbnailProps) {
    const { itemId, moveList, setMoveList } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [item, setItem] = useState<Item | null>(null);

    // Get the specified item details from Firebase
    useEffect(() => {
        itemId && itemsRef.child(itemId).on('value', (snapshot) => {
            let item = snapshot.val();
            setItem(item);
            setIsLoading(false);
        });
        return () => { itemId && itemsRef.child(itemId).off(); }
    }, [itemId]);

    // Don't render anything if the item is not found
    if (!item) {
        return null;
    }

    return (
        <div className="item-thumbnail">
            {isLoading
                ? <Loader />
                : (
                    <>
                        <Button className="remove-item-button" aria-label="view item" onClick={() => removeFromMoveList({ moveList, itemId, setMoveList })}>
                            <div className="preview-image">
                                {item.images
                                    ? <img className="image" src={item.images[0]} alt="" />
                                    : <div className="no-image" />
                                }
                            </div>
                            <p className="name">{item.name}</p>
                            <RemoveCircleOutlineIcon className="remove-icon" />
                        </Button>
                    </>
                )}
        </div>
    );
}
export default ItemThumbnail;