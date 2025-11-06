/* example data for schedules
   This data is used to populate the schedule builder UI
schedules = 
[
    {
        id: 1,
        title: "Normal Schedule",
        defaultDays: [
        "Monday",
        "Tuesday",
        "Thursday",
        "Friday"
        ],
        periods: [
            {
                id: 1,
                name: "Math 101",
                startTime: "08:00",
                endTime: "09:30",
                room: "Room 101",
                teacher: "John Doe",
                emoji: "📚"
            },
            {
                id: 2,
                name: "History 201",
                startTime: "10:00",
                endTime: "11:30",
                room: "Room 102",
                teacher: "Jane Smith",
                emoji: "📖"
            }
                
        ]
    },
    {
        id: 2,
        title: "Short Schedule",
        defaultDays: [
            "Wednesday"
        ],
        periods: [
            {
                id: 1,
                name: "Math 101",
                startTime: "08:00",
                endTime: "09:00",
                room: "Room 101",
                teacher: "John Doe",
                emoji: "📚"
            },
            {
                id: 2,
                name: "History 201",
                startTime: "09:30",
                endTime: "10:00",
                room: "Room 102",
                teacher: "Jane Smith",
                emoji: "📖"
            }
        ]
    }
]
*/

function addClass() {
    try {
        //try to call the parent's creator popup to open the class builder
        if (window.parent && typeof window.parent.creatorPopup === 'function') {
            window.parent.creatorPopup();

            const radio = window.parent.document.querySelector('input[name="creator-radio"][value="class"]');
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            }
            return;
        }
    } catch (err) {
        console.error('Could not open parent creatorPopup!', err);
    }
}

function deleteClass(classId) {
    let classes = JSON.parse(localStorage.getItem('classes')) || [];
    classes = classes.filter(classItem => classItem.id !== classId);
    localStorage.setItem('classes', JSON.stringify(classes));
    displayClasses();
}

function displayClasses() {
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    console.log('Displaying classes:', classes);
    if (classes.length === 0) {
        document.getElementById('class-container').innerHTML = '<p>You have no classes. Try adding some!</p>';
    } else {
        document.getElementById('class-container').innerHTML = '';
        classes.forEach(classItem => {
            const classDiv = document.createElement('div');
            classDiv.classList.add('class-item');
            classDiv.innerHTML = `
            <div class="class-item-buttons">
                <h2>${classItem.emoji ? classItem.emoji : ''} ${classItem.name}</h2>
                <button class="edit-button material-symbols-rounded">edit</button>
                <button class="delete-button material-symbols-rounded">delete</button>
            </div>
            <p>${classItem.teacher} • ${classItem.room}</p>
        `;
            document.getElementById('class-container').appendChild(classDiv);
            classDiv.querySelector('.edit-button').addEventListener('click', () => editClass(classItem.id));
            classDiv.querySelector('.delete-button').addEventListener('click', () => deleteClass(classItem.id));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayClasses();
    document.getElementById('add-class-button').addEventListener('click', addClass);
});


