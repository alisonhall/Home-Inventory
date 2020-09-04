import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { itemsRef, databaseRef, locationsRef, storage } from './firebase';

declare global {
    interface FileList {
        forEach(callback: (f: File) => void) : void;
    }
}

type Item = {
    id?: string | null | undefined,
    name?: string,
    images?: string[],
    files?: string[],
    containing?: string[],
    containedWithin?: string
}

type ParamsType = {
    itemId?: string,
    parentId?: string
}

type EditFormProps = {
    showJSON: boolean
}

function EditForm(props: EditFormProps) {
    let { itemId, parentId }: ParamsType = useParams();
    const { showJSON } = props;

    const [item, setItem] = useState<Item | undefined>(undefined);
    const [parentItem, setParentItem] = useState<Item | undefined>(undefined);
    const [locationIds, setLocationIds] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [imageUrls, setImageURLs] = useState<string[]>([]);
    const [fileUrls, setFileURLs] = useState<string[]>([]);

    // Get the specified item from the URL param for when editing that item
    useEffect(() => {
        itemId && itemsRef.child(itemId).on('value', (snapshot) => {
            let item = snapshot.val();
            setItem(item);
            setName(item.name);
            setImageURLs(item.images);
            setFileURLs(item.files);
        });
        return () => { itemId && itemsRef.child(itemId).off(); }
    }, [itemId]);
    // Get the details of the parent item for when creating a new item within the parent item
    useEffect(() => {
        parentId && itemsRef.child(parentId).on('value', (snapshot) => {
            let item = snapshot.val();
            setParentItem(item);
        });
        return () => { parentId && itemsRef.child(parentId).off(); }
    }, [parentId]);
    // Get the list of location IDs for when creating a new location item
    useEffect(() => {
        locationsRef.on('value', (snapshot) => {
            let item = snapshot.val();
            setLocationIds(Object.values(item));
        });
        return () => { locationsRef.off(); }
    }, []);

    let history = useHistory();

    // Set the action type the form is handling
    let actionType = 'Create New Location';
    if (itemId) {
        actionType = 'Edit Item';
    } else if (parentId) {
        actionType = 'Create New Item';
    }

    function handleImageUpload(e: React.FormEvent<EventTarget>) {
        try {
            e.preventDefault();

            const target = e.target as HTMLInputElement;
            // Get the files selected in the form
            const fileItems = target && target.files && target.files as FileList;
            
            const newImageUrls:string[] = [];
            const newFileUrls:string[] = [];

            // Upload all selected files
            const uploadImagePromise = new Promise((resolve, reject) => {
                fileItems && Array.from(fileItems).forEach(fileItem => {
                    // Upload a single file
                    if (fileItem && fileItem.name) {
                        switch (fileItem.type) {
                            case 'image/gif':
                            case 'image/jpeg':
                            case 'image/png':
                            case 'image/svg+xml':
                            case 'image/tiff':
                            case 'image/webp':
                            case 'image/bmp':
                                // Set the imageCompression options
                                const options = {
                                    maxSizeMB: 0.5,
                                    maxWidthOrHeight: 1280,
                                    useWebWorker: true
                                }

                                imageCompression(fileItem, options)
                                    .then(function (compressedFile) {
                                        try {
                                            // Upload the compressed image to the Firebase /images folder
                                            const uploadTask = storage.ref(`/images/${fileItem.name}`).put(compressedFile);
                                            // Get the newly uploaded image's url, and add it to the list of image URLs
                                            uploadTask.on("state_changed", console.log, console.error, () => {
                                                storage
                                                    .ref("images")
                                                    .child(fileItem.name)
                                                    .getDownloadURL()
                                                    .then((url) => {
                                                        newImageUrls.push(url);
                                                    });
                                            });
                                        } catch (error) {
                                            alert('Error when saving image!');
                                            reject(error);
                                        }
                                    })
                                    .catch(function (error) {
                                        alert('Error when saving image!');
                                        reject(error.message);
                                    });
                                break;
                            default:
                                try {
                                    // Upload the file to the Firebase /files folder
                                    const uploadTask = storage.ref(`/files/${fileItem.name}`).put(fileItem);
                                    // Get the newly uploaded files's url, and add it to the list of file URLs
                                    uploadTask.on("state_changed", console.log, console.error, () => {
                                        storage
                                            .ref("files")
                                            .child(fileItem.name)
                                            .getDownloadURL()
                                            .then((url) => {
                                                newFileUrls.push(url);
                                            });
                                    });
                                } catch (error) {
                                    alert('Error when saving image!');
                                    reject(error);
                                }
                                break;
                        }
                    } else {
                        reject('No image/file provided');
                    }
                });

                resolve(true);
            });

            // Update the changed image and file URLs within the component state once all of the files have finished uploading
            uploadImagePromise.then(result => {
                setImageURLs(newImageUrls);
                setFileURLs(newFileUrls);
            }, function (error) {
                console.error('ERROR:', error);
            });
        } catch (error) {
            console.error('ERROR in EditForm.jsx, handleImageUpload function', error);
        }
    }

    const saveItem = (e: React.FormEvent<EventTarget>) => {
        try {
            e.preventDefault();
            let itemKey: string | undefined | null = itemId;

            // Data of the item to be created or updated
            const updatedItem = {
                ...item,
                name: name,
                images: imageUrls,
                files: fileUrls
            };

            const updates: any = {};

            if (itemId) {
                // Editing an item
                updates[`/items/${itemKey}`] = updatedItem;
                databaseRef.update(updates, function (error) {
                    if (error) {
                        alert('The updating of data failed!');
                        console.error(error);
                    }
                });
            } else if (parentId) {
                // Creating a new item
                // Get new item key
                itemKey = itemsRef.push().key;

                // Set which item the new item is within
                updatedItem[`containedWithin`] = parentId;
                updatedItem[`id`] = itemKey;

                // Add the new item to the Firebase items reference
                updates[`/items/${itemKey}`] = updatedItem;

                // Add the new item key to the list of the parent item's containing items
                if (parentItem && !parentItem.containing) {
                    updates[`/items/${parentId}`] = {...parentItem, containing: [ itemKey ]}
                } else if (parentItem && parentItem.containing) {
                    const containingItemIds: string[] = Object.values(parentItem.containing) || [];
                    itemKey && containingItemIds.push(itemKey);
                    updates[`/items/${parentId}/containing`] = containingItemIds;
                }
                
                // Apply the updates to the Firebase database
                databaseRef.update(updates, function (error) {
                    if (error) {
                        alert('The updating of data failed!');
                        console.error(error);
                    }
                });
            } else {
                // Creating a new location
                // Get new item key
                itemKey = itemsRef.push().key;

                // Add the new item to the items reference, add the new item key to the list of location ids
                updatedItem[`id`] = itemKey;
                updates[`/items/${itemKey}`] = updatedItem;
                updates[`/locations`] = [...locationIds, itemKey];

                // Apply the updates to the Firebase database
                databaseRef.update(updates, function (error) {
                    if (error) {
                        alert('The updating of data failed!');
                        console.error(error);
                    }
                });
            }
            // Redirect the page to view the newly created item
            return history.push(`/view/${itemKey}`)
        } catch (error) {
            console.error('ERROR in EditForm.jsx, saveItem function', error);
        }
    };

    const deleteImage = (type: string, index: number) => {
        if (type === 'image') {
            // Remove the specified image from the image URLs list state
            const updatedUrls = [...imageUrls];
            updatedUrls.splice(index, 1);
            setImageURLs(updatedUrls);
        } else {
            // Remove the specified file from the file URLs list state
            const updatedUrls = [...fileUrls];
            updatedUrls.splice(index, 1);
            setFileURLs(updatedUrls);
        }
    }

    return (
        <Card>
            <CardContent>
                <h3>{actionType}</h3>
                {showJSON && item && (<pre><code>{JSON.stringify(item, null, 2)}</code></pre>)}
                <form onSubmit={saveItem}>
                    <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        label="Name"
                        variant="outlined"
                    />
                    <input
                        type="file"
                        id="icon-button-file"
                        onChange={(e) => handleImageUpload(e)}
                        capture="environment"
                        accept="image/*,.pdf"
                        multiple
                    />
                    <label htmlFor="icon-button-file">
                        <IconButton color="primary" aria-label="upload file" component="span">
                            <PhotoCamera />
                        </IconButton>
                    </label>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={saveItem}
                    >
                        Save
                </Button>
                </form>
                <Divider />

                {imageUrls && imageUrls.map((url, index) => (
                    <div className="image" key={index}>
                        <img src={url} alt="" className="preview-image" />
                        <IconButton aria-label="delete" onClick={e => deleteImage('image', index)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </div>
                ))}
                {fileUrls && fileUrls.map((url, index) => (
                    <div className="file" key={index}>
                        <FileCopyIcon fontSize="large" />
                        <IconButton aria-label="delete" onClick={e => deleteImage('file', index)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
export default EditForm;