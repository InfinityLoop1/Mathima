// load allat data shit
homework = JSON.parse(localStorage.getItem('homework')) || [];
finishedHomework = JSON.parse(localStorage.getItem('finishedHomework')) || [];
showCompleted = false;

// assign UIDs if missing
homework.forEach(hw => { if (!hw.id) hw.id = Date.now() + Math.random(); });
finishedHomework.forEach(hw => { if (!hw.id) hw.id = Date.now() + Math.random(); });

function displayAssignedHomework() {
    homework = JSON.parse(localStorage.getItem('homework')) || [];
    const dropdown = document.getElementById('sort-homework-dropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex].value;

    if (selectedOption === 'dueDate') {
        homework.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (selectedOption === 'class') {
        homework.sort((a, b) => a.class.localeCompare(b.class));
    } else if (selectedOption === 'name') {
        homework.sort((a, b) => a.name.localeCompare(b.name));
    }

    const container = document.getElementById('uncompleted-homework');
    container.innerHTML = '';

    if (homework.length === 0) {
        container.innerHTML = '<h1 style="text-align: center;">No homework assigned.</h1>';
        return;
    }

    homework.forEach(hw => {
        const div = document.createElement('div');
        div.classList.add('homework-item');
        div.dataset.id = hw.id;
        div.innerHTML = `
            <button class="complete-btn material-symbols-rounded">check</button>
            <div>
                <strong class="hw-name">${hw.name}</strong>
                <p class="hw-subject">${hw.class}</p>
            </div>
            <p class="hw-desc">${hw.description}</p>
            <p class="hw-dueDate">${formatDateTime(hw.dueDate)}</p>
        `;
        container.appendChild(div);
    });
}

function displayCompletedHomework() {
    finishedHomework = JSON.parse(localStorage.getItem('finishedHomework')) || [];
    const dropdown = document.getElementById('sort-homework-dropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex].value;

    if (selectedOption === 'dueDate') {
        finishedHomework.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (selectedOption === 'class') {
        finishedHomework.sort((a, b) => a.class.localeCompare(b.class));
    } else if (selectedOption === 'name') {
        finishedHomework.sort((a, b) => a.name.localeCompare(b.name));
    }

    const container = document.getElementById('completed-homework');
    container.innerHTML = '';

    if (finishedHomework.length === 0) {
        if (showCompleted == true) {
            document.getElementById('completed-homework').innerHTML = '<h1 style="text-align: center;">No homework completed.</h1>';
        }
        return;
    }

    finishedHomework.forEach(hw => {
        const div = document.createElement('div');
        div.classList.add('completed-item');
        div.dataset.id = hw.id;
        if (showCompleted == false) {
            div.classList.add('hidden-item');
        }
        div.innerHTML = `
            <button class="restore-btn material-symbols-rounded">refresh</button>
                <button class="delete-btn material-symbols-rounded">delete</button>
            <div>
                <strong class="hw-name">${hw.name}</strong>
                <p class="hw-subject">${hw.class}</p>
            </div>
            <p class="hw-desc">${hw.description}</p>
            <p class="hw-dueDate">${formatDateTime(hw.dueDate)}</p>
        `;
        container.appendChild(div);
    });
}

function toggleCompletedHomework() {
    const button = document.getElementById('toggle-completed-button');
    if (button.textContent === 'Show Completed') {
        button.textContent = 'Hide Completed';
        showCompleted = true;
        displayCompletedHomework();
    } else {
        button.textContent = 'Show Completed';
        showCompleted = false;
        displayCompletedHomework();
    }
}

function setCompletedHomework(boolean) {
    const button = document.getElementById('toggle-completed-button');
    if (boolean) {
        button.textContent = 'Hide Completed';
        showCompleted = true;
        displayCompletedHomework();
    } else {
        button.textContent = 'Show Completed';
        showCompleted = false;
        displayCompletedHomework();
    }
}


// handle all button clicks
document.getElementById('homework-container').addEventListener('click', event => {
    // complete homework
    // thanks to chatgpt for helping me out with uids
    if (event.target.classList.contains('complete-btn')) {
        const item = event.target.closest('.homework-item');
        if (!item) return;
        const id = item.dataset.id;
        const idx = homework.findIndex(hw => String(hw.id) === String(id));
        if (idx !== -1) {
            const [completed] = homework.splice(idx, 1);
            completed.completedAt = new Date().toISOString();
            finishedHomework.push(completed);
            localStorage.setItem('homework', JSON.stringify(homework));
            localStorage.setItem('finishedHomework', JSON.stringify(finishedHomework));
            setCompletedHomework(true);
            displayAssignedHomework();
            displayCompletedHomework();
        }
        return;
    }

    // restore finished homework
    if (event.target.classList.contains('restore-btn')) {
        const item = event.target.closest('.completed-item');
        if (!item) return;
        const id = item.dataset.id;
        const idx = finishedHomework.findIndex(hw => String(hw.id) === String(id));
        if (idx !== -1) {
            const [restored] = finishedHomework.splice(idx, 1);
            delete restored.completedAt;
            homework.push(restored);
            localStorage.setItem('homework', JSON.stringify(homework));
            localStorage.setItem('finishedHomework', JSON.stringify(finishedHomework));
            document.getElementById('toggle-completed-button').textContent = 'Show Completed';
            displayAssignedHomework();
            displayCompletedHomework();
        }
        return;
    }

    // delete finished homework permanently
    if (event.target.classList.contains('delete-btn')) {
        const item = event.target.closest('.completed-item');
        if (!item) return;
        const id = item.dataset.id;
        const idx = finishedHomework.findIndex(hw => String(hw.id) === String(id));
        if (idx !== -1) {
            finishedHomework.splice(idx, 1);
            localStorage.setItem('homework', JSON.stringify(homework));
            localStorage.setItem('finishedHomework', JSON.stringify(finishedHomework));
            displayCompletedHomework();
        }
        return;
    }
});

document.getElementById('sort-homework-dropdown').addEventListener('change', displayAssignedHomework);

document.getElementById('toggle-completed-button').addEventListener('click', toggleCompletedHomework);

displayAssignedHomework();
displayCompletedHomework();