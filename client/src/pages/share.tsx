import '../calender.css'
import { fetchProfile, CalenAddEvent, CalenGetEvent, delEvent, checkVisited, getGroupEvent } from "@/lib/api.ts";
import { toast } from "sonner";
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react'

export default function Share({ user, setUser }: { user: any; setUser: (u: any) => void; }) {
    const { lnk } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState<any>(null);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [isValid, setIsValid] = useState(false)
    const [event_list, setEvent_list] = useState([]);
    const [st, setSt] = useState(true);
    const [Dst, setDSt] = useState(true);
    const [isBoxshow, setisBoxshow] = useState(true);
    const [isSecondDate, setIsSecondDate] = useState(false);
    const MAXIMUM_EVENT_CARD = 8;
    useEffect(() => {
        (async () => {
            if (isValid) return
            const res = await checkVisited(String(lnk))
            if (!res.ok) {
                toast.error('connection faild')
                navigate('/profile')
                return
            }
            const data = await res.json()
            if (!data.success) {
                toast.error('invalid link')
                navigate('/profile')
                return
            }
            setIsValid(true)
            console.log('link success')
            const resE = await getGroupEvent(String(lnk))
            if (!resE) return
            const dataE = await resE.json()
            setEvent_list(dataE)
            // console.log(dataE)
        })();
    }, [lnk])

    useEffect(() => {
        if (!user && !isLoggedOut) {
            toast.error("Please sign in first");
            navigate("/login");
            return;
        }

        (async () => {
            const res = await fetchProfile();
            if (res?.success) {
                setProfile(res.user);
            }
            else navigate("/login");
        })();
        console.log("hello")
    }, [user, navigate]);
    useEffect(() => {
        (async () => {
            if (st) {
                const getE = await getGroupEvent(String(lnk));
                const da = await getE.json()
                setEvent_list(da);
                setSt(false)
                console.log(getE);
                updateEvent(da);
            }
        })();
    }, [st])
    function createBox(event: MouseEvent, date: String) {


        const parentBox = document.getElementById('event_box')
        const cancel_butt = document.getElementById("cancel")
        const add_butt = document.getElementById('add')
        const checkBox = document.getElementById('ckbox')
        const dateEnd = document.getElementById('date-end')
        const startDateE = document.getElementById('st')
        const endDateE = document.getElementById('ed')
        const eventN = document.getElementById('txinp')

        if (isSecondDate) {
            endDateE!.innerText = date;
        }
        if (!isBoxshow) return
        setDSt(false)
        const X = event.pageX;
        const Y = event.pageY;

        parentBox!.style.display = "flex";
        const screenWidth = window.innerWidth;
        const screenHeigh = window.innerHeight;
        // console.log(screenWidth)
        if (screenWidth < 600) {
            parentBox!.style.top = "90vh";
            parentBox!.style.left = "auto";
        } else {
            if (screenWidth - X < 250) {
                parentBox!.style.left = `${X - 300}px`;
            } else {
                parentBox!.style.left = `${X}px`;
            }
            if (screenHeigh - Y < 250) {
                parentBox!.style.top = `${Y - 200}px`;
            } else {
                parentBox!.style.top = `${Y}px`;
            }
        }
        startDateE!.innerText = date;
        checkBox!.onchange = (event) => {
            if (event.target.checked) {
                dateEnd!.style.display = "block";
                setIsSecondDate(true);
                return;
            }
            // tmpEnd = "";
            endDateE!.innerText = "select end"
            dateEnd!.style.display = "none"

            setIsSecondDate(false);

        }
        cancel_butt!.onclick = () => {
            setisBoxshow(true)
            setSt(true)
            parentBox!.style.display = "none";
            setDSt(true)
        }
        add_butt!.onclick = async () => {
            const eventName = eventN!.value;
            const eventStart = startDateE!.textContent;
            const eventEnd = endDateE!.textContent
            if (eventName == "") {
                toast.message("fill event name")
                return
            }
            const addRes = await CalenAddEvent(eventName, eventStart, eventEnd);
            if (!addRes.ok) {
                //toast.error("connect fail!!")
                return
            }
            const resData = await addRes.json()
            if (resData.success) {

                toast.message(resData.message);
            }
            toast.error(resData.error)
            parentBox!.style.display = "none";
            setisBoxshow(true)
            setSt(true)
            setDSt(true)
        }
        setisBoxshow(false)

    }

    function hadleClickEvent(e) {
        const title = e.event.title
        const date1 = e.event.start
        date1.setDate(date1.getDate() + 1);
        const date = date1.toISOString().split('T')[0]
        if (!Dst) return
        const box = document.getElementById('deleteBox')
        const buttD = document.getElementById('delE')
        const buttC = document.getElementById('delC')
        const content = document.getElementById('deti')
        if (!box) return
        if (!buttD) return
        if (!buttC) return
        if (!content) return
        box.style.display = "flex"
        const X = e.jsEvent.pageX;
        const Y = e.jsEvent.pageY;
        box!.style.left = `${X}px`;
        box!.style.top = `${Y}px`;
        content!.innerText = e.event.title
        setDSt(false)
        setisBoxshow(false)
        buttC.onclick = () => {
            box!.style.display = "none"
            setDSt(true)
            setisBoxshow(true)
        }
        buttD.onclick = async () => {
            const res = await delEvent(title, date)
            if (!res.ok) {
                toast.error('connection faild')
                return
            }
            const data = await res.json()
            if (!data.success) {
                toast.error('delete faild')
                return
            }
            toast.message('delete successfully')
            box!.style.display = "none"
            setDSt(true)
            setisBoxshow(true)
            setSt(true)
        }
    }
    function updateEvent(events : Array<Object>){
        const event_container = document.querySelector('#event_list_container')
        let total = 0;
        if(!event_container)
            return;
        event_container.innerHTML = "";

        const current_time = new Date();
        const upcoming = document.createElement('h1');
        upcoming.innerHTML = `Upcoming:`;
        event_container.appendChild(upcoming);

        const ended_events = [];
        const upcoming_events = [];

        for(const event of events){
            const string_event = JSON.stringify(event);
            const event_detail = JSON.parse(string_event);
            if('end' in event_detail)
                event_detail.date = event_detail.start;
            else
                event_detail.end = event_detail.date;
            if(current_time <= new Date(event_detail.end))
                upcoming_events.push(event_detail);
            else    
                ended_events.push(event_detail);
        }

        upcoming_events.sort((a, b) => new Date(a.date) - new Date(b.date) === 0 
                                    ? new Date(a.end) - new Date(b.end) 
                                    : new Date(a.date) - new Date(b.date))

        for(const event of upcoming_events){
            const current_card = createEvent(event);
            current_card.classList.add('upcoming')
            event_container.appendChild(current_card);
            if(++total >= MAXIMUM_EVENT_CARD){
                return;
            }
        }
        
        if(!ended_events || ++total >= MAXIMUM_EVENT_CARD)
            return;

        ended_events.sort((a, b) => new Date(b.date) - new Date(a.date) === 0 
                                    ? new Date(b.end) - new Date(a.end) 
                                    : new Date(b.date) - new Date(a.date))

        const ended = document.createElement('h1');
        ended.innerHTML = `Ended :`;
        event_container.appendChild(ended);

        for(const event of ended_events){
            if(++total > MAXIMUM_EVENT_CARD){
                return;
            }
            const current_card = createEvent(event)
            current_card.classList.add('ended')
            event_container.appendChild(current_card);
        }
            
    }

    function createEvent(event : Object){
        const current_card = document.createElement('p');
        current_card.classList.add('event_card');
        const header = document.createElement('h2');
        header.innerHTML = event.title;
        current_card.appendChild(header);
        const detail = document.createElement('div');
        detail.classList.add('event_detail')
        if('start' in event){
            detail.innerHTML += `From: ${event.start} to ${event.end}`
        }
        else{
            detail.innerHTML = `${event.date}`
        }
        current_card.appendChild(detail)
        return current_card;
    }
    return (
        <>
            <div id="calendar_container">
                <div className="event_header">
                    Events
                </div>
                <div id="event_list_container"></div>
                <FullCalendar
                    plugins={[interactionPlugin, dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    height={"80vh"}
                    eventColor={"#ff2e1bff"}
                    selectable={true}
                    eventOverlap={false}
                    displayEventTime={true}
                    events={event_list}
                    dateClick={async (info) => {
                        createBox(info.jsEvent, info.dateStr)
                        const getE = await CalenGetEvent();
                        // console.log(getE)
                        setEvent_list(getE)
                        setSt(true)
                    }}
                    eventClick={hadleClickEvent}
                />

                <div id="event_box">
                    <div id="date-container">
                        <div id="date-start">
                            <p>start</p>
                            <p id="st"></p>
                        </div>
                        <div id="date-end">
                            <p>end</p>
                            <p id="ed">select end</p>
                        </div>
                    </div>
                    <div id="input-container">
                        <div id="ckbox-container">
                            Continuous Event :
                            <input type='checkbox' id="ckbox"></input>
                        </div>

                        <input type='text' id="txinp" placeholder='Event name'></input>
                    </div>
                    <div id="butt-container">
                        <button className='butt' id="add">Add</button>
                        <button className='butt' id="cancel">Cancel</button>
                    </div>
                </div>
                <div id="deleteBox">
                    <p id="deti"></p>
                    <button id="delE">Delete</button>
                    <button id="delC">cancel</button>
                </div>
                <div id="link-con">
                    <p id="lnk"></p>
                    <button id="invbutt" onClick={async()=>{
                        const res = await createShareLink()
                        if(!res.ok) return
                        const data = await res.json()
                        const BASE_URL = window.location.origin
                        document.getElementById('lnk')!.innerText = `${BASE_URL}/share/${data.link}`
                    }}> create Invite</button>
                </div>
            </div>
                            
        </>
    )
}