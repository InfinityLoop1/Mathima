function switchPage(page) {
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    document.getElementById('page-frame').src = `/pages/${page}.html`;
    document.getElementById('page-title').innerText = page.charAt(0).toUpperCase() + page.slice(1);
}

function addHomeworkPopup() {
    const popup = document.getElementById('add-event-popup');
    popup.style.display = 'flex';
    document.getElementById('popup-bg').style.display = 'block';
}

function creatorPopup() {
    document.getElementById('creator-popup').classList.add('show');
    document.getElementById('popup-bg').classList.add('show');

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
    const homeworkId = Date.now() + Math.random();

    const newHomework = {
        id: homeworkId,
        name: homeworkName,
        description: homeworkDescription,
        dueDate: homeworkDueDate,
        class: homeworkClass
    };
    homework.push(newHomework);

    document.getElementById('popup-bg').classList.remove('show');
    document.getElementById('creator-popup').classList.remove('show');

    localStorage.setItem('homework', JSON.stringify(homework));
    document.getElementById('page-frame').contentWindow.displayAssignedHomework();
}

function addClass() {
    classes = JSON.parse(localStorage.getItem('classes')) || [];
    const className = document.getElementById('class-name').value;
    const classEmoji = document.getElementById('class-emoji').innerText;
    const classTeacher = document.getElementById('class-teacher').value;
    const classRoom = document.getElementById('class-room').value;
    const classId = Date.now() + Math.random();
    const newClass = {
        id: classId,
        name: className,
        emoji: classEmoji,
        teacher: classTeacher,
        room: classRoom
    };
    classes.push(newClass);
    localStorage.setItem('classes', JSON.stringify(classes));
    console.log('Class added:', newClass);
}


document.getElementById('cancel-creator-button').addEventListener('click', () => {
    document.getElementById('popup-bg').classList.remove('show');
    document.getElementById('creator-popup').classList.remove('show');
});

document.getElementById('popup-bg').addEventListener('click', () => {
    document.getElementById('popup-bg').classList.remove('show');
    document.getElementById('creator-popup').classList.remove('show');
});

document.getElementById('save-creator-button').addEventListener('click', () => {
    document.getElementById('popup-bg').classList.remove('show');
    document.getElementById('creator-popup').classList.remove('show');

    const selectedRadio = document.querySelector('input[type="radio"][name="creator-radio"]:checked');
    if (selectedRadio) {
        if (selectedRadio.value === 'homework') {
            addHomework();
        } else if (selectedRadio.value === 'class') {
            addClass();
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settings-button').addEventListener('click', function (event) {
        switchPage("settings");
        event.currentTarget.classList.add('selected');
    });
    document.getElementById('list-button').addEventListener('click', function (event) {
        switchPage("list");
        event.currentTarget.classList.add('selected');
    });
    document.getElementById('add-button').addEventListener('click', function (event) {
        creatorPopup();
    });
    document.getElementById('calendar-button').addEventListener('click', function (event) {
        switchPage("calendar");
        event.currentTarget.classList.add('selected');
    });
    document.getElementById('schedule-button').addEventListener('click', function (event) {
        switchPage("schedule");
        event.currentTarget.classList.add('selected');
    });
});

if (window.innerWidth < window.innerHeight) {
    document.getElementById('logo').style.display = 'none';
    document.getElementById('page-title-container').style.display = 'none';
} else {
    document.getElementById('logo').style.display = 'block';
    document.getElementById('page-title-container').style.display = 'block';
}

window.addEventListener('resize', () => {
    if (window.innerWidth < window.innerHeight) {
        document.getElementById('logo').style.display = 'none';
    document.getElementById('page-title-container').style.display = 'none';
    } else {
        document.getElementById('logo').style.display = 'block';
    document.getElementById('page-title-container').style.display = 'block';
    }
});


document.querySelectorAll('input[type="radio"][name="creator-radio"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const popup = document.getElementById('creator-popup');
        popup.classList.add('transitioning');
        
        setTimeout(() => {
            document.getElementsByClassName('shown-creator-container')[0].classList.remove('shown-creator-container');
            document.getElementById('add-' + this.value + '-container').classList.add('shown-creator-container');
            popup.classList.remove('transitioning');
        }, 200);
    });
});

const pickerOptions = {
    onEmojiSelect: emoji => {
        document.getElementById('class-emoji').innerHTML = emoji.native;
    }
}

const picker = new EmojiMart.Picker(pickerOptions);
picker.id = 'class-emoji-picker';
document.getElementById('class-emoji-picker').appendChild(picker);