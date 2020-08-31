import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

import { itemsRef } from './firebase';
import './ItemPreview.scss';

type ItemPreviewProps = {
    itemId: string,
    currentItemId: string | undefined,
    setCurrentItemId: Dispatch<SetStateAction<string | undefined>>,
    parentItemId: string | undefined,
    setParentItemId: Dispatch<SetStateAction<string | undefined>>
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
    useEffect(() => {
        itemId && itemsRef.child(itemId).on('value', (snapshot) => {
            let item = snapshot.val();
            setItem(item);
        });
    }, [itemId]);

    if (!item) {
        return null;
    }
    return (
        <>
            <div className="item-preview">
                <Link aria-label="view" to={`/view/${itemId}`}>
                    <img src={item.images && item.images[0]} alt="" className="preview-image" />
                    <p>{item.name}</p>
                </Link>
            </div>
            <pre><code>{JSON.stringify(item, null, 2)}</code></pre>
        </>
    );
}
export default ItemPreview;