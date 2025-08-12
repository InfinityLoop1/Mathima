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


let schedules = JSON.parse(localStorage.getItem('schedules')) || [];

let newSchedule = {
    id: null,
    title: "",
    description: "",
    defaultDays: [],
    periods: []
};


function showPopup(modalId, bgId, useFlex = false) {
    const modal = document.getElementById(modalId);
    const bg = document.getElementById(bgId);
    modal.style.display = useFlex ? 'flex' : 'block';
    bg.style.display = 'block';
}

function closePopup(modalId, bgId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById(bgId).style.display = 'none';
}

document.getElementById('add-schedule-button').addEventListener('click', function () {
    showPopup('schedule-builder-modal', 'schedule-popup-bg');

    newSchedule = {
        id: schedules.length + 1,
        title: "",
        description: "",
        defaultDays: [],
        periods: []
    };
});

document.getElementById('add-class-button').addEventListener('click', function () {
    showPopup('class-builder-modal', 'class-popup-bg', true);
});

document.getElementById('cancel-schedule-button').addEventListener('click', function () {
    closePopup('schedule-builder-modal', 'schedule-popup-bg');
});

document.getElementById('cancel-class-button').addEventListener('click', function () {
    closePopup('class-builder-modal', 'class-popup-bg');
});

document.getElementById('save-schedule-button').addEventListener('click', function () {
    newSchedule = {
        id: schedules.length + 1,
        title: document.getElementById('schedule-name').value,
        description: document.getElementById('schedule-description').value,
        defaultDays: Array.from(document.querySelectorAll('#default-days input:checked')).map(checkbox => checkbox.value),
        periods: newSchedule.periods // keep existing periods
    };
    console.log('New Schedule:', newSchedule);
    closePopup('schedule-builder-modal', 'schedule-popup-bg');
});

document.getElementById('save-class-button').addEventListener('click', function () {
    const newClass = {
        id: newSchedule.periods.length + 1,
        name: document.getElementById('class-name').value,
        startTime: document.getElementById('class-start-time').value,
        endTime: document.getElementById('class-end-time').value,
        room: document.getElementById('class-room').value,
        teacher: document.getElementById('class-teacher').value,
        emoji: document.getElementById('class-emoji').innerHTML || '📚' // default emoji if none selected
    };
    newSchedule.periods.push(newClass);
    console.log('New Class:', newClass);

    const preview = document.getElementById('schedule-preview');
    const classBlock = document.createElement('div');
    classBlock.classList.add('class-block');

    const classBlockInfo = document.createElement('div');
    classBlockInfo.classList.add('class-block-info');

    const classBlockEmoji = document.createElement('span');
    classBlockEmoji.classList.add('class-emoji');
    classBlockEmoji.innerHTML = newClass.emoji;

    const classBlockName = document.createElement('h3');
    classBlockName.innerHTML = `${classBlockEmoji.outerHTML} ${newClass.name}`;

    const classBlockDetails = document.createElement('p');
    function formatTime24to12(time24) {
        const [hourStr, minute] = time24.split(':');
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    }

    classBlockDetails.innerHTML = `<p>Time: ${formatTime24to12(newClass.startTime)} - ${formatTime24to12(newClass.endTime)}</p>
                                    <p>Teacher: ${newClass.teacher}</p>
                                    <p>Room: ${newClass.room}</p>`;

    const classBlockActions = document.createElement('div');
    classBlockActions.classList.add('class-block-actions');

    const classBlockEditButton = document.createElement('button');
    classBlockEditButton.classList.add('edit-class-button', 'material-symbols-rounded');
    classBlockEditButton.innerHTML = 'edit';

    const classBlockDeleteButton = document.createElement('button');
    classBlockDeleteButton.classList.add('delete-class-button', 'material-symbols-rounded');
    classBlockDeleteButton.innerHTML = 'delete';

    classBlockActions.appendChild(classBlockEditButton);
    classBlockActions.appendChild(classBlockDeleteButton);
    classBlockInfo.appendChild(classBlockName);
    classBlockInfo.appendChild(classBlockDetails);
    classBlock.appendChild(classBlockInfo);
    classBlock.appendChild(classBlockActions);
    preview.appendChild(classBlock);

    closePopup('class-builder-modal', 'class-popup-bg');
});

const pickerOptions = {
    onEmojiSelect: emoji => {
        document.getElementById('class-emoji').innerHTML = emoji.native;
    }
}

const picker = new EmojiMart.Picker(pickerOptions);
picker.id = 'class-emoji-picker';
document.getElementById('class-emoji-picker').appendChild(picker);