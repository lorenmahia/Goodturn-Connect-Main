import React from 'react';
import { ChannelList, userChatContext } from 'stream-chat-react';
import { ChannelSearch, TeamChannelList, TeamChannelPreview} from './';
import Cookies from 'universal-cookie';

import GoodturnLogo from '../assets/GoodturnLogo.png'
import LogoutIcon from '../assets/logout.png'


const Sidebar = () => (
    <div className='channel-list__sidebar'>
        <div className='channel-list__sidebar__icon1'>
            <div className='icon1__inner'>
                <img src={GoodturnLogo} alt="Goodturn Connect" width = "30"/>
            </div>
        </div>
        <div className='channel-list__sidebar__icon2'>
            <div className='icon2__inner'>
                <img src={LogoutIcon} alt="Log out" width = "30"/>
            </div>
        </div>
    </div>
);

const CompanyHeader = () =>(
    <div className='channel-list__header'>
        <p className='channel-list__header__text'> Goodturn Connect</p>
    </div>

);

const ChannelListContainer = ()=>{
    return (
        <>
        <div className='channel-list__flexbox__container'>
        <Sidebar/>
           <div className='channel-list__list__wrapper'>
               <CompanyHeader/>
               <ChannelSearch/>
               <ChannelList
               //allow us to filter messages
                    filters={{}}
                    //fn to pass in filters
                    channelRenderFilterFn={()=> {}}
                    //to render a custom list 
                    List={(listProps)=>(
                        <TeamChannelList
                        {...listProps}
                        type = "team"
                        />
                    )}
                    Preview={(previewProps) =>{
                        <TeamChannelPreview
                        {...previewProps}
                        type = "team"
                        />
                    }}
               />
               <ChannelList
               //allow us to filter messages
                    filters={{}}
                    //fn to pass in filters
                    channelRenderFilterFn={()=> {}}
                    //to render a custom list 
                    List={(listProps)=>(
                        <TeamChannelList
                        {...listProps}
                        type = "messaging"
                        />
                    )}
                    Preview={(previewProps) =>{
                        <TeamChannelPreview
                        {...previewProps}
                        type = "messaging"
                        />
                    }}
               />
           </div>
        </div>
          
        </>
    );
}

export default ChannelListContainer