import React, { useState } from 'react';
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";

import { locationsRef } from './firebase';

function LocationForm() {
    const [value, setValue] = useState("");
    const createLocation = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();
        const item = {
            id: Date.now(),
            name: value,
        };
        locationsRef.push(item);
        setValue("");
    };
    return (
        <>
            <h3>Add Location</h3>
            <form onSubmit={createLocation}>
                <TextField
                    style={{ width: "100%" }}
                    id="outlined-basic"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    label="Add Location"
                    variant="outlined"
                />
            </form>
            <Divider />
        </>
    );
}
export default LocationForm;