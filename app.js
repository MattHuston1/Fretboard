const root = document.documentElement

const fretboard = document.querySelector('.fretboard')
const tabs = document.querySelector('.tabs')
const selectedInstrumentSelector = document.querySelector('#instrument-selector')
const accidentalSelector = document.querySelector('.accidental-selector')
const numOfFretsSelector = document.querySelector('#number-of-frets')
const showAllNotesSelector = document.querySelector('#show-all-notes')
const selectedNotes = document.querySelector('.selectedNotes')
const deleteButton = document.querySelector('.deleteButton')
const deleteAllButton = document.querySelector('.deleteAllButton')

let numOfTabNotes = 50
let numOfFrets = 20
const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21]
const doubleFretMarkPositons = [12, 24]
const notesFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
const notesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
let firstNote = 0

let accidentals = 'flats';
const instrumentTuningPresets = {
  'Guitar': [4, 11, 7, 2, 9, 4],
  'Bass (4 Strings)': [7, 2, 9, 4],
  'Bass (5 Strings)': [7, 2, 9, 4, 11],
  'Ukulele': [9, 4, 0, 7],
  'Violin/Mandolin': [4, 9, 2, 7]
}

let selectedInstrument = 'Guitar'
let numOfStrings = instrumentTuningPresets[selectedInstrument].length

const app = {
  init() {
    this.setupFretboard()
    this.setupEventListeners()
    this.setupSelectedInstrumentSelector()
    this.setupTabs()
  },
  setupFretboard() {
    fretboard.innerHTML = ''
    root.style.setProperty('--number-of-strings', numOfStrings)
    //add strings to fretboard
    for (let i = 0; i < numOfStrings; i++) {
      let string = tools.createElement('div')
      // string.id = i ++
      string.classList.add('string')
      string.setAttribute('id', i)
      fretboard.appendChild(string)

      //create frets
      for (let fret = 0; fret <= numOfFrets; fret++) {
        let noteFret = tools.createElement('div')
        noteFret.classList.add('noteFret')
        noteFret.setAttribute('id', i + '_' + fret)
        string.appendChild(noteFret)

        let noteName = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]), accidentals)
        noteFret.setAttribute('data-note', noteName)

        //add single fret marks
        if (i == 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
          noteFret.classList.add('singleFretmark')
        }
        //add double fret marks
        if (i == 0 && doubleFretMarkPositons.indexOf(fret) !== -1) {
          let doubleFretMark = tools.createElement('div')
          doubleFretMark.classList.add('doubleFretmark')
          noteFret.appendChild(doubleFretMark)
        }
      }
    }
  },
  setupTabs() {
    // tabs.innerHTML = ''
    root.style.setProperty('--number-of-strings', numOfStrings)
    for (let i = 0; i < numOfStrings; i++) {
      let string = tools.createElement('div')
      string.classList.add('tabString')
      string.setAttribute('id', 'tabString' + i)
      tabs.appendChild(string)
      for (let j = 0; j < numOfTabNotes; j++) {
        let note = tools.createElement('div')
        note.classList.add('tabNote')
        note.setAttribute('id', i + '-' + j)
        note.textContent = '-'
        string.appendChild(note)
      }
    }
  },
  generateNoteNames(noteIndex, accidentals) {
    noteIndex = noteIndex % 12;
    let noteName;
    if (accidentals === 'flats') {
      noteName = notesFlat[noteIndex];
    } else if (accidentals === 'sharps') {
      noteName = notesSharp[noteIndex];
    }
    return noteName;
  },
  setupSelectedInstrumentSelector() {
    for (instrument in instrumentTuningPresets) {
      let instrumentOption = tools.createElement('option', instrument)
      selectedInstrumentSelector.appendChild(instrumentOption)
    }
  },
  showNoteDot(event) {
    if (event.target.classList.contains('noteFret')) {
      event.target.style.setProperty('--note-dot-opacity', 1)
    }
  },
  hideNoteDot(event) {
    // console.log(event.target.onclick)
    // if (fretboard.clicked == false) {
    event.target.style.setProperty('--note-dot-opacity', 0)

    // }
  },
  setupEventListeners() {
    fretboard.addEventListener('mouseover', this.showNoteDot)
    fretboard.addEventListener('mouseout', this.hideNoteDot)
    fretboard.addEventListener('click', (event) => {
      let noteSelected = tools.createElement('h1')
      // console.log(event)
      let noteID = event.target.id
      noteSelected.textContent = event.target.dataset.note
      noteSelected.setAttribute('id', event.target.offsetParent.id)
      noteSelected.classList.add('noteSelected')
      selectedNotes.appendChild(noteSelected)
      let tabNoteID = `${noteID.split('_')[0]}-${firstNote++}`
      let nextNote = document.getElementById(tabNoteID)
      for (let i = 0; i < tabs.children.length; i++) {
        let strings = tabs.children[i]
        for (let j = 0; j < strings.children.length; j++) {
          let notes = strings.children[j]
          if (noteID.split('_')[0] == notes.id.split('-')[0] && noteID.split('_')[1] == notes.id.split('-')[1]) {
              nextNote.textContent = noteID.split('_')[1]
            }
          }
        }
    })
    deleteButton.addEventListener('click', (event) => {
      // selectedNotes.removeChild(selectedNotes.lastChild)
      if (selectedNotes.hasChildNodes()) {
        selectedNotes.removeChild(selectedNotes.lastChild)
      } else {
        console.log('What are you trying to delete?')
      }
    })
    deleteAllButton.addEventListener('click', (event) => {
      if (selectedNotes.hasChildNodes()) {
        selectedNotes.textContent = ''
      } else {
        console.log('What are you trying to delete?')
      }
    })
    selectedInstrumentSelector.addEventListener('change', (event) => {
      selectedInstrument = event.target.value
      numOfStrings = instrumentTuningPresets[selectedInstrument].length
      this.setupFretboard()
    })
    accidentalSelector.addEventListener('click', (event) => {
      if (event.target.classList.contains('acc-select')) {
        accidentals = event.target.value
        this.setupFretboard()
      } else {
        return;
      }
    })
    numOfFretsSelector.addEventListener('change', () => {
      numOfFrets = numOfFretsSelector.value
      this.setupFretboard()
    })
    showAllNotesSelector.addEventListener('change', () => {
      if (showAllNotesSelector.checked) {
        root.style.setProperty('--note-dot-opacity', 1)
        fretboard.removeEventListener('mouseover', this.showNoteDot)
        fretboard.removeEventListener('mouseout', this.hideNoteDot)
        this.setupFretboard()
      } else {
        root.style.setProperty('--note-dot-opacity', 0)
        fretboard.addEventListener('mouseover', this.showNoteDot)
        fretboard.addEventListener('mouseout', this.hideNoteDot)
        this.setupFretboard()
      }
    })

  }
}

const tools = {
  createElement(element, content) {
    element = document.createElement(element)
    if (arguments.length > 1) {
      element.innerHTML = content
    }
    return element
  }
}

app.init()