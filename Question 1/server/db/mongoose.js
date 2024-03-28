const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
//if using an old version og mongo you will need the comments....
// mongoose.connect('mongodb://localhost:27017/Members', {
//     // useNewUrlParser: true,
//     // useCreateIndex: true,
//     // useFindAndModify: false,
//     // useUnifiedTopology: true
// })
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    //useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    //useUnifiedTopology: true
})