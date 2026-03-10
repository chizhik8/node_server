const http = require("http");
const fs = require("fs");

const requestListener = (req, res) => {
    const url = req.url;
    const method = req.method;
    res.setHeader("Content-Type", "text/html; charset=utf-8");

    if (url === "/" && method === "GET") {
        res.statusCode = 200;
        return res.end(`
        <!doctype html>
        <html>
            <head><meta charset="utf-8"><title>Ask</title></head>
            <body>
            <h1>Ask a question</h1>
            <form method="POST" action="/message">
                <input type="text" name="question" placeholder="Your question" />
                <button type="submit">Send</button>
            </form>
            </body>
        </html>
        `);
    }
    if (url === "/message" && method === "POST") {
        const body = [];
        req.on("data", (chunk) => {
            body.push(chunk);
        });
        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            const question = parsedBody.split("=")[1];
            fs.writeFileSync("message.txt", question);
        });
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
    }
    if (url === "/about") {
        res.statusCode = 200;
        return res.end("<h1>About</h1>"); 
    }

    res.statusCode = 400;
    return res.end("<h1>404 Not Found</h1>");

};

http.createServer(requestListener).listen(8000);
