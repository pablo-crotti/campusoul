# Campusoul API

## About
Campusoul is an API developed as part of the ArchiOWeb course at HEIG-VD, specifically for the Media Engineering program. This API aims to provide a social networking platform for students, facilitating enriching social interactions within the campus.

## Members
- Bourgeois Kevin
- Crotti Pablo
- Masungi Glory
- Meuwly Nicolas

## Features
The Campusoul API offers several key features, including:
- **User Management**: Registration, login, profile updates, and account deletion.
- **Interests Management**: Allows users to add, view, and delete their interests.
- **Matching System**: Users can "like" other profiles and view their list of matches.
- **Messaging**: Sending and receiving messages between matched users.

## How to Use
To use the Campusoul API, follow these steps:

1. **Installation**:
   - Clone the repository: `git clone https://github.com/WinnieTheBloue/campusoul.git`
   - Install dependencies: `npm install`

2. **Configuration**:
   - Configure your database and other environment variables in the `config/` directory.

3. **Starting the API**:
   - Launch the API with `npm start` or `node bin/start.js`.

4. **Usage**:
   - Use an API client like Postman or cURL requests to interact with the API.
   - The available routes are defined in files under the `routes/` directory.

## API Documentation
Complete API documentation is available in the `openapi.yml` file. This file describes all the routes, methods, and expected responses of the API. Additionally, once the services are launched, the documentation can also be accessed via this URL : [localhost:3000/api-docs](http://localhost:3000/api-docs), providing a convenient way to view and interact with the API's endpoints.

## Tests
Unit and integration tests are available in the `spec/` directory. You can run them with `npm test` to ensure the quality and reliability of the API.

## Contributing
Contributions to the project are welcome. If you wish to contribute, please fork the repository, create a branch for your changes, and submit a pull request.

## License
This project is licensed under the MIT License.
