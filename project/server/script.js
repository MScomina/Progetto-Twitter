const User = require("./models/users.js");
const Follow = require("./models/follows.js");
const Message = require("./models/messages.js");
const Like = require("./models/likes.js");
const Credential = require("./models/credentials.js");

const userData = [
    {
        "username" : "mario_rossi",
        "name" : "Mario",
        "surname" : "Rossi",
        "description" : "I like taking walks along the beach."
    },
    {
        "username" : "luigi_verdi",
        "name" : "Luigi",
        "surname" : "Verdi",
        "description" : "I like jumping on mushrooms."
    },
    {
        "username" : "leonardo_di_caprio",
        "name" : "Leonardo Wilhelm",
        "surname" : "Di Caprio",
        "description" : "I'm an American actor and film producer, how do you know?"
    },
    {
        "username" : "albert_einstein",
        "name" : "Albert",
        "surname" : "Einstein",
        "description" : "They say i invented physics, but that's an overexaggeration."
    }
];

//All of the users' password is "password".

const messageData = [
    {
        //Username mariorossi.
        "message" : "Today i took a picture of the sea while i was walking along the beach. It was so beautiful.",
        "id" : 0
    },
    {
        //Username alberteinstein.
        "message" : "E = mc^2.",
        "id" : 3
    }
];

const follows = [
    //mariorossi follows luigiverdi.
    [0,1],
    //luigiverdi follows mariorossi.
    [1,0],
    //luigiverdi follows leonardodicaprio.
    [1,2],
    //mariorossi follows alberteinstein.
    [0,3]
]

const likes = [
    //mariorossi likes his own post.
    [0,0],
    //luigirossi likes mariorossi's post.
    [1,0],
    //leonardodicaprio likes alberteinstein's post.
    [2,1]
]

let users = [];
let messages = [];

async function initializeDatabase() {
    const check = await User.findOne({"username": "mario_rossi"});
    if(check !== null) {
        //Database already initialized, exiting.
        console.log("Database already initialized.");
        return;
    }
    console.log("Initializing database with default values...");
    for(let k = 0; k<userData.length; k++) {
        //Saving users.
        const x = userData[k];
        const user = User(x);
        await user.save();
        users.push(user);
        //Saving credentials.
        const credential = Credential({"username" : x.username, "password" : "password"});
        await credential.save();
    }
    for(let k = 0; k<messageData.length; k++) {
        //Saving messages.
        const x = messageData[k];
        const message = Message({"user": users[x.id], "message" : x.message});
        await message.save();
        messages.push(message);
    }
    for(let k = 0; k<follows.length; k++) {
        const x = follows[k];
        //Saving follows.
        const follow = Follow({"follower" : users[x[0]], "following" : users[x[1]]});
        await follow.save();
    }
    for(let k = 0; k<likes.length; k++) {
        //Saving likes.
        const x = likes[k];
        const like = Like({"message" : messages[x[1]], "user" : users[x[0]]});
        await like.save();
    }
    console.log("Finished initializing.");
}

module.exports = {initializeDatabase};