/*
homework = [
        {
        name: '',
        description: '',
        dueDate: '',
        class: '',
        completed: false,
        }
    ]
*/

let homework = localStorage.getItem('homework');

// Parse the homework data if it exists, otherwise initialize as an empty array
if (homework) {
    homework = JSON.parse(homework);
} else {
    homework = [];
}

function formatDateTime(datetimeLocalValue) {
    const date = new Date(datetimeLocalValue);

    // Extract components
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options); // MM/DD/YYYY

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format

    const formattedTime = `${hours}:${minutes} ${ampm}`; // HH:MM AM/PM

    return ` ${formattedTime} - ${formattedDate}`;
}

function homeworkPopup() {
    const popup = document.getElementById('homework-popup');
    popup.style.display = 'flex';
}

function addHomework() {
    const homeworkName = document.getElementById('homework-name').value;
    const homeworkDescription = document.getElementById('homework-description').value;
    const homeworkDueDate = document.getElementById('homework-due-date').value;
    const homeworkClass = document.getElementById('homework-class').value;

    const newHomework = {
        name: homeworkName,
        description: homeworkDescription,
        dueDate: homeworkDueDate,
        class: homeworkClass,
        completed: false,
    };

    // Add the new homework to the array
    homework.push(newHomework);

    // Save the updated array to localStorage as a JSON string
    localStorage.setItem('homework', JSON.stringify(homework));

    displayHomework();
    document.getElementById('homework-popup').style.display = 'none';
}

function displayHomework() {
    const homeworkList = document.getElementById('homework-container');
    homeworkList.innerHTML = ''; // Clear the list before re-rendering

    for (let i = 0; i < homework.length; i++) {
        const homeworkItem = homework[i];
        const listItem = document.createElement('div');
        listItem.innerHTML = `<button>✖</button> <strong>${homeworkItem.name}</strong> <p>${homeworkItem.description}</p> <p>${formatDateTime(homeworkItem.dueDate)}</p> <p>${homeworkItem.class}</p>`;
        homeworkList.appendChild(listItem);
    }
}

function removeHomework(index) {
    homework.splice(index, 1); // Remove the homework item at the specified index
    localStorage.setItem('homework', JSON.stringify(homework)); // Update localStorage
    displayHomework(); // Re-render the homework list
}

document.getElementById('add-homework-button').addEventListener('click', homeworkPopup);

document.getElementById('cancel-homework-button').addEventListener('click', () => {
    document.getElementById('homework-popup').style.display = 'none';
});

document.getElementById('save-homework-button').addEventListener('click', addHomework);

document.getElementById('homework-container').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const index = Array.from(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);
        removeHomework(index);
    }
});

// Display homework on page load
displayHomework();