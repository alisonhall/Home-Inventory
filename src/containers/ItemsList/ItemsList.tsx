import React, { Dispatch, SetStateAction } from 'react';

import { Container, Card, CardContent, Divider } from '@material-ui/core';

import MoveList from '../../components/MoveList/MoveList';
import ItemPreview from '../../components/ItemPreview/ItemPreview';

type ItemsListProps = {
    itemsList: string[],
    withinCard: boolean,
    showJSON: boolean,
    userId: string | null,
    moveList: string[],
    setMoveList: Dispatch<SetStateAction<string[]>>
}

function ItemsList(props: ItemsListProps) {
    const { itemsList, withinCard = false, moveList, setMoveList, showJSON, ...additionalProps } = props;

    // Don't render anything if there is no list of items, or there are no items within the list
    if (!itemsList || !itemsList.length) {
        return null;
    }

    // Render a preview of each item within the list
    const content = itemsList && itemsList.map((itemId: string, i: number) => {
        return (
            <React.Fragment key={i}>
                <ItemPreview itemId={itemId} showJSON={showJSON} moveList={moveList} setMoveList={setMoveList} {...additionalProps} />
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
        <>
            <MoveList moveList={moveList} setMoveList={setMoveList} showJSON={showJSON} {...additionalProps} />
            <Container className="container" maxWidth="sm">
                <Card>
                    <CardContent>
                        <h2>Items</h2>
                        {content}
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}
export default ItemsList;