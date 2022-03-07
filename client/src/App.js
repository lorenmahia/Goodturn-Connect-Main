import logo from './logo.svg';
import './App.css';
import { StreamChat } from 'stream-chat';
import {Chat} from 'stream-chat-react';
import Cookies, {Cookie} from 'universal-cookie';
import React, {useState} from 'react';
import 'stream-chat-react/dist/css/index.css';
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
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!authtoken) 
  return <Auth/>

  return (
    <div className="app__wrapper">
      <Chat client = {client} theme = "team light">
        <ChannelListContainer
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
        />
        <ChannelContainer
          isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    createType={createType}
        />
      </Chat>
    </div>
  );
}

export default App;
