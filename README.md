#Topcoder Online Review GitHub Import Script.

## Configuration
###Edit configuration in `.env` file to set the configuration values.
- SVN_USER -> The SVN user to access the SVN repository
- SVN_PASS -> The SVN password to access the SVN repository
- REPO_PREFIX -> The prefix that GitHub repositories will have after importing from SVN
- FILE_PATH -> The path to the XML file containing the SVN components (usually components.xml)
- GIT_API_URL -> The github API url (e.g. https://api.github.com)
- GIT_API_TOKEN -> The github API token (you can create one [here](https://github.com/settings/tokens))
- GIT_OWNER -> the GitHub owner (either user or organization)
- GIT_ISORGANIZATION -> (true if the owner is an organization, false if it's a normal user)

## Running the script
- Install dependencies `npm i`
- Start script using `npm start` or `node app.js`
- To show the current status of the imported repositories, start the script using `npm start showStatus`