function getDateAndTime () {
    const dateTimeElement = document.getElementById("date");
    const currentDate = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };

    const formattedDate = currentDate.toLocaleString("en-US", options);
    dateTimeElement.textContent = formattedDate;
}

getDateAndTime();

setInterval(getDateAndTime, 1000);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('give-away-form');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            let errorMessage = '';

            // Validate pet type
            const pet = document.querySelector('input[name="pet"]:checked');
            if (!pet) {
                errorMessage += 'Please select a pet type.<br>';
            }

            // Validate breed
            const breed = document.getElementById('breed').value.trim();
            if (!breed) {
                errorMessage += 'Please enter the breed.<br>';
            }

            // Validate age category
            const ageCategory = document.getElementById('age-category').value;
            if (!ageCategory) {
                errorMessage += 'Please select an age category.<br>';
            }

            // Validate gender
            const gender = document.getElementById('gender').value;
            if (!gender) {
                errorMessage += 'Please select a gender.<br>';
            }

            // Validate get along with dogs
            const getAlongDog = document.querySelector('input[name="get-along-dog"]:checked');
            if (!getAlongDog) {
                errorMessage += 'Please specify if the pet gets along with other dogs.<br>';
            }

            // Validate get along with cats
            const getAlongCat = document.querySelector('input[name="get-along-cat"]:checked');
            if (!getAlongCat) {
                errorMessage += 'Please specify if the pet gets along with other cats.<br>';
            }

            // Validate get along with kids
            const getAlong = document.querySelector('input[name="get-along"]:checked');
            if (!getAlong) {
                errorMessage += 'Please specify if the pet is suitable for families with small children.<br>';
            }

            // Validate first name
            const firstName = document.getElementById('first-name').value.trim();
            if (!firstName) {
                errorMessage += 'Please enter the owner\'s first name.<br>';
            }

            // Validate last name
            const lastName = document.getElementById('last-name').value.trim();
            if (!lastName) {
                errorMessage += 'Please enter the owner\'s last name.<br>';
            }

            // Validate email
            const email = document.getElementById('email').value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailPattern.test(email)) {
                errorMessage += 'Please enter a valid email address.<br>';
            } else if (!email) {
                errorMessage += 'Please enter the owner\'s email address.<br>';
            }

            // If there are validation errors, display them and prevent form submission
            if (errorMessage) {
                document.getElementById('error-message').innerHTML = errorMessage;
                event.preventDefault(); // Prevent form submission
            } else {
                document.getElementById('error-message').innerHTML = ''; 
            }
        });
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const jsonData = Object.fromEntries(formData);

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => response.json())
            .then(data => {
                const messageDiv = document.getElementById('message');
                if (data.success) {
                    messageDiv.innerHTML = data.message;
                    window.location.href = data.redirectUrl; // Redirect to the desired page
                } else {
                    messageDiv.innerHTML = data.message; // Display the error message
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});

// For give away form being on the same page
document.addEventListener('DOMContentLoaded', () => {
    const giveAwayForm = document.getElementById('give-away-form');

    if (giveAwayForm) {
        giveAwayForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevents the default form submission

            const formData = new FormData(giveAwayForm);
            const jsonData = Object.fromEntries(formData);

            fetch('/submit-give-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => response.text())
            .then(result => {
                const messageDiv = document.getElementById('success-message');
                messageDiv.innerHTML = result;
                giveAwayForm.reset(); // Optionally reset the form
            })
            .catch(error => console.error('Error:', error));
        });
    }
});



function filterPets() {
    const petType = document.querySelector('input[name="pet"]:checked').value;
    const breed = document.getElementById('breed').value.trim();
    const age = document.getElementById('age-category').value;
    const gender = document.getElementById('gender').value;
    const getAlongWithChildren = document.querySelector('input[name="get-along"]:checked').value === 'yes';
    const getAlongWithDogs = document.querySelector('input[name="get-along-dog"]:checked').value === 'yes';
    const getAlongWithCats = document.querySelector('input[name="get-along-cat"]:checked').value === 'yes';

    const formData = {
        petType,
        breed,
        age,
        gender,
        getAlongWithChildren,
        getAlongWithDogs,
        getAlongWithCats
    };

    fetch('/find-results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(html => {
        document.body.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
}

// Validaying user input for account creation
document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('account-form');

    if (accountForm) {
        accountForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(accountForm);
            const jsonData = Object.fromEntries(formData);

            fetch('/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => response.json())
            .then(data => {
                const messageDiv = document.getElementById('message');
                messageDiv.innerHTML = data.message;
                if (data.success) {
                    accountForm.reset(); // Reset the form on success
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});

