import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { itemsRef } from './firebase';
import './ItemPreview.scss';

type ItemPreviewProps = {
    itemId: string
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
    const { itemId } = props;

    const [item, setItem] = useState<Item | null>(null);

    // Get the specified item details from Firebase
    useEffect(() => {
        itemId && itemsRef.child(itemId).on('value', (snapshot) => {
            let item = snapshot.val();
            setItem(item);
        });
    }, [itemId]);

    // Don't render anything if the item is not found
    if (!item) {
        console.error('Item not found', itemId);
        return null;
    }

    return (
        <div className="item-preview">
            <Link aria-label="view" to={`/view/${itemId}`}>
                <img src={item.images && item.images[0]} alt="" className="preview-image" />
                <p>{item.name}</p>
            </Link>
            <pre><code>{JSON.stringify(item, null, 2)}</code></pre>
        </div>
    );
}
export default ItemPreview;