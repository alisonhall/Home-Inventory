import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { itemsRef, databaseRef, locationsRef, storage } from './firebase';

declare global {
    interface FileList {
        forEach(callback: (f: File) => void) : void;
    }
}

type Item = {
    id?: string,
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
    currentItemId: string | undefined,
    setCurrentItemId: Dispatch<SetStateAction<string | undefined>>,
    parentItemId: string | undefined,
    setParentItemId: Dispatch<SetStateAction<string | undefined>>
}

function EditForm(props: EditFormProps) {
    let { itemId, parentId }: ParamsType = useParams();
    const [item, setItem] = useState<Item | undefined>(undefined);
    const [parentItem, setParentItem] = useState<Item | undefined>(undefined);
    const [locationIds, setLocationIds] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [imageUrls, setImageURLs] = useState<string[]>([]);
    const [fileUrls, setFileURLs] = useState<string[]>([]);
    useEffect(() => {
        itemId && itemsRef.child(itemId).on('value', (snapshot) => {
            let item = snapshot.val();
            setItem(item);
            setName(item.name);
            setImageURLs(item.images);
            setFileURLs(item.files);
        });
    }, [itemId]);
    useEffect(() => {
        parentId && itemsRef.child(parentId).on('value', (snapshot) => {
            let item = snapshot.val();
            setParentItem(item);
        });
    }, [parentId]);
    useEffect(() => {
        locationsRef.on('value', (snapshot) => {
            let item = snapshot.val();
            setLocationIds(Object.values(item));
        });
    }, []);

    let history = useHistory();

    function handleImageUpload(e: React.FormEvent<EventTarget>) {
        try {
            e.preventDefault();

            const target = e.target as HTMLInputElement;
            const fileItems = target && target.files && target.files as FileList;

            
            const newImageUrls:string[] = [];
            const newFileUrls:string[] = [];

            var promise = new Promise((resolve, reject) => {
                fileItems && Array.from(fileItems).forEach(fileItem => {
                    if (fileItem && fileItem.name) {
                        switch (fileItem.type) {
                            case 'image/gif':
                            case 'image/jpeg':
                            case 'image/png':
                            case 'image/svg+xml':
                            case 'image/tiff':
                            case 'image/webp':
                            case 'image/bmp':
                                const options = {
                                    maxSizeMB: 0.5,
                                    maxWidthOrHeight: 1280,
                                    useWebWorker: true
                                }

                                imageCompression(fileItem, options)
                                    .then(function (compressedFile) {
                                        try {
                                            const uploadTask = storage.ref(`/images/${fileItem.name}`).put(compressedFile);
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
                                            reject(error);
                                        }
                                    })
                                    .catch(function (error) {
                                        reject(error.message);
                                    });
                                break;
                            default:
                                try {
                                    const uploadTask = storage.ref(`/files/${fileItem.name}`).put(fileItem);
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

            promise.then(result => {
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

            const updatedItem = {
                ...item,
                name: name,
                images: imageUrls,
                files: fileUrls
            };

            const updates: any = {};

            if (itemId) {
                updates[`/items/${itemKey}`] = updatedItem;
                databaseRef.update(updates);
            } else if (parentId) {
                itemKey = itemsRef.push().key;
                updatedItem[`containedWithin`] = parentId;

                updates[`/items/${itemKey}`] = updatedItem;

                if (parentItem && !parentItem.containing) {
                    updates[`/items/${parentId}`] = {...parentItem, containing: [ itemKey ]}
                } else if (parentItem && parentItem.containing) {
                    const containingItemIds: string[] = Object.values(parentItem.containing) || [];
                    itemKey && containingItemIds.push(itemKey);
                    updates[`/items/${parentId}/containing`] = containingItemIds;
                }
                
                databaseRef.update(updates);
            } else {
                itemKey = itemsRef.push().key;

                updates[`/items/${itemKey}`] = updatedItem;
                updates[`/locations`] = [...locationIds, itemKey];
                databaseRef.update(updates);
            }
            return history.push(`/view/${itemKey}`)
        } catch (error) {
            console.error('ERROR in EditForm.jsx, saveItem function', error);
        }
    };

    const deleteImage = (type: string, index: number) => {
        if (type === 'image') {
            const updatedUrls = [...imageUrls];
            updatedUrls.splice(index, 1);
            setImageURLs(updatedUrls);
        } else {
            const updatedUrls = [...fileUrls];
            updatedUrls.splice(index, 1);
            setFileURLs(updatedUrls);
        }
    }

    return (
        <>
            <h3>Add Location</h3>
            <form onSubmit={saveItem}>
                <TextField
                    style={{ width: "100%" }}
                    id="outlined-basic"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Add Location"
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
                    <IconButton color="primary" aria-label="upload picture" component="span">
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
            {imageUrls && imageUrls[0] && (
                <>
                    <img src={imageUrls[0]} alt="" className="preview-image" />
                    <IconButton aria-label="delete" onClick={e => deleteImage('image', 0)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </>
            )}
            {imageUrls && imageUrls[1] && (
                <>
                    <img src={imageUrls[1]} alt="" className="preview-image" />
                    <IconButton aria-label="delete" onClick={e => deleteImage('image', 1)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </>
            )}
            {imageUrls && imageUrls[2] && (
                <>
                    <img src={imageUrls[2]} alt="" className="preview-image" />
                    <IconButton aria-label="delete" onClick={e => deleteImage('image', 2)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </>
            )}
            <Divider />
        </>
    );
}
export default EditForm;