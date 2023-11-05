import { isValidObjectId } from "mongoose";

function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.is)) {
    res.status(404);
    throw new Error(`Invalid ObjectIf of: ${req.params.id}`);
  }
  next();
}

export default checkObjectId;
