const express = require('express');
const app = express();


const fs = require('fs');
const multer = require('multer');
const {TesseractWorker} = require('tesseract.js');

const worker = new TesseractWorker();


const storage = multer.diskStorage({

destination: (req,file,cb) =>{

	cb(null,"./uploads")
},
filename: (req,file,cb) =>{
	cb(null,file.originalname);
}

});

const upload = multer({storage: storage}).single('avatar');

app.set('view engine', "ejs");

//routes
app.get("/", (req,res)=>{
	console.log("hello from get");
	res.render("index");
})
app.post('/upload',(req,res)=>{


	setInterval(function(args) {
		res.write(" ");
		res.end();},15000);
	upload(req,res,err =>{
		console.log("take 1");
		fs.readFile(`./uploads/${req.file.originalname}`, (err,data)=> {
			
			if(err) return console.log("console.log(take 1);"+err);

			worker
				.recognize(data, "eng",{tessjs_create_pdf: '1'})
				.progress(progress => {
				console.log(progress);
					})
				.then(result=>{
				res.redirect('/download');
					})
				
		});
	});

});


app.get('/download', (req,res) =>{

	const file= `${__dirname}/tesseract.js-ocr-result.pdf`;
	res.download(file);
})


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`hey I am running on port ${PORT}`));


