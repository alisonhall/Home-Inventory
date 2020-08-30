import React, { useState } from 'react';
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";

import { locationsRef, storage } from './firebase';

function LocationForm() {
    const [value, setValue] = useState<any>("");
    const [url, setURL] = useState<any>("");

    function handleImageUpload(e: React.FormEvent<EventTarget>) {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const fileItem = target && target.files && target.files[0];
        if (fileItem && fileItem.name) {
            const uploadTask = storage.ref(`/images/${fileItem.name}`).put(fileItem);
            uploadTask.on("state_changed", console.log, console.error, () => {
                storage
                    .ref("images")
                    .child(fileItem.name)
                    .getDownloadURL()
                    .then((url) => {
                        setURL(url);
                    });
            });
        }
    }

    const createLocation = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();
        const item = {
            id: Date.now(),
            name: value,
            image: url
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
                <input
                    type="file"
                    onChange={(e) => handleImageUpload(e)}
                />
            </form>
            <img src={url} alt="" />
            <Divider />
        </>
    );
}
export default LocationForm;