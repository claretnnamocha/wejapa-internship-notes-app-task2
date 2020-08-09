const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const port = process.env.PORT || 5000;
const content_types = {
  html: "text/html",
  png: "image/png",
  js: "text/javascript",
  css: "text/css",
};

const server = http.createServer((req, res) => {
  try {
    let exists;
    const { query, pathname: uri } = url.parse(req.url, true);
    switch (uri) {
      case "/":
        res.end(fs.readFileSync("index.html"));
        break;
      case "/get-folders":
        res.end(JSON.stringify(fs.readdirSync("./notes")));
        break;
      case "/get-notes":
        if (!("folder" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify a folder",
            })
          );
        }
        exists = fs.existsSync(`./notes/${query.folder}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This folder does not exist",
            })
          );
        }
        res.end(JSON.stringify(fs.readdirSync(`./notes/${query.folder}`)));
        break;
      case "/create-folder":
        if (!("folder" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify a folder name",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}`);
        if (exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This folder already exists",
            })
          );
        }

        fs.mkdirSync(`./notes/${query.folder.toLowerCase()}`);

        res.end(
          JSON.stringify({
            status: true,
            message: "Folder created",
          })
        );
        break;
      case "/create-note":
        if (!("folder" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify folder",
            })
          );
        }

        if (!("filename" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify a file name",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This folder does not exist",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}/${query.filename}`);
        if (exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Note with this name already exists in this folder",
            })
          );
        }

        fs.writeFileSync(`./notes/${query.folder}/${query.filename}`, "");
        res.end(
          JSON.stringify({
            status: true,
            message: "Note created",
          })
        );
        break;
      case "/read-folder":
        if (!("folder" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify folder",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This folder does not exist",
            })
          );
        }
        res.end(JSON.stringify(fs.readdirSync(`./notes/${query.folder}`)));
        break;
      case "/read-note":
        if (!("folder" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify folder",
            })
          );
        }

        if (!("filename" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify a file name",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This folder does not exist",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}/${query.filename}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This note does not exist",
            })
          );
        }

        res.end(fs.readFileSync(`./notes/${query.folder}/${query.filename}`));
        break;
      case "/update-note":
        if (!("folder" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify folder",
            })
          );
        }

        if (!("filename" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify a file name",
            })
          );
        }

        if (!("content" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Contet is required",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This folder does not exist",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}/${query.filename}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This note does not exist",
            })
          );
        }

        fs.writeFileSync(
          `./notes/${query.folder}/${query.filename}`,
          query.content
        );
        res.end(
          JSON.stringify({
            status: true,
            message: "Note Updated",
          })
        );
        break;
      case "/delete-note":
        if (!("folder" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify folder",
            })
          );
        }

        if (!("filename" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify a file name",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This folder does not exist",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}/${query.filename}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This note does not exist",
            })
          );
        }

        fs.unlinkSync(`./notes/${query.folder}/${query.filename}`);
        res.end(
          JSON.stringify({
            status: true,
            message: "Note Deleted",
          })
        );
        break;
      case "/save-note":
        if (!("folder" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify folder",
            })
          );
        }

        if (!("filename" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify a file name",
            })
          );
        }

        if (!("content" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "There's no content",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This folder does not exist",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}/${query.filename}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This note does not exist",
            })
          );
        }
        try {
          fs.writeFileSync(
            `./notes/${query.folder}/${query.filename}`,
            query.content
          );
        } catch (error) {
          res.end(
            JSON.stringify({
              status: false,
              message: "An error Occured",
            })
          );
        }

        res.end(
          JSON.stringify({
            status: true,
            message: "Note saved",
          })
        );
        break;
      case "/delete-folder":
        if (!("folder" in query)) {
          res.end(
            JSON.stringify({
              status: false,
              message: "Specify a folder name",
            })
          );
        }

        exists = fs.existsSync(`./notes/${query.folder}`);
        if (!exists) {
          res.end(
            JSON.stringify({
              status: false,
              message: "This folder does not exist",
            })
          );
        }

        deleteFolderRecursive(`./notes/${query.folder.toLowerCase()}`);

        res.end(
          JSON.stringify({
            status: true,
            message: "Folder deleted",
          })
        );
        break;
      default:
        let filename = path.join(__dirname, uri);
        exists = fs.existsSync(filename);

        if (!exists) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
          return;
        }

        let type = content_types[path.extname(filename).split(".")[1]];
        res.writeHead(200, type);

        res.end(fs.readFileSync(filename));
        break;
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 Internal server Error '" + error.message + "'");
  }
});

deleteFolderRecursive = (path) => {
  fs.readdirSync(path).forEach(function (file) {
    var curPath = path + "/" + file;
    if (fs.lstatSync(curPath).isDirectory()) {
      deleteFolderRecursive(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
  fs.rmdirSync(path);
};

server.listen(port);

console.log(`App is running on http://localhost:${port}`);
