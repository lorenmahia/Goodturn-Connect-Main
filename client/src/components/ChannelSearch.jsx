import React, {useState, useEffect} from 'react';
import { ChatContext } from 'stream-chat-react';

import {SearchIcon} from '../assets/SearchIcon';

const ChannelSearch = () => {
    //set the initial values on page load
    const [query, setQuery] = useState('');
    const [loading,setLoading] = useState(false);

    //asynchronous since we have to wait for the channels to be fetched
    const getChannels = async(text) => {
        try {
            //fetch channels
            
        } catch (error) {
            setQuery(''); //reset the search 
        }
    }

    const onSearch = (event) => {
        //event.preventDefault; //so that the browser does not reload the page 
        setLoading(true);
        //what we are searching for when we type into input
        setQuery(event.target.value);

        //find channels being searched for 
        getChannels(event.target.value);
         
    }
    return (
        <div className='channel-search-container'>
            <div className='channel-search__input__wrapper'>
                <div className='channel-search__input__icon'>
                    <SearchIcon/>
                </div>
                <div>
                    <input className='channel-search__input__text'
                            placeholder="Search"
                            type = "text"
                            value={query}
                            onChange={onSearch}/>
                </div>
            </div>
    </div>
    )  
}

export default ChannelSearch