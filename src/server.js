require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Welcome to the Internship API!');
});

app.get('/internships',async(req,res)=>{
    
  try{
    const response= await axios.get('https://jsearch.p.rapidapi.com/search',{
      params: {
          query: 'tech internships', 
           page: 1 ,
           num_pages:1,
           country:'in',
           employment_types:'INTERN'

      },
    headers: {
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPIDAPI_KEY
    }}
    );
    // console.log(response.data);
    res.json(response.data)
  }
  catch(error){
   res.status(500).json({error:error.message})
  }

})

app.listen(5000, () => console.log("Server running on port 5000"));