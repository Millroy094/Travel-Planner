Welcome to Travel-Planner API!! This API is to help you plan your route from city to city within the UK.
The API gets its data from google maps directions api and the forcast.io and use it all as one and creates a mesh of it.
In this document I will describe the API i.e. what it does and how it does it.
The API itself allows you to store your preferences or favourites where you want to travel from-to and name it.
Anything like adding a new preferences, updating, and deleting an existing preference required basic authenication. 
Viewing an individual preference or a list of preferences does not require user authentication.

- General Guidlines to use the API -

The API consists of two collections Users for all the users registered and preferences to all the preferences being stored
Before you can add preference you should register an user, user is created without basic auth, username and password is passed in the body as JSON data.
To post a new preference, we put the registered username and password in the authorization header and in the body we pass journey i.e. name of the journey, the origin, and the destination.
To update we need to pass the origin and destination in the body, with basic auth of a registered user, and link to contain the preference ID of the preference to be updated.
Delete a preference would require basic auth of a registered user, and link to contain the preference ID of the preference to be deleted.
To see all the list of preferences you dont need authenication header and same goes for accessing a particular preference, all you need to supply is the preference ID

- END -

