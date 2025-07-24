function switchPage(page) {
    document.getElementById('page-frame').src = `/pages/${page}.html`;
    document.getElementById('page-title').innerText = page.charAt(0).toUpperCase() + page.slice(1);
}

function addEventPopup() {
    const popup = document.getElementById('add-event-popup');
    popup.style.display = 'flex';
    document.getElementById('popup-bg').style.display = 'block';
    //i love copilot
    const dueDateInput = document.getElementById("homework-due-date");
    if (dueDateInput) {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localDateTime = new Date(now.getTime() - offset);
        const formattedDateTime = localDateTime.toISOString().slice(0, 16);
        dueDateInput.value = formattedDateTime;
    }
}

function addHomework() {
        homework = JSON.parse(localStorage.getItem('homework')) || [];
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
    homework.push(newHomework);

    document.getElementById('add-event-popup').style.display = 'none';
    document.getElementById('popup-bg').style.display = 'none';

    localStorage.setItem('homework', JSON.stringify(homework));
    document.getElementById('page-frame').contentWindow.displayHomework();
}


document.getElementById('cancel-homework-button').addEventListener('click', () => {
    document.getElementById('add-event-popup').style.display = 'none';
    document.getElementById('popup-bg').style.display = 'none';
});

document.getElementById('popup-bg').addEventListener('click', () => {
    document.getElementById('add-event-popup').style.display = 'none';
    document.getElementById('popup-bg').style.display = 'none';
});

document.getElementById('save-homework-button').addEventListener('click', addHomework);

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settings-button').addEventListener('click', function (event) {
        switchPage("settings");
    });
    document.getElementById('list-button').addEventListener('click', function (event) {
        switchPage("list");
    });
    document.getElementById('add-button').addEventListener('click', function (event) {
        addEventPopup();
    });
    document.getElementById('calendar-button').addEventListener('click', function (event) {
        switchPage("calendar");
    });
    document.getElementById('schedule-button').addEventListener('click', function (event) {
        switchPage("schedule");
    });
});