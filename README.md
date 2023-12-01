# 🎓 Campusoul API

## ℹ️ About
Campusoul is an API developed as part of the ArchiOWeb course at HEIG-VD, specifically for the Media Engineering program. This API aims to provide a social networking platform for students, facilitating enriching social interactions within the campus.

## 👥 Members
- Bourgeois Kevin
- Crotti Pablo
- Masungi Glory
- Meuwly Nicolas

## 🚀 Features
The Campusoul API offers several key features, including:
- **User Management**: Registration, login, profile updates, and account deletion.
- **Interests Management**: Allows users to add, view, and delete their interests.
- **Matching System**: Users can "like" other profiles and view their list of matches.
- **Messaging**: Sending and receiving messages between matched users.

## 📝 How to use
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

## ⚙️ Environment Setup

To run this project, you need to set up the environment variables. Follow these steps to configure them:

1. **Copy the example file**: Start by creating a copy of the `.env.example` file. You can do this by running:
   `cp .env.example .env`
   This command creates a new file named `.env` with the same contents as `.env.example`.

2. **Edit the `.env` file**: Open the `.env` file in your preferred text editor. You'll see various placeholders for configuration values. Replace these placeholders with your actual configuration values. For example:
   - **your_username**: Your MongoDB username.
   - **your_password**: Your MongoDB password.
   - **your_cluster_url**: Your MongoDB cluster URL.
   - **your_database_name**: The name of your MongoDB database.
   - **your_jwt_secret**: A secret key for JWT.
   - **your_jwt_expiration**: Expiration time for JWT.
   - **your_aws_access_key_id**: Your AWS Access Key ID.
   - **your_aws_secret_access_key**: Your AWS Secret Access Key.
   - **your_aws_default_region**: Your default AWS region.
   - **your_aws_bucket_name**: The name of your AWS bucket.
3. **Save the `.env` file**: After replacing all the placeholders with your actual values, save the file.
4. **Restart the server**: If your server was running, restart it to apply the new environment variables.

**Remember not to commit the `.env` file to your version control system. It contains sensitive information specific to your environment.**

## 📚 API documentation
Complete API documentation is available in the `openapi.yml` file. This file describes all the routes, methods, and expected responses of the API. Additionally, once the services are launched, the documentation can also be accessed via this URL : [localhost:3000/api-docs](http://localhost:3000/api-docs), providing a convenient way to view and interact with the API's endpoints. 

Production documentation URL : [campusoul-hrim.onrender.com/api-docs/](https://campusoul-hrim.onrender.com/api-docs/).

## 🧪 Tests
Unit and integration tests are available in the `spec/` directory.

## Contributing
Contributions to the project are welcome. If you wish to contribute, please fork the repository, create a branch for your changes, and submit a pull request.

## License
This project is licensed under the MIT License.
