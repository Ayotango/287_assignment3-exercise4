const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const { calculateAverage, generateUniqueID, capitalizeWords, sortArrayByProperty } = require('./utils/helpers');

const app = express();
const PORT = 3000;
const usersFile = path.join(__dirname, 'data', 'users.txt');
const petInfoFile = path.join(__dirname, 'data', 'pets_info.txt');

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set EJS as the templating engine
app.set('view engine', 'ejs');


// Handling the template header and footer
app.use((req, res, next) => {
    ejs.renderFile(path.join(__dirname, 'views', 'partials', 'header.ejs'), { user: req.session.user }, (err, header) => {
        if (err) return res.status(500).send('Error loading header');
        ejs.renderFile(path.join(__dirname, 'views', 'partials', 'footer.ejs'), (err, footer) => {
            if (err) return res.status(500).send('Error loading footer');
            res.locals.header = header;
            res.locals.footer = footer;
            next();
        });
    });
});

// For handling reading the data
function readData(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return callback(err);
        const parsedData = data.trim().split('\n').map(line => line.split(':'));
        callback(null, parsedData);
    });
}

// For handling writing the data
function writeData(filePath, data, callback) {
    const content = data.map(item => item.join(':')).join('\n');
    fs.writeFile(filePath, content, 'utf8', callback);
}

// For handling form submission
app.post('/find-results', (req, res) => {
    try {
        console.log('Form Data:', req.body); // Log the form data

        const { pet, breed, age, gender, 'get-along': getAlong } = req.body;

        // Sample pets data
        const allPets = [
            {
                name: 'Pinky',
                image: 'public/images/pinky.jpg',
                breed: 'Persian Short-Hair',
                age: '1 year old',
                gender: 'Female',
                getAlongWithChildren: true,
                getAlongWithDogs: true,
                getAlongWithCats: true,
                petType: 'Cat'
            },
            {
                name: 'Théo',
                image: 'public/images/theo.jpg',
                breed: 'Yorkshire',
                age: '15 years old',
                gender: 'Male',
                getAlongWithChildren: true,
                getAlongWithDogs: true,
                getAlongWithCats: true,
                petType: 'Dog'
            },
            {
                name: 'Turbo',
                image: 'public/images/dog1.jpg',
                breed: 'Beagle',
                age: '3 years old',
                gender: 'Male',
                getAlongWithChildren: false,
                getAlongWithDogs: true,
                getAlongWithCats: true,
                petType: 'Dog'
            },
            {
                name: 'Koncho',
                image: 'public/images/cat.jpg',
                breed: 'Beagle',
                age: '3 years old',
                gender: 'Male',
                getAlongWithChildren: false,
                getAlongWithDogs: true,
                getAlongWithCats: true,
                petType: 'Cat'
            },
            {
                name: 'Olive',
                image: 'public/images/dog2.jpg',
                breed: 'Labrador',
                age: '1 years old',
                gender: 'Male',
                getAlongWithChildren: false,
                getAlongWithDogs: true,
                getAlongWithCats: true,
                petType: 'Dog'
            }     
            
        ];

            const filteredPets = allPets.filter(petData => {
                console.log('Checking pet:', petData);
                console.log('Conditions:', {
                    petMatch: petData.petType === pet,
                    breedMatch: breed === '' || petData.breed.toLowerCase().includes(breed.toLowerCase()),
                    ageMatch: age === '' || petData.age.toString() === age,
                    genderMatch: gender === '' || petData.gender.toLowerCase() === gender.toLowerCase(),
                    getAlongMatch: getAlong === 'yes' ? petData.getAlongWithChildren : true
                });
            
                return petData.petType === pet &&
                       (breed === '' || petData.breed.toLowerCase().includes(breed.toLowerCase())) &&
                       (age === '' || petData.age.toString() === age) &&
                       (gender === '' || petData.gender.toLowerCase() === gender.toLowerCase()) &&
                       (getAlong === 'yes' ? petData.getAlongWithChildren : true);
            });
            

        console.log('Filtered Pets:', filteredPets); // Log the filtered results

        res.render('find-results', { 
            title: 'Find A Paw', 
            filteredPets, 
            header: res.locals.header, 
            footer: res.locals.footer 
        });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Navigating to the home page
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'index.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading home page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

// Navigating to the browse page
app.get('/browse.html', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'browse.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading browse page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

// Navigating to the find page
app.get('/find.html', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'find.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading browse page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

// Navigating to the dog page
app.get('/dog.html', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'dog.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading browse page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

// Navigating to the cat page
app.get('/cat.html', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'cat.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading browse page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

// Navigating to the give page
app.get('/give.html', (req, res) => {
    if (!req.session.user) {
        // User not logged in, redirect to login page
        return res.redirect('/login.html');
    }
    // User is logged in, serve the give.html form
    fs.readFile(path.join(__dirname, 'views', 'give.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading give page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

// Navigating to the contact page
app.get('/contact.html', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'contact.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading browse page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

// Navigating to the privacy page
app.get('/privacy.html', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'privacy.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading browse page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

// Navigating to the account page
app.get('/account.html', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'account.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading browse page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

// Navigating to the log in page
app.get('/login.html', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'login.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading browse page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});


// Handling account creation
app.post('/create-account', (req, res) => {
    const { username, password } = req.body;

    readData(usersFile, (err, users) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        if (users.some(user => user[0] === username)) {
            return res.json({ success: false, message: 'Username is already taken. Please choose another one.' });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            users.push([username, hash]);

            writeData(usersFile, users, err => {
                if (err) {
                    console.error('Error writing to users file:', err);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }

                res.json({ success: true, message: 'Account successfully created! You can now log in.' });
            });
        });
    });
});


// Handle POST request to /login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return res.json({ success: false, message: 'Invalid username format. Only letters and digits are allowed.' });
    }
    if (password.length < 4 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.json({ success: false, message: 'Invalid password format. Must be at least 4 characters long with at least one letter and one digit.' });
    }

    readData(usersFile, (err, users) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        const user = users.find(user => user[0] === username);
        if (!user) {
            return res.json({ success: false, message: 'Login failed: User does not exist.' });
        }

        const hashedPassword = user[1];
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            if (result) {
                req.session.user = username;
                return res.json({ success: true, message: 'Login successful! Redirecting...', redirectUrl: '/give.html' });
            } else {
                return res.json({ success: false, message: 'Login failed: Incorrect password.' });
            }
        });
    });
});

// Handle logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('logout', { 
            title: 'Logged Out',
            message: 'You have been logged out successfully.'
        });
    });
});


// Handle give-away form submission
app.post('/submit-give-form', (req, res) => {
    if (!req.session.user) {
        return res.send('You must be logged in to submit the form.');
    }

    const { pet, breed, 'age-category': ageCategory, gender, 'get-along-dog': getAlongDog, 'get-along-cat': getAlongCat, 'get-along': getAlong, 'first-name': firstName, 'last-name': lastName, email } = req.body;

    // Validate form data
    if (!pet || !breed || !ageCategory || !gender || !getAlongDog || !getAlongCat || !getAlong || !firstName || !lastName || !email) {
        return res.send('Please complete all required fields.');
    }

    // You can add further validation for email, etc. here

    fs.readFile(petInfoFile, 'utf8', (err, data) => {
        let currentId = 0;
        if (!err && data.trim() !== '') {
            const lines = data.trim().split('\n');
            const lastLine = lines[lines.length - 1];
            currentId = parseInt(lastLine.split(':')[0]);
        }

        const newId = currentId + 1;

        const entryValues = [
            newId,
            req.session.user,
            pet,
            breed,
            ageCategory,
            gender,
            getAlongDog,
            getAlongCat,
            getAlong,
            firstName,
            lastName,
            email
        ];

        const newEntry = entryValues.join(':') + '\n';

        fs.appendFile(petInfoFile, newEntry, err => {
            if (err) {
                console.error('Error writing to pet info file:', err);
                return res.status(500).send('Internal Server Error');
            }

            res.send('Pet information successfully submitted!');
        });
    });
});




// To display local port 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});