import React, { Dispatch, SetStateAction } from 'react';
import Divider from '@material-ui/core/Divider';

import ItemPreview from './ItemPreview';

type ItemsListProps = {
    itemsList: string[],
    currentItemId: string | undefined,
    setCurrentItemId: Dispatch<SetStateAction<string | undefined>>,
    parentItemId: string | undefined,
    setParentItemId: Dispatch<SetStateAction<string | undefined>>
}

function ItemsList(props: ItemsListProps) {
    const { itemsList, ...defaultProps } = props;

    if (!itemsList || !itemsList.length) {
        return null;
    }

    return (
        <>
            <h3>Items</h3>
            {itemsList && itemsList.map((itemId: string, i: number) => {
                return (
                    <React.Fragment key={i}>
                        <ItemPreview itemId={itemId} {...defaultProps} />
                        {i < itemsList.length - 1 && <Divider />}
                    </React.Fragment>
                );
            })}
        </>
    );
}
export default ItemsList;