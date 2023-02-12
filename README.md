## Project

Project for the course "Programmazione Web" - UniTS.

The project has already been compiled inside of the /project/public/dist folder. There is no need to compile it again.
The server is already coded to send the index.html file inside of /project/public/dist.

You can run the project by simply calling npm start inside of the /project/server folder or by setting up the Docker container.

### Database initialization

The database has an automatic initialization that can be turned off by changing the value "DEFAULT_DATABASE" in the .env file to 0.

This is how it gets initialized:
- 4 users get created: mario_rossi, luigi_verdi, leonardo_di_caprio and albert_einstein. Everyone has the password "password".
- 2 messages, one from mario_rossi and one from albert_einstein, get created.
- mario_rossi follows luigi_verdi and albert_einstein, luigi_verdi follows mario_rossi and leonardo_di_caprio.
- mario_rossi likes his own message, luigi_verdi likes mario_rossi's message, leonardo_di_caprio likes albert_einstein's post.

### Docker Container

The Docker container can be created using the docker-compose after defining the volume for the MongoDB database:

`docker volume create --name=mongo_data`

This is required in order to avoid data wipes on every container restart.
Source: https://stackoverflow.com/questions/71409920/docker-wipes-out-mongodb-container-data
