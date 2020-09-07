import React, { Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';

import { IconButton } from '@material-ui/core';
import { MoveToInbox as MoveToInboxIcon } from '@material-ui/icons';

import ItemThumbnail from '../ItemThumbnail/ItemThumbnail';
import './MoveList.scss';

type ParamsType = {
    itemId: string
}

type MoveListProps = {
    showJSON: boolean,
    moveList: string[],
    setMoveList: Dispatch<SetStateAction<string[]>>
}

function MoveList(props: MoveListProps) {
    let { itemId }: ParamsType = useParams();
    const { moveList, setMoveList, showJSON, ...additionalProps } = props;

    // Don't render anything if there is no list of items, or there are no items within the list
    if (!moveList || !moveList.length) {
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

    function moveItemsFromMoveList() {

    }

    return (
        <div className="move-list">
            {content}
            <IconButton className="move-items-button" title="Move items from move list" aria-label="move items from move list" onClick={moveItemsFromMoveList)}>
                <MoveToInboxIcon />
            </IconButton>
            {showJSON && (<pre><code>{JSON.stringify(moveList, null, 2)}</code></pre>)}
        </div>
    );
}
export default MoveList;