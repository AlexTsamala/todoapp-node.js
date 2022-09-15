import express, {response}  from "express";
import bodyParser from 'body-parser';
import cors from "cors";
import pg from "pg";


const app = express();
app.use(bodyParser.json());
app.use(cors());

const { Pool } = pg ;

const pool = new Pool({
    'user':'postgres',
    'host':'localhost',
    'database':'todoapp',
    'password':'Bayern1860',
    'port':5432
}) 

app.delete("/delete-todo/:id", async (request,response,next)=>{
    const {id} = request.params;
    const client = await pool.connect();
    const result = await client.query({
        text:`DELETE FROM todoapp WHERE id=${+id};`,
    })
    return response.status(200).send("Task was deleted successfully")
 })

 app.delete("/clear-completed", async (request,response,next)=>{
    const client = await pool.connect();
    const result = await client.query({
        text:`DELETE FROM todoapp WHERE status=true;`,
    })
    return response.status(200).send("Task was deleted successfully")
 })

app.get("/", async (request,response,next)=>{
    const client = await pool.connect();
    const result = await client.query({
        text:`SELECT * FROM todoapp;`,
    })
    return response.status(200).send(result.rows)
 })

app.post("/", async (request,response,next)=>{
    const {todoText,status} = request.body;
    const client = await pool.connect();
    const result = await client.query({
        text:`INSERT INTO todoapp
        (todoList,status)
        VALUES ($1, $2);`,
        values:[todoText,status]
    })
    return response.status(200).send("Task added successfully")
})

app.put("/change-status/:id", async (request,response,next)=>{
    const {id} = request.params;
    const {status} = request.body;
    const client = await pool.connect();
    const result = await client.query({
        text:`UPDATE todoapp SET status=${!status} WHERE id=${+id};`,
    })
    return response.status(200).send("status was changed successfully")
 })

app.listen(4001,()=>{
    console.log("started server on 4001 port")
})