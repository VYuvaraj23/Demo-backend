import express from "express";
import connection from "../db/connectDB.js";
import authGuard from "../middleware/auth.middleware.js";
import { createToken, hashCompare, hashValue } from "../utils/auth.js";
import { queryAsync, ROLES } from "../constants/common.constants.js";
import adminGuard from "../middleware/admin.middleware.js";

const route = express.Router();

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const selectQuery = "select * from data where email = ?";
    const getData = await queryAsync(selectQuery, [email]);
    if (getData.length === 0) {
      return res.status(400).send({ Error: "invalid Email" });
    }
    const user = await getData[0];
    if (await hashCompare(password, user.password)) {
      user.password = null;
      const token = await createToken(user);
      return res.status(200).send({id:user.id, role: user.role, token });
    }
    return res.status(400).send({ Error: "invalid password" });
  } catch (error) {
    res.status(500).send({ Error: error || "Internal server error" });
  }
});

route.post("/create", authGuard, adminGuard, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      age,
      department,
      role,
      salary,
    } = req.body;

    const existEmail = "select * from data where email = ?";
    const existEmailData = await queryAsync(existEmail, [email]);
    console.log(existEmailData.length);
    if (existEmailData.length > 0) {
      return res.status(400).send({ Error: "email already exist" });
    }

    const hashPassword = await hashValue(password);
    const insertQuery =
      "insert into data (firstName,lastName,email,password,mobile,age,department,role,salary ) values (?,?,?,?,?,?,?,?,?)";
    const result = await queryAsync(insertQuery, [
      firstName,
      lastName,
      email,
      hashPassword,
      mobile,
      age,
      department,
      role,
      salary,
    ]);
    return res
      .status(200)
      .send({ message: "insert data successfully", result });
  } catch (error) {
    res.status(500).send({ Error: error || "Internal Server Error" });
  }
});

route.get("/allData", authGuard, adminGuard, async (req, res) => {
  try {
    console.log("work");
    const query = "select * from data";
    const data = await queryAsync(query, []);
    if (data.length === 0) {
      return res.status(400).send({ Error: "data is empty" });
    }
    // await data.map(user=>user.password = null)
    return res.status(200).send({ message: "data fetch successfully", data });
  } catch (error) {
    res.status(500).send({ Error: error || "Internal server error" });
  }
});

route.get("/:id", authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const query = "select * from data where id = ?";
    const data = await queryAsync(query, [id]);
    if (data.length === 0) {
      return res.status(400).send({ Error: "data not found" });
    }
    data[0].password = null;
    res.status(200).send({ message: "data fetch successfully", data });
  } catch (error) {
    res.status(500).send({ Error: error || "Internal server error" });
  }
});

route.put("/:id", authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      age,
      department,
      role,
      salary,
    } = req.body;
    const hashPassword = await hashValue(password);
    const query =
      "update data set firstName = ?,lastName = ?,email = ?,password = ?,mobile = ?,age = ?,department = ?,role = ?,salary = ? where id = ? ";
    const updateData = await queryAsync(query, [
      firstName,
      lastName,
      email,
      hashPassword,
      mobile,
      age,
      department,
      role,
      salary,
      id,
    ]);
    res.status(200).send({ message: "update success", updateData });
  } catch (error) {
    res.status(500).send({ Error: error || "Internal server error" });
  }
});

route.delete("/:id", authGuard, adminGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const query = "delete from data where id =?";
    queryAsync(query, [id]);
    res.status(200).send("delete success");
  } catch (error) {
    res.status(500).send({ Error: error || "Internal server error" });
  }
});

export default route;
