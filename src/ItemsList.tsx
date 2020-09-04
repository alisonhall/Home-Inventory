import React from 'react';
import Divider from '@material-ui/core/Divider';

import ItemPreview from './ItemPreview';

type ItemsListProps = {
    itemsList: string[]
}

function ItemsList(props: ItemsListProps) {
    const { itemsList } = props;

    if (!itemsList || !itemsList.length) {
        return null;
    }

    return (
        <>
            <h3>Items</h3>
            {itemsList && itemsList.map((itemId: string, i: number) => {
                return (
                    <React.Fragment key={i}>
                        <ItemPreview itemId={itemId} />
                        {i < itemsList.length - 1 && <Divider />}
                    </React.Fragment>
                );
            })}
        </>
    );
}
export default ItemsList;