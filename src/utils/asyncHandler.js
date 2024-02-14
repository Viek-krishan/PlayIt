// asyncHandeler using promises ---------------------------------------
const asyncHandler = (RequestHandeler) => {
  return (req, res, next) => {
    Promise.resolve(RequestHandeler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;

// asyncHandeler using try and catch ---------------------------------
//
// const TryHandeler = (RequestHandeler) => async (req, res, next) => {
//   try {
//     await RequestHandeler(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
