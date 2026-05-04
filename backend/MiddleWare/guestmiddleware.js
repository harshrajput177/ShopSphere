// const { v4: uuidv4 } = require("uuid");

// const guestMiddleware = (req, res, next) => {
//   if (!req.cookies.guestId) {
//     const guestId = uuidv4();

//     res.cookie("guestId", guestId, {
//       httpOnly: true,
//       sameSite: "lax",
//     });

//     req.cookies.guestId = guestId;
//   }

//   next();
// };

// module.exports = guestMiddleware;