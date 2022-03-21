const express = require('express');
const cors = require('cors');
const { connect } = require('getstream');
const StreamChat = require('stream-chat').StreamChat;
const fetch = require('cross-fetch');

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const api_key = process.env.STREAM_APP_KEY;
const api_secret = process.env.STREAM_APP_SECRET;
const app_id = process.env.STREAM_APP_ID;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
const serverClient = connect(api_key, api_secret, app_id);
const chatClient = StreamChat.getInstance(api_key,api_secret);

//Creating Users From Goodturn 
//fetch data from Goodturn API
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
 
app.get('/', (req, res) => {
    res.send('Hello, World!');
});



app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));