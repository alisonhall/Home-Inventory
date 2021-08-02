import { Dispatch, SetStateAction } from 'react';

/* Utility and helper functions */

export type ItemType = {
    id?: string | null | undefined,
    name?: string,
    notes?: string,
    expiryDate?: any,
    images?: string[],
    files?: string[],
    containing?: string[],
    containedWithin?: string
}

type ChangeMoveListProps = {
    moveList: string[],
    itemId: string,
    setMoveList: Dispatch<SetStateAction<string[]>>
}

export const addToMoveList = (props: ChangeMoveListProps) => {
    const {
        moveList,
        itemId,
        setMoveList
    } = props;

    if (moveList.indexOf(itemId) >= 0) {
        // Do nothing if the item's ID is already within the move list
        console.warn('Item already within move list', { itemId, moveList });
    } else {
        // Append the item's ID to the move list
        const updatedMoveList = [...moveList, itemId];
        setMoveList(updatedMoveList);
        console.warn('Added to move list', { itemId, updatedMoveList });
    }
};

export const removeFromMoveList = (props: ChangeMoveListProps) => {
    const {
        moveList,
        itemId,
        setMoveList
    } = props;

    // Remove the specified item from the move list array
    const updatedMoveList = [...moveList];
    const indexOfItemInMoveList = updatedMoveList.indexOf(itemId);
    const removedItem = updatedMoveList.splice(indexOfItemInMoveList, 1);

    // Push the changes to the App component state
    setMoveList(updatedMoveList);
    console.warn('Removing item from move list', { itemId, removedItem });
}
