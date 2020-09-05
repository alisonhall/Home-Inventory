import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '@material-ui/core';

import { itemsRef } from './firebase';
import Loader from './Loader';
import './ItemPreview.scss';

type ItemPreviewProps = {
    itemId: string,
    showJSON: boolean
}

type Item = {
    id?: string,
    name?: string,
    images?: string[],
    files?: string[],
    containing?: string[],
    containedWithin?: string
};

function ItemPreview(props: ItemPreviewProps) {
    const { itemId, showJSON } = props;

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

    const numberOfItemsWithin = item && item.containing && Object.keys(item.containing).length;

    return (
        <div className="item-preview">
            {isLoading
                ? <Loader />
                : (
                    <>
                        <Link aria-label="view" to={`/view/${itemId}`}>
                            <img src={item.images && item.images[0]} alt="" className="preview-image" />
                            <Badge badgeContent={numberOfItemsWithin} color="primary">
                                <p>{item.name}</p>
                            </Badge>
                        </Link>
                        {showJSON && (<pre><code>{JSON.stringify(item, null, 2)}</code></pre>)}
                    </>
                )}
        </div>
    );
}
export default ItemPreview;