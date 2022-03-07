const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

//to hold environment variables inside Goodturn connect
require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID; 

//using res to send back data to the frontend
const login = async(req,res) => {
    try {
        const { username, password } = req.body; //get username and password from form 
        
        const serverClient = connect(api_key, api_secret, app_id); //connect to stream
        const client = StreamChat.getInstance(api_key, api_secret);//get specific client to compare info

        //query the user with provided username 
        const { users } = await client.queryUsers({ name: username });

        //in case user is not found 
        if(!users.length) return res.status(400).json({ message: 'User not found' });
        
        //defining what a successful log in means  and decrypting the passwords
        const success = await bcrypt.compare(password, users[0].hashedPassword);
        //create token with this users id
        const token = serverClient.createUserToken(users[0].id);

        if(success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
        } else {
            res.status(500).json({ message: 'Incorrect password' });
        }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
};
const signup = async(req,res) => {
  try {
    const { fullName, username, password, phoneNumber } = req.body;

    const userId = crypto.randomBytes(16).toString('hex');
    const serverClient = connect(api_key,api_secret,app_id);

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = serverClient.createUserToken(userId); 

    res.status(200).json({ token, fullName,
        username, userId, hashedPassword, phoneNumber });

      
  } catch (error) {
   
    console.log("My error is" + error);
    res.status(500).json({ message: error });
  }
};

module.exports = {login,signup}
