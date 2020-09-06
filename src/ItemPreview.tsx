import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '@material-ui/core';

import { itemsRef } from './firebase';
import { ItemType as Item } from './App';
import Loader from './Loader';
import './ItemPreview.scss';

type ItemPreviewProps = {
    itemId: string,
    showJSON: boolean,
    moveList: string[],
    setMoveList: Dispatch<SetStateAction<string[]>>
}

function ItemPreview(props: ItemPreviewProps) {
    const { itemId, showJSON } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [item, setItem] = useState<Item | null>(null);
    const [numItemsWithin, setNumItemsWithin] = useState<number | null>(null);

    // Get the specified item details from Firebase
    useEffect(() => {
        itemId && itemsRef.child(itemId).on('value', (snapshot) => {
            let item = snapshot.val();
            setItem(item);
            const numberOfItemsWithin = item && item.containing && Object.keys(item.containing).length;
            setNumItemsWithin(numberOfItemsWithin || null);
            setIsLoading(false);
        });
        return () => { itemId && itemsRef.child(itemId).off(); }
    }, [itemId]);

    // Don't render anything if the item is not found
    if (!item) {
        return null;
    }

    return (
        <div className="item-preview">
            {isLoading
                ? <Loader />
                : (
                    <>
                        <Link className="item-preview-link" aria-label="view item" to={`/view/${itemId}`}>
                            <Badge badgeContent={numItemsWithin} color="primary">
                                <div className="preview-image">
                                    {item.images
                                        ? <img className="image" src={item.images[0]} alt="" />
                                        : <div className="no-image" />
                                    }
                                </div>
                            </Badge>
                            <div className="preview-content">
                                <h3>{item.name}</h3>
                            </div>
                        </Link>
                        {showJSON && (<pre><code>{JSON.stringify(item, null, 2)}</code></pre>)}
                    </>
                )}
        </div>
    );
}
export default ItemPreview;