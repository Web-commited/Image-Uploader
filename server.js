const express=require('express');
const fileUpload = require('express-fileupload');
//
const {v4: uuidv4} = require('uuid');
const cors = require('cors');
const path=require('path');
const PORT=process.env.PORT || 3010;

const app=express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());


app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({msg: 'No file uploaded'});
    }
    
    const file = req.files.file;
    const maxSize=10*1024*1024;
    if(file.size>maxSize){
        return res.status(400).json({msg: 'File size too large, pick a smaller file under 10MB'});
    }
    const fileName = uuidv4() + path.extname(file.name);
    const upload_dir = path.join(__dirname, 'client/public/uploads');
    file.mv(`${upload_dir}/${fileName}`, err => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({fileName: fileName, filePath: `/uploads/${fileName}`});
    });
})

app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
