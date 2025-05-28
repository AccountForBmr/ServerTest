const express = require('express')

const app = express()

require('dotenv').config()

app.use(express.json())

//test
var cors = require('cors');
app.use(cors({origin:"*"})); 

const connectDB = require('./connectMongo')

const bcrypt = require('bcrypt')

connectDB()

const BookModel = require('./models/book.model')

const UserModel = require('./models/user.model')

const HypnoModel = require('./models/hypno.model')

const TmpHypnoModel = require('./models/tmpHypno.model')

const { default: mongoose } = require('mongoose')

app.get('/userValidate', async (req, res) => {
    console.log(req.body);

    try {
        return res.status(200).json({
            msg: 'Ok'
            })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.post('/userValidate', async (req, res) => {
    if(!req.body.name||!req.body.password) {
        return res.status(500).json({
            msg: "Invalid request",
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
    }
    try {

        let users = await UserModel.find({name:req.body.name});
        console.log("Il body:");
        console.log(req.body);
        console.log("L'user trovato");
        console.log(users);

        if(users.length == 0) {
            //add to db
            const saltRounds = 7;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

            const newUser = new UserModel({ name:req.body.name, password: hashedPassword });
            await newUser.save();

        } else {
            //validate
            let user = users[0]; 
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);

            if(passwordMatch) {
                return res.status(200).send("Correct Password").json({
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                });
            } else {
                return res.status(401).send("Wrong Password").json({
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                });
            }
        }
    
        return res.status(200).json({
            msg: 'Ok',
            data: users,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
    }
})

app.post('/tmpHypno', async (req, res) => {
    if(!req.body.hypno) {
        return res.status(500).json({
            msg: "Invalid request",
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
    }
    try {

        //not temporary
        let hypnos = await HypnoModel.find();
        console.log("Il body:");
        console.log(req.body);
        console.log("Hypnos trovate");
        console.log(hypnos);

        let newHypno = new HypnoModel(req.body.hypno);
        await newHypno.save();

        //temporary
        let tmpHypnos = await TmpHypnoModel.find();
        console.log("Il body:");
        console.log(req.body);
        console.log("TmpHypnos trovate");
        console.log(tmpHypnos);

        let tmpHypno = req.body.hypno;
        tmpHypno.createdAt = new Date();
        let newTmpHypno = new TmpHypnoModel(tmpHypno);
        await newTmpHypno.save();

        /*
        in hypno, go to indexes and write:
        In fields:
        {
            "createdAt": 1
        }

        (createdAt is added automatically cause of timestamps in schema)
        (DO createdAt = new Date(); to add it manually. It's probably for the best. Or create a tmpHypno schema)
        (604800 is a week, for testing, just do 1 min.)
        In options:
        {
            "expireAfterSeconds": 604800
        }

        */

        /*
        if(users.length == 0) {
            //add to db
            const saltRounds = 7;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

            const newUser = new UserModel({ name:req.body.name, password: hashedPassword });
            await newUser.save();

        } else {
            //validate
            let user = users[0]; 
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);

            if(passwordMatch) {
                return res.status(200).send("Correct Password").json({
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                });
            } else {
                return res.status(401).send("Wrong Password").json({
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                });
            }
        }
        */
        return res.status(200).json({
            msg: 'Ok',
            data: hypnos,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'Access-Control-Allow-Origin': '*'
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'Access-Control-Allow-Origin': '*'
        })
    }
})

app.get('/api/v1/books', async (req, res) => {

    const { limit = 5, orderBy = 'name', sortBy = 'asc', keyword } = req.query
    let page = +req.query?.page

    if (!page || page <= 0) page = 1

    const skip = (page - 1) * +limit

    const query = {}

    if (keyword) query.name = { "$regex": keyword, "$options": "i" }

    try {
        const data = await BookModel.find(query).skip(skip).limit(limit).sort({[orderBy]: sortBy})
        const totalItems = await BookModel.countDocuments(query)
        return res.status(200).json({
            msg: 'Ok',
            data,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            limit: +limit,
            currentPage: page
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.get('/api/v1/books/:id', async (req, res) => {
    try {
        const data = await BookModel.findById(req.params.id)

        if (data) {
            return res.status(200).json({
                msg: 'Ok',
                data
            })
        }

        return res.status(404).json({
            msg: 'Not Found',
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.post('/api/v1/books', async (req, res) => {
    try {
        const { name, author, price, description } = req.body
        const book = new BookModel({
            name, author, price, description
        })
        const data = await book.save()
        return res.status(200).json({
            msg: 'Ok',
            data
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.put('/api/v1/books/:id', async (req, res) => {
    try {
        const { name, author, price, description } = req.body
        const { id } = req.params

        const data = await BookModel.findByIdAndUpdate(id, {
            name, author, price, description
        }, { new: true })

        return res.status(200).json({
            msg: 'Ok',
            data
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.delete('/api/v1/books/:id', async (req, res) => {
    try {
        await BookModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            msg: 'Ok',
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})

module.exports = app