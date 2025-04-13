import util from "util"
import connection from "../db/connectDB.js";

export const ROLES = {
  USER:'user',ADMIN:"admin"
}

export const queryAsync = util.promisify(connection.query).bind(connection);
