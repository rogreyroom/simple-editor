'use strict';

const noteName = document.querySelector('.notes__name--js');
const noteText = document.querySelector('.notes__text--js');
const noteSave = document.querySelector('.notes__btn-save--js');
const noteLoad = document.querySelector('.notes__btn-load--js');

const isEmpty = () => {
  if (String(noteName.value) !== '' && String(noteText.value) !== '') {
    return false;
  } else {
    return true;
  }
};

const myStorage = () => {
  let myArray;
  if (localStorage.getItem('notes') !== null) {
    return (myArray = JSON.parse(localStorage.getItem('notes')));
  } else {
    return (myArray = []);
  }
};

const saveNote = () => {
  if (!isEmpty()) {
    let note = {
      name: noteName.value,
      text: noteText.value,
    };

    let notes = myStorage();
    notes.push(note);

    localStorage.setItem('notes', JSON.stringify(notes));
  }
};

const loadNote = e => {
  e.preventDefault();

  let notes = myStorage();

  if (notes.length > 0) {
    let theNote = notes[notes.length - 1];
    noteName.value = theNote.name;
    noteText.value = theNote.text;
  }
};

noteLoad.addEventListener('click', loadNote);
noteSave.addEventListener('click', saveNote);
