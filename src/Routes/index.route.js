import express from "express";
import connection from "../db/connectDB.js";
import authGuard from "../middleware/auth.middleware.js";
import { createToken, hashCompare, hashValue } from "../utils/auth.js";

const route = express.Router()

route.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;


    const query = "select * from user where email = ?"
    connection.query(query,email,async (error, result) => {
      if (error) {
        return res.status(400).send({Error: error})
      }

      
      const user = await result[0]
      if (await hashCompare(password,user.password)) {
        user.password = null
        const token =await createToken(user)
        return res.status(200).send({user,token})
      }
      return res.status(400).send({Error:"invalid password"})
    })
  } catch (error) {
    res.status(500).send({Error:"Internal server error"})
  }


 
})

route.post("/", async(req, res) => {
  const { fullName, email, dob, password } = req.body;

  const existEmail = "select * from user where email = ?"
  connection.query(existEmail, async(error, result) => {
    if (error) {
      const hashPassword =await hashValue(password)
      console.log(hashPassword)
      const query = "insert into user (fullName,email,dob,password) values (?,?,?,?)"
      connection.query(query, [fullName, email, dob, hashPassword], (error, result) => {
        if (error) {
          console.log("error fetching users")
          return res.status(400).send({error: error})
        }
        return res.status(200).send({result})
      })
      return
    }
    return res.status(400).send({Error:"email already exist"})
    
  })

  
})


export default route