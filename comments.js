// Create web server
// 1. Create web server
// 2. Read comments.json
// 3. Parse the json file
// 4. Respond with the json to a request
// 5. Add a new comment
// 6. Save the new comment to the comments.json
// 7. Respond with the new comment

// 1. Create web server
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const port = 3000

const server = http.createServer(function (req, res) {
  // 2. Read comments.json
  const filePath = path.join(__dirname, 'comments.json')
  fs.readFile(filePath, 'utf8', function (err, file) {
    if (err) {
      console.error(err)
      res.statusCode = 500
      res.end()
      return
    }

    // 3. Parse the json file
    const comments = JSON.parse(file)

    // 4. Respond with the json to a request
    if (req.method === 'GET' && req.url === '/comments') {
      res.setHeader('Content-Type', 'application/json')
      res.write(JSON.stringify(comments))
      res.end()
    }

    // 5. Add a new comment
    if (req.method === 'POST' && req.url === '/comments') {
      let body = ''
      req.on('data', function (chunk) {
        body += chunk
      })
      req.on('end', function () {
        const newComment = JSON.parse(body)
        comments.push(newComment)
        // 6. Save the new comment to the comments.json
        fs.writeFile(filePath, JSON.stringify(comments), function (err) {
          if (err) {
            console.error(err)
            res.statusCode = 500
            res.end()
            return
          }
          // 7. Respond with the new comment
          res.setHeader('Content-Type', 'application/json')
          res.write(JSON.stringify(newComment))
          res.end()
        })
      })
    }
  })
})

server.listen(port, function () {
  console.log('Server is listening on port', port)
})
