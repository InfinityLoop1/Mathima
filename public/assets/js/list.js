// load allat data shit
homework = JSON.parse(localStorage.getItem('homework')) || [];
showCompleted = false;

// assign UIDs if missing
homework.forEach(hw => { if (!hw.id) hw.id = Date.now() + Math.random(); });

function displayAssignedHomework() {
    homework = JSON.parse(localStorage.getItem('homework')) || [];
    const dropdown = document.getElementById('sort-homework-dropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex].value;

    homework = homework.filter(hw => !hw.completedAt);

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
    homework = JSON.parse(localStorage.getItem('homework')) || [];
    const dropdown = document.getElementById('sort-homework-dropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex].value;

    const completedHomework = homework.filter(hw => hw.completedAt);

    if (selectedOption === 'dueDate') {
        completedHomework.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (selectedOption === 'class') {
        completedHomework.sort((a, b) => a.class.localeCompare(b.class));
    } else if (selectedOption === 'name') {
        completedHomework.sort((a, b) => a.name.localeCompare(b.name));
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

    if (completedHomework.length === 0) {
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

    completedHomework.forEach(hw => {
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

// initialize a custom dropdown that syncs with a native select
function initCustomSelect() {
    const select = document.getElementById('sort-homework-dropdown');
    const custom = document.querySelector('.custom-select[data-linked-select="sort-homework-dropdown"]');
    if (!select || !custom) return;

    select.classList.add('visually-hidden');

    const button = custom.querySelector('.custom-select__button');
    const list = custom.querySelector('.custom-select__list');

    const setSelected = (value) => {
        const opt = Array.from(select.options).find(o => o.value === value) || select.options[0];
        select.value = opt.value;

        const li = list.querySelector(`li[data-value="${opt.value}"]`);
        Array.from(list.querySelectorAll('li')).forEach(item => {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        });

        if (li) {
            const icon = li.querySelector('.material-symbols-rounded')?.textContent || '';
            const label = li.textContent.replace(icon, '').trim();
            const iconEl = button.querySelector('.custom-select__icon');
            const labelEl = button.querySelector('.custom-select__label');
            if (iconEl) iconEl.textContent = icon;
            if (labelEl) labelEl.textContent = label;

            li.classList.add('selected');
            li.setAttribute('aria-selected', 'true');
        }

        select.dispatchEvent(new Event('change'));
    };

    setSelected(select.value || select.options[0].value);

    button.addEventListener('click', (e) => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        list.classList.toggle('open', !expanded);
    });

    list.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        setSelected(li.dataset.value);
        button.setAttribute('aria-expanded', 'false');
        list.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
        if (!custom.contains(e.target)) {
            button.setAttribute('aria-expanded', 'false');
            list.classList.remove('open');
        }
    });

    button.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
            const last = list.querySelector('li:last-child');
            last && last.focus();
        }
    });

    Array.from(list.querySelectorAll('li')).forEach(li => {
        li.tabIndex = 0;
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                li.click();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                (li.nextElementSibling || list.querySelector('li')).focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                (li.previousElementSibling || list.querySelector('li:last-child')).focus();
            } else if (e.key === 'Escape') {
                button.focus();
                button.setAttribute('aria-expanded', 'false');
                list.classList.remove('open');
            }
        });
    });
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
            homework.push(completed);
            localStorage.setItem('homework', JSON.stringify(homework));
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

    // restore completed homework
    if (event.target.classList.contains('restore-btn')) {
        const item = event.target.closest('.completed-item');
        if (!item) return;
        const id = item.dataset.id;
        const idx = homework.findIndex(hw => String(hw.id) === String(id));
        if (idx !== -1) {
            const [restored] = homework.splice(idx, 1);
            delete restored.completedAt;
            homework.push(restored);
            localStorage.setItem('homework', JSON.stringify(homework));
            item.style.opacity = '0';
            for (let i = idx; i < homework.length; i++) {
                const itemDiv = document.querySelector(`.completed-item[data-id="${homework[i].id}"]`);
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

    // delete completed homework permanently
    if (event.target.classList.contains('delete-btn')) {
        const item = event.target.closest('.completed-item');
        if (!item) return;
        const id = item.dataset.id;
        const idx = homework.findIndex(hw => String(hw.id) === String(id));
        if (idx !== -1) {
            homework.splice(idx, 1);
            localStorage.setItem('homework', JSON.stringify(homework));
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
// initialize custom select after initial render
initCustomSelect();