import { VercelRequest, VercelResponse } from '@vercel/node'
import * as fs from 'fs'
import * as path from 'path'

const serveFile = (
  res: VercelResponse,
  filePath: string,
  contentType: string
) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).send('File Not Found')
      return
    }
    res.setHeader('Content-Type', contentType)
    res.send(data)
  })
}

export default (req: VercelRequest, res: VercelResponse) => {
  const { url } = req
  const publicPath = path.join(__dirname, '..', 'public')

  if (url) {
    const requestedFile = path.join(publicPath, url)
    if (fs.existsSync(requestedFile)) {
      const ext = path.extname(requestedFile)
      const contentType = ext === '.js' ? 'application/javascript' : 'text/html'
      serveFile(res, requestedFile, contentType)
      return
    }
  }

  const indexPath = path.join(publicPath, 'index.html')
  serveFile(res, indexPath, 'text/html')
}
