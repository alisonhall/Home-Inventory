# Home Inventory

Created by [Alison K. Hall](https://alisonkhall.com)

Alison's personal version of this site: <https://sphericalweb.com>

Development script: `npm start` or `netlify dev`

---

## Overview

This project is meant to be forked/duplicated and then set up to be used as a personal home inventory.

### Features

- Is a purely web-based application, which allows it to be used on almost any device which has a connection to the internet
- Have multiple locations (houses, apartments, storage units, other people, etc.)
- Can nest items within other items, with no limitation as to the nesting depth
- Can save multiple images for each item
- Can move items from being within one item to be within a different item instead
- Is a Progressive Web Application (PWA), which means that when accessed from a browser on a mobile device, there is the option to install it on your device in order to run it as if it was a native application

---

## Tech stack

- React (bootstrapped with [Create React App](https://github.com/facebook/create-react-app))
- Typescript
- [Firebase](https://firebase.google.com/) (free tier)
- [Netlify](https://www.netlify.com/) (free tier)

---

## Setting up new personal instance of this repository

1. Fork this GitHub repository (<https://github.com/alisonhall/Home-Inventory>) and make sure that it is available on your account at <https://github.com/>.
1. Link your new forked GitHub repository to your account on Netlify at <https://www.netlify.com/> (can be in the Free tier).
    1. For your new site, under the Settings > Build & Deploy > Continuous Deployment section, edit the setting to make sure they have the following properties:
        - Build command: `npm run build`
        - Publish directory: `/build`
1. Setup a new Firebase project (can be in the Free tier) at <https://console.firebase.google.com/>
    1. Create a new 'Web App'
    1. Under the 'Realtime Database' tab:
        - Initialize the 'Realtime Database'
        - Change the 'Rules' to be:

            ```js
            {
                "rules": {
                    ".read": "auth != null",
                    ".write": "auth != null"
                }
            }
            ```

    1. Under the 'Storage' tab
        - Initialize the 'Storage'
        - Change the 'Rules' to be:

            ```js
            rules_version = '1';
            service firebase.storage {
                match /b/{bucket}/o {
                    match /{allPaths=**} {
                    allow read, write: if request.auth != null;
                    }
                }
            }
            ```

    1. Under the 'Authorization' tab
        - Go to the 'Sign-in method' section and enable the 'GitHub' option.
            - Add GitHub authorization callback URL to your personal GitHub app configuration (see more instructions at <https://firebase.google.com/docs/auth/?authuser=0>)
        - Under the 'Sign-in method' section, add the Netlify domain and/or your custom domain to the 'Authorized domains' list
1. Connect Firebase to the project by using the Firebase config keys
    1. Copy the keys shown at the bottom of the page within Firebase's Project Overview > Project Settings section
    1. In the local `.env` file in this project:
        - Uncomment the lines in the `.env` file and fill in the placeholder values.
        - If you don't want to commit these config keys to your repository, then add these keys to Netlify's Environment variables. The values in the `.env` file are still needed for any local development, even if you don't commit those changes.
    1. Netlify Environment variables
        - Click the 'Edit variables' button under the Netlify project's Settings > Build & Deploy > Environment section.
        - Create the environment variables with the same names as the variables within the `.env` file.
        - Note: Local development won't be able to read the Netlify environment variables, so that is the reason why you need to make the changes in the `.env` file too, even if you don't commit those changes.
1. Commit any changes made to the respository and push them up to your GitHub remote repository in order to trigger a build on Netlify. If you don't have any changes, you can manually trigger the build on Netlify.
1. To see the site after the Netlify build is successful, navigate to the Netlify domain (or custom domain linked in Netlify's Custom Domains settings) that is linked with this project.

---

## Future Improvements

- Add tagging support
- Search items
- Link items through a 'Related To' field
- Returning to site after large image view
- Open file view
- Add additional fields
- Allow multiple users, invitation only
- Properly styled Alerts: <https://material-ui.com/components/snackbars/> <https://material-ui.com/components/alert/>
- Unit tests
- Settings view
- Have 'Show JSON Data' be context
- Option to remove unused images from storage
