import '../calender.css'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { useEffect, useState } from 'react'

export default function Calendar() {

    const [isBoxshow, setisBoxshow] = useState(true);
    const [select_day, setselect_day] = useState("");

    const calendar_div = document.getElementById("calendar_container")
    const box = document.createElement('div')
    const input_event = document.createElement('input')
    const cancel_butt = document.createElement('button')
    const add_butt = document.createElement('button')
    const but_contain = document.createElement('div')

    useEffect(() => {
        const b = document.getElementById('cancel-but')
        const c = document.getElementById('add-event-box')
        if (!c) return
        if (!b) return
        b.addEventListener('click', () => {
            c.remove()
            console.log(isBoxshow)
            setisBoxshow(true)
        })
    }, [isBoxshow]);

    // useEffect(() => {
    //     if (!div_cn) return
    //     if (!reg) return
    //     const handle = (event: MouseEvent) => {

    //         if (!isBoxshow) {
    //             // reg.remove()
    //             return
    //         }
    //         const clientX = event.clientX; // X-coordinate relative to the viewport
    //         const clientY = event.clientY; // Y-coordinate relative to the viewport

    //         reg.id = 'add-event-box'
    //         cancel_butt.id = 'cancel-but'
    //         cancel_butt.innerText = "cancel"
    //         reg.style.left = `${clientX}px`
    //         reg.style.top = `${clientY}px`


    //         reg.appendChild(in_name)
    //         reg.appendChild(cancel_butt)
    //         div_cn.appendChild(reg)

    //         setisBoxshow(false)
    //     }
    //     div_cn.addEventListener('click', handle);

    //     return () => {
    //         div_cn.removeEventListener("click", handle);
    //     };

    // }, [isBoxshow, select_day])

    // if (!div_cn) return
    // const handle = (event: MouseEvent) => {

    //     if (!isBoxshow) {
    //         // reg.remove()
    //         return
    //     }
    //     const clientX = event.clientX; // X-coordinate relative to the viewport
    //     const clientY = event.clientY; // Y-coordinate relative to the viewport

    //     reg.id = 'add-event-box'
    //     cancel_butt.id = 'cancel-but'
    //     cancel_butt.innerText = "cancel"
    //     reg.style.left = `${clientX}px`
    //     reg.style.top = `${clientY}px`


    //     reg.appendChild(in_name)
    //     reg.appendChild(cancel_butt)
    //     div_cn.appendChild(reg)

    //     setisBoxshow(false)
    // }
    // div_cn.addEventListener('click', handle)
    // function createAddEvent(date: String) {
    //     const div_cn = document.getElementById("calendar_container")
    //     const reg = document.createElement('div')
    //     const in_name = document.createElement('input')
    //     const cancel_butt = document.createElement('button')
    //     if(!isBoxshow) return
    //     document.getElementById("add-event-box")!.innerText = date
    // }

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
        setselect_day(date)

        if (!box) return
        box.id = 'add-event-box'
        box.style.left = `${X}px`
        box.style.top = `${Y}px`
        box.innerText = date

        if (!input_event) return
        input_event.id = 'inp'
        input_event.placeholder = "event"

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
                    eventColor={"#ffb31bff"}
                    selectable={true}
                    eventOverlap={false}
                    displayEventTime={true}
                    //events={event_list}
                    dateClick={(info) => {
                        createBox(info.jsEvent, info.dateStr)
                    }}
                />
            </div>
        </>
    )
}