import mysql from "mysql2/promise";
const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Student_planner",
    port: 3306,
});

//Insert to Mysql DB
export async function SqlAddEvent(id: string, eventName: string, date: string) {
    const sql = "INSERT INTO events (id,eventName,date) VALUES (?,?,?)"
    const sql_c = "SELECT id From events WHERE id = ? AND eventName = ? AND date = ?"
    const [rows_k] = await connection.execute(sql_c, [id, eventName, date])
    // console.log(rows_k.length)
    if (rows_k.length >= 1) return { error: "date already exits", success: false }
    const [rows] = await connection.execute(sql, [id, eventName, date])
    if (rows.affectedRows === 1) return { message: "add event successfully", success: true }
}
//Get from Mysql DB
export async function SqlGetEvent(id: string) {
    const sql = "SELECT eventName,date From events WHERE id = ?;"
    try {
        const [row] = await connection.execute(sql, [id])
        let event_json = {}
        let event_array = []

        for (let d in row) {
            // console.log(d)
            event_json = { title: row[d].eventName, date: row[d].date }
            event_array.push(event_json)

        }
        // console.log(event_array)
        return event_array
    } catch (error) {
        return error
    }

}