const express = require('express');
const bodyParser = require('body-parser');
const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');
const User = require('./src/entities/User');
const jwt = require('jsonwebtoken');
const redis = require('redis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});


app.use(bodyParser.json());

const myDataSource = new DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [__dirname + '/../migrations/*.js'],
    subscribers: [],
});


myDataSource.initialize()
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => console.log('Database connection error:', error));

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

//Register User
app.post('/api/register', async (req, res) => {
    const { name, email, password, board, field, standard, dob, age } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const userRepository = myDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = myDataSource.getRepository(User).create({
            name,
            email,
            password: hashedPassword,
            board,
            field,
            standard,
            dob,
            age,
        });

        await myDataSource.getRepository(User).save(user);

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login User API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const userRepository = myDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: { email }
    });

    if (!user) {
        return res.status(401).send('Invalid credentials');
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

app.put('/api/update', authenticateToken, async (req, res) => {
    const { name, email, password, board, field, standard, dob, age } = req.body;

    try {
        const userRepository = myDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (board) user.board = board;
        if (field) user.field = field;
        if (standard) user.standard = standard;
        if (dob) user.dob = dob;
        if (age) user.age = age;

        await userRepository.save(user);
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({ message: 'User updated successfully', user:{...userWithoutPassword} });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});