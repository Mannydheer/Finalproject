import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { requestRegisteredUserEvents, retrieveRegisteredUserEvents, retrieveRegisteredUserEventsError } from '../actions/userActions';

const Chat = () => {
    //pseudocode.
    //most likely, by when joined within an event.
    //a chat button will appear... which will open a modal...
    //since we are on the page.. we have access to the participant ID of that event...
    //we will use this as the rooms for each chat.
    //so ... when clicking on the button, you will now be inside the chat...
    //redirect to chat messaging component..

    const userInfo = useSelector(state => state.userReducer);
    const userRegisteredEvents = useSelector(state => state.userRegisteredReducer)


    //on mount of this chat component...
    //we will get all events that the current user is registered for.

    const dispatch = useDispatch();

    useEffect(() => {

        let userId = userInfo._id;


        const handleUserRegisteredEvents = async () => {
            dispatch(requestRegisteredUserEvents())
            try {
                let response = await fetch(`/userRegisteredEvents/${userId}`);
                let userResponse = await response.json()

                console.log(userResponse)
                if (userResponse.status === 200) {
                    dispatch(retrieveRegisteredUserEvents(
                        userResponse.userRegisteredEvents
                    ))
                }
                else {
                    dispatch(retrieveRegisteredUserEventsError())
                }
            } catch (err) {
                console.log(err)
            }
        }
        handleUserRegisteredEvents()
    }, [])
    //we have the user Id.


    console.log(userRegisteredEvents.registeredEvents)







    //form submit function.

    const handleSubmit = () => {


    }





    return <div>
        {userRegisteredEvents.status !== "retrieved..." ? <div>Seems like you havn't registered for any events!</div> :
            // each of these each represents each chat.
            userRegisteredEvents.registeredEvents.map(event => {
                return <Link to={`/chatJoin/${event}`} key={event}>
                    {event}
                </Link>
            })


        }

    </div>
}

export default Chat;