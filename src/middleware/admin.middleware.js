import { queryAsync, ROLES } from "../constants/common.constants.js"
import { decodeToken } from "../utils/auth.js"

const adminGuard = async (req, res, next) => {
  let token = req?.headers?.authorization?.split(" ")[1]
  if (token) {
    let payload = decodeToken(token)
    let query = "select * from data where email = ? and role = ? "
    let user = await queryAsync(query, [payload.email, payload.role])
    
    if (user && user[0].role === ROLES.ADMIN) {
      next()
    } else {
      res.status(401).send({Error:"Access Denied"})
    }
  } else {
    res.status(401).send({Error:"Token Not Found"})
  }
}

export default adminGuard