import { sucrose } from "elysia/dist/sucrose";
import mysql from "mysql2/promise";
import { nanoid } from 'nanoid'
const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "student_planner",
    port: 3306,
});

//Insert to Mysql DB
export async function SqlAddEvent(id: string, eventName: string, date: string, end: string) {
    const sql = "INSERT INTO events (userId,eventName,date,end) VALUES (?,?,?,?)"
    const sql_c = "SELECT userId From events WHERE userId = ? AND eventName = ? AND date = ?"
    const [rows_k] = await connection.execute(sql_c, [id, eventName, date])
    // console.log(rows_k.length)
    if (rows_k.length >= 1) return { error: "date already exits", success: false }
    const [rows] = await connection.execute(sql, [id, eventName, date, end])
    if (rows.affectedRows === 1) return { message: "add event successfully", success: true }
}
//Get from Mysql DB
export async function SqlGetEvent(id: string) {
    const sql = "SELECT eventName,date,end From events WHERE userId = ?;"
    try {
        const [row] = await connection.execute(sql, [id])
        let event_json = {};
        let event_json_e = {};
        let event_array = [];

        for (let d in row) {
            if (row[d].end !== 'select end') {
                event_json_e = { id: row[d].eventName + row[d].date, title: row[d].eventName, start: row[d].date, end: row[d].end };
                event_array.push(event_json_e);
            } else {
                event_json = { id: row[d].eventName + row[d].date, title: row[d].eventName, date: row[d].date }
                event_array.push(event_json)
            }


        } return event_array
        //console.log(event_array)

    } catch (error) {
        return error
    }

}
export async function SqlDelEvent(id: string, title: string, date: string) {
    const sql = "DELETE FROM events WHERE userId = ? AND eventName = ? AND date = ?"
    try {
        const [row] = await connection.execute(sql, [id, title, date])
        console.log(row)
        console.log(`${id} ${title} ${date}`)
        if (row.affectedRows == 1) {
            return { success: true, message: 'delete success' }
        }
        return { success: false, error: 'delete faild' }
    } catch (error) {
        console.log(error)
        return error
    }
}
export async function checkVisited(lnk: string, visiterId: string) {
    const sql = "SELECT * FROM inviteLinks WHERE shareLink = ?"
    const sql1 = "SELECT * FROM linkOther WHERE shareLink = ? AND userId = ?"
    const sql2 = "INSERT INTO linkOther(shareLink,userId) VALUES(?,?)"
    try {
        const [row] = await connection.execute(sql, [lnk])
        if (row.length == 1) {
            const [row1] = await connection.execute(sql1, [lnk, visiterId])
            if (row1.length == 1) {
                console.log("alrady")
                return { success: true, message: "user alrady visited" }
            }
            const [row2] = await connection.execute(sql2, [lnk, visiterId])
            if (row2.affectedRows == 1) {
                console.log("add visitor")
                return { success: true, message: "add visitor" }
            }
        }
        console.log("invalid Link")
        return { success: false, error: "invalid Link" }
    } catch (error) {
        console.log(error)
        return error
    }
}
export async function createLink(userId: string) {
    const sql = "SELECT * FROM inviteLinks WHERE userId = ?"
    const sql1 = "INSERT INTO inviteLinks(userId,shareLink) VALUES(?,?)"
    const sql2 = "INSERT INTO linkOther(userId,shareLink) VALUES(?,?)"
    try {
        const [row] = await connection.execute(sql, [userId])
        if (row.length == 1) {
            return { success: true, link: row[0].shareLink, message: "link already have" }
        }
        const token = nanoid(16)
        const [row1] = await connection.execute(sql1, [userId, token])
        const [row2] = await connection.execute(sql2, [userId, token])
        if (row1.affectedRows == 1 && row1.affectedRows == 1) {
            return { success: true, link: token, message: "link already have" }
        }
        return { success: false }
    } catch (error) {
        console.log(error)
        return error
    }

}
export async function getGroupEvent(lnk: string) {
    const sql = "SELECT * FROM events as e JOIN (SELECT userId FROM linkOther WHERE shareLink = ?)as b ON e.userId = b.userId"
    let event_json = {};
    let event_json_e = {};
    let event_array = [];
    try {
        const [row] = await connection.execute(sql, [lnk])
        row.forEach(element => {
            if (element.end !== 'select end') {
                event_json_e = { id: element.eventName + element.date, title: element.eventName, start: element.date, end: element.end };
                event_array.push(event_json_e);
            } else {
                event_json = { id: element.eventName + element.date, title: element.eventName, date: element.date }
                event_array.push(event_json)
            }
        });
        return event_array
    } catch (error) {
        console.log(error)
        return error
    }

}