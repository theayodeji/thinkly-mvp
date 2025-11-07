import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.post("/auth/register", async (req, res) => {

  const {email, password} = req.body;

  if (password.length < 4) {
    return res.status(400).json({error: "Password must be at least 4 characters long", example: "abcd"});
  }

    console.log(body);
    console.log("Register endpoint hit");
    return
});


export default app;