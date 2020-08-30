import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import { locationsRef } from "./firebase";
import './Location.scss';

function Location(props: any) {
    const { location } = props;
    const [value, setValue] = useState(location.name);
    const updateLocation = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();
        locationsRef.child(location.id).set({
            ...location,
            name: value
        })
    }
    return (
        <>
            <div className="location">
                <img src={location.image} alt="" />
                <form onSubmit={updateLocation}>
                    <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        label="Location"
                        variant="outlined"
                    />
                </form>
                <IconButton aria-label="delete" onClick={e => locationsRef.child(location.id).remove()}>
                    <DeleteIcon fontSize="large" />
                </IconButton>
            </div>
            <pre><code>{JSON.stringify(location, null, 2)}</code></pre>
        </>
    );
}
export default Location;