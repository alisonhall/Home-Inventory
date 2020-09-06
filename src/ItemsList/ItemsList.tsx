import React, { Dispatch, SetStateAction } from 'react';

import { Card, CardContent, Divider } from '@material-ui/core';

import ItemPreview from '../ItemPreview/ItemPreview';

type ItemsListProps = {
    itemsList: string[],
    withinCard: boolean,
    showJSON: boolean,
    moveList: string[],
    setMoveList: Dispatch<SetStateAction<string[]>>
}

function ItemsList(props: ItemsListProps) {
    const { itemsList, withinCard = false, ...additionalProps } = props;

    // Don't render anything if there is no list of items, or there are no items within the list
    if (!itemsList || !itemsList.length) {
        return null;
    }

    // Render a preview of each item within the list
    const content = itemsList && itemsList.map((itemId: string, i: number) => {
        return (
            <React.Fragment key={i}>
                <ItemPreview itemId={itemId} {...additionalProps} />
                {i < itemsList.length - 1 && <Divider />}
            </React.Fragment>
        );
    })

    // Return just the content if already within a card
    if (withinCard) {
        return (
            <>
                {content}
            </>
        );
    }

    // Return within a card if not already within a card
    return (
        <Card>
            <CardContent>
                <h2>Items</h2>
                {content}
            </CardContent>
        </Card>
    );
}
export default ItemsList;