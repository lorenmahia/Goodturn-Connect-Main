import logo from './logo.svg';
import './App.css';
import { StreamChat } from 'stream-chat';
import {Chat} from 'stream-chat-react';
import Cookies, {Cookie} from 'universal-cookie';

//Components 
import { ChannelContainer, ChannelListContainer, Auth } from './components';

const apikey = 'u48artkmk4qm';
const client = StreamChat.getInstance(apikey);
const cookies = new Cookies();
const authtoken = cookies.get("token");

if(authtoken){
  client.connectUser({
    id: cookies.get('userId'),
    name: cookies.get('username'),
    fullName: cookies.get('fullName'),
    image: cookies.get('avatarURL'),
    hashedPassword: cookies.get('hashedPassword'),
    phoneNumber: cookies.get('phoneNumber'),
}, authtoken)
}

function App() {

  if (!authtoken) 
  return <Auth/>

  return (
    <div className="App">
     
      <Chat client = {client} theme = "team light">
        <ChannelListContainer
        
        />
        <ChannelContainer
        
        />
      </Chat>
    </div>
  );
}

export default App;
