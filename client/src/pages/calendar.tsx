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
    // const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [isBoxshow, setisBoxshow] = useState(true);
    const [event_list, setEvent_list] = useState([]);
    const [st, setSt] = useState(true);
    const calendar_div = document.getElementById("calendar_container")
    const box = document.createElement('div')
    const input_event = document.createElement('input')
    const cancel_butt = document.createElement('button')
    const add_butt = document.createElement('button')
    const but_contain = document.createElement('div')



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
        if (!isBoxshow) return
        const X = event.pageX
        const Y = event.pageY

        if (!box) return
        box.id = 'add-event-box'
        box.style.left = `${X}px`
        box.style.top = `${Y}px`
        box.innerText = date

        if (!input_event) return
        input_event.id = 'inp'
        input_event.placeholder = "Event name"

        if (!add_butt) return
        add_butt.id = "add-but"
        add_butt.innerText = "add"

        if (!cancel_butt) return
        cancel_butt.id = "cancel-but"
        cancel_butt.innerText = "cancel"

        if (!but_contain) return
        but_contain.style.marginTop = "5px"
        but_contain.style.display = "flex"
        but_contain.style.justifyContent = "space-evenly"
        but_contain.appendChild(add_butt)
        but_contain.appendChild(cancel_butt)

        if (!calendar_div) return
        box.appendChild(input_event)
        box.appendChild(but_contain)
        calendar_div.appendChild(box)


        cancel_butt.onclick = () => {
            const c = document.getElementById('add-event-box')
            if (!c) return
            c.remove()
            setisBoxshow(true)
            setSt(true)
        }
        add_butt.onclick = async () => {
            const i = document.getElementById('add-but')
            const c = document.getElementById('add-event-box')
            const inp = document.getElementById('inp')
            if (!i) return
            if (!inp) return
            if (!c) return
            const addRes = await CalenAddEvent(inp.value, date);
            if (!addRes.ok) {
                //toast.error("connect fail!!")
                return
            }
            const resData = await addRes.json()
            if (resData.success) {

                toast.message(resData.message);
            }
            toast.error(resData.error)
            c.remove()
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
                        setEvent_list(getE)
                        setSt(true)
                    }}
                />
            </div>
        </>
    )
}