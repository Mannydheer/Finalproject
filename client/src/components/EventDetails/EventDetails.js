import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Join from '../Join';
import Leave from '../Leave';
import Cancel from '../Cancel';
import { useLocation } from 'react-router-dom';

//
import Snackbars from '../SnackBar';



const EventDetails = ({ event, canceled, setCanceled }) => {

    const userInfo = useSelector(state => state.userReducer)
    const allEvents = useSelector(state => state.eventReducer)



    //set state for the participants of that current event.
    const [currentEventParticipants, setCurrentEventParticipants] = useState(null)

    let location = useLocation().pathname;

    const [joined, setJoined] = useState(false)



    useEffect(() => {

        const handleCurrentEventParticipants = async () => {
            let token = localStorage.getItem('accesstoken')
            try {
                let response = await fetch(`/currentEventParticipants/${event.participantId}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `${token}`
                    },
                })
                if (response.status === 200) {
                    let participantResponse = await response.json();
                    setCurrentEventParticipants(participantResponse.eventParticipants)
                    participantResponse.eventParticipants.find(participant => {
                        if (participant.userId === userInfo._id) {
                            setJoined(true)
                        }
                    })
                }
            }
            catch (err) {
                console.log(err, 'error occured inside catch for handler user events.')
            }
        }
        handleCurrentEventParticipants();

    }, [joined])


    console.log(event, 'USERHOSTEDEVENTS')


    //function called from render to show all images.
    const getParticipantImages = (currentEventParticipants) => {
        return currentEventParticipants.map(participant => {
            console.log('looking at users')
            return <div>
                <StyledImage key={participant.profileImage} src={participant.profileImage}></StyledImage>
                <div style={{ textAlign: 'center' }}>{participant.name}</div>
            </div>

        })
    }

    return (
        <Wrapper key={event._id}>
            <MainText >

                <h1>Host: {event.name}</h1>
                {/* <StyledImage src={}></StyledImage> */}
                <h2>Sport: {event.sport}</h2>
                <h2>Skill: {event.skill}</h2>
                <h2>Time: {event.readTime}</h2>
                <h2>Date: {event.bookedDate}</h2>
                <h2>Duration: {event.duration} hr</h2>
            </MainText>

            {location !== '/userEvents' ? <JoinLeave>
                {userInfo._id !== event.userId && <Join setJoined={setJoined} joined={joined} event={event} />}
                {userInfo._id !== event.userId && <Leave setJoined={setJoined} joined={joined} event={event} />}
                {userInfo._id === event.userId && <Cancel canceled={canceled} setCanceled={setCanceled} event={event} />}
            </JoinLeave> : userInfo._id === event.userId && <JoinLeave><Cancel canceled={canceled} setCanceled={setCanceled} event={event} /></JoinLeave>}



            {/* IMAGES. */}
            {currentEventParticipants !== null && <Images>
                {getParticipantImages(currentEventParticipants)}
            </Images>}










        </Wrapper >
    )
}


export default EventDetails;
const Wrapper = styled.div`
display: flex;
border: black 3px solid;

`
const JoinLeave = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-content: center;


`
const StyledImage = styled.img`
width: 150px;
height: 150px;
border-radius: 50%;
margin-top: 20px;
`

const Images = styled.div`
display: flex;
justify-content: space-evenly;

`

const MainText = styled.div`
width: 10vw;
h1, h2 {

    width: 300px;

}
`


    // useEffect(() => {
    //     get the host picture.
    //     since this compoenent renders for each event indiivdually. 
    //     we search for the participantId that matches the participant id in the event.
    //     let matchedParticipantsForEvent = participants.find(participant => {
    //         if (participant._id === event.participantId) {
    //             return participant
    //         }
    //     });
    //     if (matchedParticipantsForEvent !== undefined) {

    //         setCurrentEventParticipants(matchedParticipantsForEvent.participants)
    //         //see if the current user matched with any of the participants.
    //         matchedParticipantsForEvent.participants.find(participant => {
    //             if (participant.userId === userInfo._id) {
    //                 setJoined(true)
    //             }

    //         })
    //     }
    //     on change of event.
    // }, [participants])
