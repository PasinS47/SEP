import '../calender.css'
import { fetchProfile, CalenAddEvent, CalenGetEvent } from "@/lib/api.ts";
import { toast } from "sonner";
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react'

export default function Calendar({ user, setUser }: { user: any; setUser: (u: any) => void; }) {
    const [profile, setProfile] = useState<any>(null);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [isSecondDate, setIsSecondDate] = useState(false);
    // const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [isBoxshow, setisBoxshow] = useState(true);
    const [event_list, setEvent_list] = useState([]);
    const [st, setSt] = useState(true);




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
                if (true) {
                    const getE = await CalenGetEvent();
                    setEvent_list(getE);
                    setSt(false)
                }

            }
            else navigate("/login");
        })();

    }, [st, user, navigate]);
    // const event_list = [
    //     //single
    //     { title: 'event 1', date: '2025-10-15' },
    //     { title: 'event 2', date: '2025-10-16' },
    //     //continuous
    //     { title: 'Conference', start: '2025-10-05', end: '2025-10-10' },
    //     //recursive
    //     //{ title: 'Recursive',startTime: '09:00',endTime: '17:00',daysOfWeek: [1],startRecur: '2025-10-01',endRecur: '2025-12-31'}
    // ]

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
        }
        setisBoxshow(false)

    }
    return (

        <>
            <div id="calendar_container">
                <FullCalendar
                    plugins={[interactionPlugin, dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    height={"auto"}
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
            </div>
        </>
    )
}