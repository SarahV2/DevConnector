const express = require('express');
const app = express();
const connectDB = require('./config/db')

//Connect to the database 
connectDB();

//Init middleware
app.use(express.json({ extended: false })) //body parser
app.get('/', (req, res) => {
  res.send('Welcome!');
});

//Define Routes.
app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server started on port ${port}`));
