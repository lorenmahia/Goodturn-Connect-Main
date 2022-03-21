const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');
const fetch = require('cross-fetch');


require('dotenv').config();

const api_key = process.env.STREAM_APP_KEY;
const api_secret = process.env.STREAM_APP_SECRET;
const app_id = process.env.STREAM_APP_ID;




const signup = async (req, res) => {
    try {

        //REFRESHING SERVER AFTER EVERY SIGNUP/LOG IN 
        const fetchData = async () => {
            try{
                const response = await fetch("https://goodturn.bubbleapps.io/version-test/api/1.1/obj/User",{
                    method: "GET",
                    mode: 'cors',
                    headers: {
                      "Access-Control-Allow-Origin" : "https://goodturn.bubbleapps.io/version-test/api/1.1/obj/User",
                      'Content-Type': 'application/json'
                    },
                    })
                  const data = await response.json()
                  existinguser = data.response.results;
                  const div = existinguser.length / 100;
                  const mod = existinguser.length % 100;
                  //NUMBER OF TIMES TO RUN API CALL IS DIV 
                  //ADD AN EXTRA MOD NUMBER OF USERS 
                  //ONLY UPSERT 100 USERS PER CALL
                  if (existinguser.length <= 100) {
                    for (let index = 0; index < existinguser.length; index++) {
                        const updateResponse = await chatClient.upsertUsers([
                            {id : existinguser[index]._id, role : 'user'}
                        ])
                    }
                  }
                
            } catch(err){
                console.log(err);
            }
           
          }
         fetchData();
        
         //Fetching Jobs from Goodturn API and Creating Channels for Job Owner + Workers 
         const fetchJobs = async() => {
             try {
                const response = await fetch("https://goodturn.bubbleapps.io/version-test/api/1.1/obj/Jobs",{
                    method: "GET",
                    mode: 'cors',
                    headers: {
                      "Access-Control-Allow-Origin" : "https://goodturn.bubbleapps.io/version-test/api/1.1/obj/Jobs",
                      'Content-Type': 'application/json'
                    },
                    })
                  const data = await response.json()
                  jobs = data.response.results;
                  
        
                  for (let index = 0; index < jobs.length; index++) {
                    //Creating an empty  list of all workers for every loop 
                    //all jobs for this particular work
                    for (let j = 0; j < jobs[index].workers.length; j++) {
                       //Create Channel for this particular job 
                    const channel = chatClient.channel('team', jobs[index]._id, { 
                      //TODO : will add another loop for more team members
                      created_by_id : jobs[index].job_owner,
                      name : jobs[index].job_title,
                      members : [jobs[index].job_owner, jobs[index].workers[j]]
                  }); 
                  await channel.create();  
                    }
                  }
                 
             } catch (error) {
                 console.log(error)
             }
         }
        fetchJobs();

        //END OF REFRESH 





        //get form data
        const { fullName, username, password, email, jobsId } = req.body;

        //assign user id using crpto 
        const userId = jobsId;
        //create serverClient which is goodturn 
        const serverClient = connect(api_key, api_secret, app_id);
        //hass created password
        const hashedPassword = await bcrypt.hash(password, 10);
//REGULATORY TEST 
//TO ENSURE ONLY USERS WITH GOODTURN JOBS ID CAN LOG IN AND CREATE USER NAMES
         //Check user trying to log in against Goodturn Jobs ID database
         const client = StreamChat.getInstance(api_key, api_secret);
         const { users } = await client.queryUsers({ id: userId });
         if (!users.length) {
             alert("Please Sign in to Goodturn Jobs to get your Account ID")
             return res.status(400).json({ message: 'User not found' });
         }  
            //generate token 
        const token = serverClient.createUserToken(userId);
             //return info to client-side
        res.status(200).json({ token, fullName, username, userId, hashedPassword, email });
 //END OF REGULATORY TEST       
    } catch (error) {
        console.log(error);
        console.log('key is :' + api_key);

        res.status(500).json({ message: error });
    }
};

const login = async (req, res) => {
    try {

        //UPSERT JOBS EVERY LOG IN 

         
         //Fetching Jobs from Goodturn API and Creating Channels for Job Owner + Workers 
         const fetchJobs = async() => {
            try {
               const response = await fetch("https://goodturn.bubbleapps.io/version-test/api/1.1/obj/Jobs",{
                   method: "GET",
                   mode: 'cors',
                   headers: {
                     "Access-Control-Allow-Origin" : "https://goodturn.bubbleapps.io/version-test/api/1.1/obj/Jobs",
                     'Content-Type': 'application/json'
                   },
                   })
                 const data = await response.json()
                 jobs = data.response.results;
                 
       
                 for (let index = 0; index < jobs.length; index++) {
                   //Creating an empty  list of all workers for every loop 
                   //all jobs for this particular work
                   for (let j = 0; j < jobs[index].workers.length; j++) {
                      //Create Channel for this particular job 
                   const channel = chatClient.channel('team', jobs[index]._id, { 
                     //TODO : will add another loop for more team members
                     created_by_id : jobs[index].job_owner,
                     name : jobs[index].job_title,
                     members : [jobs[index].job_owner, jobs[index].workers[j]]
                 }); 
                 await channel.create();  
                   }
                 }
                
            } catch (error) {
                console.log(error)
            }
        }
       fetchJobs();
    //END UPSERT OF JOBS 






        const { username, password } = req.body;
        
        //sign ourselves into stream 
        const serverClient = connect(api_key, api_secret, app_id);
        const client = StreamChat.getInstance(api_key, api_secret);

       
        //Check user trying to log in against database
        const { users } = await client.queryUsers({ name: username });
        
        //If no users return JSON message user not found 
        if(!users.length){
            alert("User not found. Please type in the correct username");
             return res.status(400).json({ message: 'User not found' });}

        //success variable is set to true if password match to user
        const success = await bcrypt.compare(password, users[0].hashedPassword);

        //gnerate token for user 
        const token = serverClient.createUserToken(users[0].id);

        if(success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
        } else {
            alert("Incorrect Password, You can Sign Up using your Account ID to reset the password ");
            res.status(500).json({ message: 'Incorrect password' });
        }
    } catch (error) {ads
        console.log(error);

        res.status(500).json({ message: error });
    }
};

module.exports = { signup, login }