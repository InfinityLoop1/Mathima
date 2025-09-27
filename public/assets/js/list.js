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
    // store previous IDs to detect new items
    const prevItems = Array.from(container.querySelectorAll('.homework-item'));
    const prevIds = prevItems.map(div => div.dataset.id);

    container.innerHTML = '';

    if (homework.length === 0) {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = `<h1>No assignments due. You're all caught up!</h1>`;
        msgDiv.style.opacity = '0';
        msgDiv.style.height = '60px';
        container.appendChild(msgDiv);
        setTimeout(() => {
            msgDiv.style.transition = 'opacity 0.2s';
            msgDiv.style.opacity = '1';
        }, 10);
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

        if (new Date(hw.dueDate) < new Date()) {
            if (localStorage.getItem("animationsEnabled") === null) {
                localStorage.setItem("animationsEnabled", "true");
                div.getElementsByClassName('hw-dueDate')[0].classList.add('late');
            } else if (localStorage.getItem("animationsEnabled") === "true") {
                div.getElementsByClassName('hw-dueDate')[0].classList.add('late');
            } else {
                div.getElementsByClassName('hw-dueDate')[0].classList.add('late-no-anim');
            }
            
        }

        // fade in if it's a new item
        if (!prevIds.includes(String(hw.id))) {
            div.style.opacity = '0';
            div.style.transition = 'opacity 0.2s';
            container.appendChild(div);
            setTimeout(() => {
                div.style.opacity = '1';
            }, 200);
        } else {
            container.appendChild(div);
        }
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
    // Store previous IDs to detect new items
    const prevItems = Array.from(container.querySelectorAll('.completed-item'));
    const prevIds = prevItems.map(div => div.dataset.id);
    const wasHidden = prevItems.length && prevItems[0].classList.contains('hidden-item');

    // Fade out if toggled off
    if (showCompleted === false && prevItems.length) {
        prevItems.forEach(div => {
            div.style.transition = 'opacity 0.2s';
            div.style.opacity = '0';
        });
        setTimeout(() => {
            container.innerHTML = '';
        }, 200);
        return;
    }

    container.innerHTML = '';

    if (finishedHomework.length === 0) {
        if (showCompleted == true) {
            const completedContainer = document.getElementById('completed-homework');
            const msgDiv = document.createElement('div');
            msgDiv.innerHTML = `<h1>No assignments completed.</h1>`;
            msgDiv.style.opacity = '0';
            msgDiv.style.height = '60px';
            completedContainer.innerHTML = '';
            completedContainer.appendChild(msgDiv);
            setTimeout(() => {
                msgDiv.style.transition = 'opacity 0.2s';
                msgDiv.style.opacity = '1';
            }, 10);
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
        // Fade in if toggled on
        if (showCompleted == true && wasHidden) {
            div.style.opacity = '0';
            container.appendChild(div);
            setTimeout(() => {
                div.style.transition = 'opacity 0.2s';
                div.style.opacity = '1';
            }, 10);
        } else if (!prevIds.includes(String(hw.id)) && showCompleted == true) {
            div.style.opacity = '0';
            container.appendChild(div);
            setTimeout(() => {
                div.style.transition = 'opacity 0.2s';
                div.style.opacity = '1';
            }, 200);
        } else {
            container.appendChild(div);
        }
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
            item.style.opacity = '0';
            for (let i = idx; i < homework.length; i++) {
                const itemDiv = document.querySelector(`.homework-item[data-id="${homework[i].id}"]`);
                if (itemDiv) {
                    itemDiv.style.transform = 'translateY(-60px)';
                    setTimeout(() => {
                        itemDiv.style.transform = '';
                    }, 500);
                }
            }
            setTimeout(() => {
                displayAssignedHomework();
                displayCompletedHomework();
            }, 300);
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
            item.style.opacity = '0';
            for (let i = idx; i < finishedHomework.length; i++) {
                const itemDiv = document.querySelector(`.completed-item[data-id="${finishedHomework[i].id}"]`);
                if (itemDiv) {
                    itemDiv.style.transform = 'translateY(-60px)';
                    setTimeout(() => {
                        itemDiv.style.transform = '';
                    }, 500);
                }
            }
            setTimeout(() => {
                displayAssignedHomework();
                displayCompletedHomework();
            }, 500);
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
            item.style.transition = 'opacity 0.2s';
            item.style.opacity = '0';
            setTimeout(() => {
                item.remove();
                displayCompletedHomework();
            }, 200);
            
        }
        return;
    }
});

document.getElementById('sort-homework-dropdown').addEventListener('change', displayAssignedHomework);

document.getElementById('toggle-completed-button').addEventListener('click', toggleCompletedHomework);

displayAssignedHomework();
displayCompletedHomework();