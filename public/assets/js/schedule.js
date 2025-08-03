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

document.getElementById('add-schedule-button').addEventListener('click', function() {
    showPopup('schedule-builder-modal', 'schedule-popup-bg');

    newSchedule = {
        id: schedules.length + 1,
        title: "",
        defaultDays: [],
        periods: []
    };
});

document.getElementById('add-class-button').addEventListener('click', function() {
    showPopup('class-builder-modal', 'class-popup-bg', true);
});

document.getElementById('cancel-schedule-button').addEventListener('click', function() {
    closePopup('schedule-builder-modal', 'schedule-popup-bg');
});

document.getElementById('cancel-class-button').addEventListener('click', function() {
    closePopup('class-builder-modal', 'class-popup-bg');
});