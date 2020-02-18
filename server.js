const express = require('express');
const app = express();
const connectDB=require('./config/db')

//Connect to the database 
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome!');
});
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server started on port ${port}`));
