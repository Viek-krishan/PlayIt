import asyncHandeler from "../utils/asyncHandeler.js";

const RegisterUser = asyncHandeler(async (req, res) => {
  res.status(200).json({
    message: "vivek with chai or code",
  });
});

export default RegisterUser;
