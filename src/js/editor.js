const noteText = document.querySelector('.form__text--js');
const notesSection = document.querySelector('.notes--js');
const notesList = document.querySelector('.notes__list--js');
const pageCounter = document.querySelector('.counter--js');
const swiper = new Hammer(notesList);
const arrowLeft = document.querySelector('.navigation__left-btn--js');
const arrowRight = document.querySelector('.navigation__right-btn--js');
let notesItems = [];

// --------------------------------------------------------------------
// Notes
// --------------------------------------------------------------------
const isEmpty = () => {
  if (String(noteText.value) !== '') {
    return false;
  } else {
    return true;
  }
};

// --------------------------------------------------------------------
const myStorage = () => {
  let myArray;
  if (localStorage.getItem('notes') !== null) {
    return (myArray = JSON.parse(localStorage.getItem('notes')));
  } else {
    return (myArray = []);
  }
};

// --------------------------------------------------------------------
const setListItems = () => {
  notesItems = document.querySelectorAll('.notes__item--js');
};

// --------------------------------------------------------------------
const addListener = () => {
  notesItems.forEach(item => {
    item
      .querySelector('.options-panel__edit-btn--js')
      .addEventListener('click', editNote);
    item
      .querySelector('.options-panel__edit-btn--js')
      .addEventListener('keypress', editNote);
    item
      .querySelector('.options-panel__del-btn--js')
      .addEventListener('click', removeNote);
    item
      .querySelector('.options-panel__del-btn--js')
      .addEventListener('keypress', removeNote);
  });
};

// --------------------------------------------------------------------
const clearList = () => {
  const listItems = document.querySelectorAll('.notes__item--js');
  listItems.forEach(listItem => {
    listItem.remove();
  });
};

// --------------------------------------------------------------------
const loadNote = () => {
  const notes = myStorage();

  if (notes.length > 0) {
    notes.forEach((note, index) => {
      let page = index + 1;
      let listItem = `
        <li class="notes__item ${index == 0 ? 'notes__item--active' : ''}
          notes__item--js">
          <div class="options-panel">
            <button
              class="options-panel__btn options-panel__del-btn--js"
              note="${note.id}"
            >
              <img
                src="assets/images/icon-delete.svg"
                alt="button edit"
                class="options-panel__icon"
                note="${note.id}"
              />
            </button>
            <button
              class="options-panel__btn options-panel__edit-btn--js"
              note="${note.id}"
            >
              <img
                src="assets/images/icon-edit.svg"
                alt="button edit"
                class="options-panel__icon"
                note="${note.id}"
              />
            </button>
          </div>
          <p class="notes__content notes__content--js">
            ${note.text}
          </p>
          <footer class="notes-footer">
            <p class="notes-footer__date">
              ${note.saveAt}
            </p>
            <p class="notes-footer__page-number">
              ${page++}
            </p>
          </footer>
        </li>
        `;
      notesList.insertAdjacentHTML('beforeend', listItem);
    });

    setListItems();
    addListener();
    pageCounter.innerHTML = `notes ${notes.length}`;
    notesSection.classList.add('notes--show');
  } else {
    notesSection.classList.remove('notes--show');
  }
};

// --------------------------------------------------------------------
const saveNote = () => {
  const notes = myStorage();

  if (!isEmpty()) {
    if (noteText.attributes.note.value === '') {
      let note = {
        id: Date.now(),
        text: noteText.value,
        saveAt: new Date().toString().slice(0, 24),
      };

      notes.push(note);
      localStorage.setItem('notes', JSON.stringify(notes));
      clearList();
      loadNote();
    } else {
      const noteId = noteText.attributes.note.value;
      const theNoteIndex = notes.findIndex(note => note.id == noteId);

      notes[theNoteIndex].text = noteText.value;
      notes[theNoteIndex].saveAt = new Date().toString().slice(0, 24);

      noteText.attributes.note.value = '';
      localStorage.setItem('notes', JSON.stringify(notes));
      clearList();
      loadNote();
    }

    noteText.value = '';
  }
};

// --------------------------------------------------------------------
const editNote = event => {
  event.preventDefault();

  if (
    event.type === 'click' ||
    (event.type === 'keypress' && event.key === 'Enter')
  ) {
    const notes = myStorage();
    const noteId = event.target.attributes.note.value;
    const theNoteIndex = notes.findIndex(note => note.id == noteId);

    noteText.value = notes[theNoteIndex].text;
    noteText.attributes.note.value = noteId;

    localStorage.setItem('notes', JSON.stringify(notes));
    noteText.focus({preventScroll: false});
  }
};

// --------------------------------------------------------------------
const removeNote = event => {
  event.preventDefault();

  if (
    event.type === 'click' ||
    (event.type === 'keypress' && event.key === 'Enter')
  ) {
    const notes = myStorage();
    const noteId = event.target.attributes.note.value;
    const theNoteIndex = notes.findIndex(note => note.id == noteId);
    const listItem = event.composedPath()[3];

    moveRight();
    notes.splice(theNoteIndex, 1);
    listItem.remove();

    localStorage.setItem('notes', JSON.stringify(notes));
    setListItems();
    pageCounter.innerHTML = `notes ${notes.length}`;
    if (notes.length === 0) {
      loadNote();
    }
  }
};

// --------------------------------------------------------------------
// Slider
// --------------------------------------------------------------------
const moveLeft = () => {
  let newIndex = null;
  notesItems.forEach((slide, index) => {
    if (slide.classList.contains('notes__item--active') && newIndex !== index) {
      slide.classList.remove('notes__item--active');
      if (index === 0) {
        notesItems[notesItems.length - 1].classList.add('notes__item--active');
        newIndex = notesItems.length - 1;
      } else {
        notesItems[index - 1].classList.add('notes__item--active');
        newIndex = index - 1;
      }
    }
  });
};

// --------------------------------------------------------------------
const moveRight = () => {
  let newIndex = null;
  notesItems.forEach((slide, index) => {
    if (slide.classList.contains('notes__item--active') && newIndex !== index) {
      slide.classList.remove('notes__item--active');
      if (index === notesItems.length - 1) {
        notesItems[0].classList.add('notes__item--active');
        newIndex = 0;
      } else {
        notesItems[index + 1].classList.add('notes__item--active');
        newIndex = index + 1;
      }
    }
  });
};

// --------------------------------------------------------------------
swiper.on('swipeleft swiperight', event => {
  if (event.type === 'swipeleft') {
    moveLeft();
  } else {
    moveRight();
  }
});
// --------------------------------------------------------------------
// Event listeners and notes loader
// --------------------------------------------------------------------
noteText.addEventListener('blur', saveNote);
arrowLeft.addEventListener('click', moveLeft);
arrowRight.addEventListener('click', moveRight);
loadNote();
