const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const http = require("http");

const app = express();

const PASSWORD = "hacklab123";
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  }),
);

app.get("/", (req, res) => {
  if (req.session.authenticated) {
    return res.redirect("/dashboard");
  }

  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Terminal Platform Login</title>

            <style>
                *{
                    margin:0;
                    padding:0;
                    box-sizing:border-box;
                    font-family: Arial, sans-serif;
                }

                body{
                    height:100vh;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    background: linear-gradient(135deg, #1e3c72, #2a5298, #6dd5ed);
                    overflow:hidden;
                }

                .login-container{
                    width:350px;
                    padding:40px;
                    border-radius:20px;
                    background: rgba(255,255,255,0.12);
                    backdrop-filter: blur(10px);
                    box-shadow:0 8px 32px rgba(0,0,0,0.3);
                    text-align:center;
                    color:white;
                }

                .login-container h1{
                    margin-bottom:10px;
                    font-size:32px;
                }

                .login-container p{
                    margin-bottom:30px;
                    opacity:0.8;
                }

                .login-container input{
                    width:100%;
                    padding:14px;
                    margin-bottom:20px;
                    border:none;
                    outline:none;
                    border-radius:10px;
                    font-size:16px;
                }

                .login-container button{
                    width:100%;
                    padding:14px;
                    border:none;
                    border-radius:10px;
                    background:#ff9800;
                    color:white;
                    font-size:16px;
                    font-weight:bold;
                    cursor:pointer;
                    transition:0.3s;
                }

                .login-container button:hover{
                    background:#ffb74d;
                    transform:scale(1.03);
                }

                .terminal-icon{
                    font-size:55px;
                    margin-bottom:20px;
                }
            </style>
        </head>

        <body>

            <div class="login-container">
                <div class="terminal-icon">💻</div>

                <h1>HackLab</h1>

                <p>Secure Browser Terminal Access</p>

                <form method="POST" action="/login">
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Enter Access Password"
                        required
                    />

                    <button type="submit">
                        Access Terminal
                    </button>
                </form>
            </div>

        </body>
        </html>
        `);
});

app.post("/login", (req, res) => {
  const { password } = req.body;

  if (password === PASSWORD) {
    req.session.authenticated = true;
    return res.redirect("/dashboard");
  }

  res.send("Wrong password");
});

app.get("/dashboard", (req, res) => {
  if (!req.session.authenticated) {
    return res.redirect("/");
  }

  return res.redirect("/terminal");
});

// Proxy requests to the terminal server
const terminalProxy = createProxyMiddleware({
  target: "http://127.0.0.1:8080",
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    "^/terminal": "",
  },
});

app.use(
  "/terminal",
  (req, res, next) => {
    if (!req.session.authenticated) {
      return res.redirect("/");
    }
    next();
  },
  terminalProxy,
);

// Create HTTP server and handle WebSocket upgrades for the terminal proxy
const server = http.createServer(app);
server.on("upgrade", terminalProxy.upgrade);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
