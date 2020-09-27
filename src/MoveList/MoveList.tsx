import React, { useState, Dispatch, SetStateAction } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { IconButton } from '@material-ui/core';
import { MoveToInbox as MoveToInboxIcon } from '@material-ui/icons';

import { getItemDataOnce, databaseRef } from '../firebase';
import ItemThumbnail from '../ItemThumbnail/ItemThumbnail';
import './MoveList.scss';
import Loader from '../Loader/Loader';

type ParamsType = {
    itemId: string,
    parentId?: string
}

type MoveListProps = {
    showJSON: boolean,
    userId: string | null,
    moveList: string[],
    setMoveList: Dispatch<SetStateAction<string[]>>
}

function MoveList(props: MoveListProps) {
    let { itemId, parentId }: ParamsType = useParams();
    const { moveList, setMoveList, showJSON, userId, ...additionalProps } = props;

    const [isLoading, setIsLoading] = useState(false);

    let history = useHistory();

    // Don't render anything if there is no list of items, or there are no items within the list
    if (!moveList || !moveList.length || !itemId || parentId) {
        return null;
    }

    // Render a preview of each item within the list
    const content = moveList && moveList.map((itemId: string, i: number) => {
        return (
            <React.Fragment key={i}>
                <ItemThumbnail itemId={itemId} moveList={moveList} setMoveList={setMoveList} {...additionalProps} />
            </React.Fragment>
        );
    })

    const moveItemsFromMoveList = () => {
        if (!itemId) {
            return null;
        }

        setIsLoading(true);

        // Get the item data for the current viewing page (where the items will be moved to)
        getItemDataOnce(itemId).then((currentItem) => {
            // The current data of items within
            const currentContaining = (currentItem && currentItem.containing && Object.values(currentItem.containing)) || [];

            const updates: any = {};
            // Update the current data of items within to include the new items from the move list
            updates[`/${userId}/items/${itemId}/containing`] = [...currentContaining, ...moveList];

            const promises: any = [];
            const errors: string[] = [];
    
            moveList.forEach((moveItem) => {
                // Get the data for each move item's ID
                promises.push(getItemDataOnce(moveItem).then((item) => {
                    const moveItemId = item && item.id;

                    if (typeof moveItemId === 'string') {
                        // Update the moved item with it's new parent ID
                        updates[`/${userId}/items/${moveItemId}/containedWithin`] = itemId;
    
                        const moveItemParentId = item.containedWithin;

                        if (typeof moveItemParentId === 'string') {
                            return Promise.all([
                                // Get the data for the move item's parent
                                getItemDataOnce(moveItemParentId).then((parentItem) => {
                                    // The move item parent's array of containing items
                                    let parentContainingIds = parentItem && parentItem.containing && Object.values(parentItem.containing);
                                    // The index that the move item is at within the move item parent's containing items array
                                    let updatedContainingItems = updates[`/${userId}/items/${parentItem.id}/containing`] || parentContainingIds;
                                    const itemIndexInParent = updatedContainingItems && updatedContainingItems.indexOf(moveItemId);

                                    if (typeof itemIndexInParent === 'number' && itemIndexInParent >= 0) {
                                        // Remove the move item from the move item parent's containing items array
                                        updatedContainingItems.splice(itemIndexInParent, 1);
                                        // Update the move item parent's containing items array to not include the move item
                                        updates[`/${userId}/items/${parentItem.id}/containing`] = updatedContainingItems;
                                    } else {
                                        errors.push('ERROR: Move item not found in parent');
                                        console.error('ERROR: Move item not found in parent', { item, parentItem, parentContainingIds, updatedContainingItems, itemIndexInParent, moveItemId });
                                    }
                                }).catch((error) => {
                                    errors.push("ERROR: getting move item's parent data");
                                    console.error("ERROR: getting move item's parent data", error, { item, moveItemParentId });
                                })
                            ]);
                        } else {
                            errors.push("ERROR: invalid move item's parent ID");
                            console.error("ERROR: invalid move item's parent ID", { item, moveItemParentId });
                        }
                    } else {
                        errors.push('ERROR: invalid move item ID');
                        console.error('ERROR: invalid move item ID', { item, moveItemId });
                    }
                }).catch((error) => {
                    errors.push("ERROR: getting move item's data");
                    console.error("ERROR: getting move item's data", error, { moveItem });
                }));
            });

            // After each move item has been gone through and all of the updates to be done consolidated
            Promise.all(promises).then(() => {
                if (errors.length > 0) {
                    alert(`Items not moved due to error: ${JSON.stringify(errors)}`);
                } else {
                    console.warn('Moving items', { updates });
    
                    // Apply the updates to the Firebase database
                    return databaseRef.update(updates, function (error) {
                        if (error) {
                            alert('The updating of data failed!');
                            console.error(error);
                        }
                    });
                }
            }).then(() => {
                setMoveList([]);
                setIsLoading(false);
                return history.push(`/view/${itemId}`);
            }).catch((error) => {
                alert('Error with moving items!');
                console.error('ERROR with moving items', error);
            });
        });
    }

    return (
        <div className="move-list">
            {isLoading
                ? <Loader />
                : (
                    <>
                        <IconButton className="move-items-button" title="Move items from move list" aria-label="move items from move list" onClick={moveItemsFromMoveList}>
                            <MoveToInboxIcon />
                        </IconButton>
                        {content}
                        { showJSON && (<pre><code>{JSON.stringify(moveList, null, 2)}</code></pre>) }
                    </>
                )
            }
        </div>
    );
}
export default MoveList;