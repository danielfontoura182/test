import * as model from './model.js'
import carouselView from './carouselView.js'
import modalView from './modalView.js'
import progressView from './progressView.js'
import finalModalView from './finalModalView.js'

const controllerHelperVariables = {
  carouselItems: null,
  userScore: null,
  current_carousel_question: null,
  current_question: null,
  questionNumber: null,
  progress: null,
}

const bestScoreEl = document.querySelector('.best-score-value')

async function controlQuestions(category, difficulty) {
  try {
    // hide initial screen
    document.querySelector('.carousel__item[data-id="0"]').style.display =
      'none'

    // load spinner
    carouselView.renderSpinner()

    // loading questions
    await model.loadQuestions(category, difficulty)

    // hide spinner
    document.querySelector('.loader').style.display = 'none'

    // rendering questions
    carouselView.render(model.state.questions)

    // positioning questions
    controllerHelperVariables.carouselItems =
      document.querySelectorAll('.carousel__item')
    controllerHelperVariables.carouselItems.forEach((q, idx) => {
      q.style.transform = `translateX(${idx * 100}%)`
    })

    // creating progress element
    progressView.render(model.state.questions)
    controllerHelperVariables.questionNumber =
      document.querySelector('.question-number')
    controllerHelperVariables.progress = document.querySelector('.progress')

    // event listener on next-question and answer click
    const carousel = document.querySelector('.carousel')
    carousel.addEventListener('click', (e) => {
      const target = e.target

      // if user clicks on 'start' or 'next question' in the modal view
      if (target.classList.contains('next-question')) {
        controlNextQuestion()
        return
      }

      // if user clicks in an answer
      if (target.classList.contains('answer')) {
        const carouselItemIdx = +target.closest('.carousel__item').dataset.id
        const answerClicked = target.textContent.trim()
        controlModal(answerClicked, carouselItemIdx)
        controlScore(answerClicked, carouselItemIdx)
        return
      }
    })
    controlNextQuestion()
  } catch (err) {
    carouselView.renderError()
    throw err
  }
}

// move carousel items based on current_carousel_question
function controlMoveCarousel(cur) {
  document.querySelectorAll('.carousel__item').forEach((question, idx) => {
    question.style.transform = `translateX(${(idx - cur) * 100}%)`
  })
}

function updateQuestionNumber() {
  if (
    controllerHelperVariables.current_question ===
    controllerHelperVariables.carouselItems.length - 1
  ) {
    controllerHelperVariables.current_question = 0
    controllerHelperVariables.progress.style.display = 'none'
    return
  }
  setTimeout(() => {
    controllerHelperVariables.current_question++
    controllerHelperVariables.questionNumber.textContent =
      controllerHelperVariables.current_question
    controllerHelperVariables.progress.style.display = 'block'
  }, 300)
}

// control next question based on current_carousel_question
function controlNextQuestion() {
  if (
    controllerHelperVariables.current_carousel_question ===
    controllerHelperVariables.carouselItems.length - 1
  ) {
    controllerHelperVariables.current_carousel_question = 0
  } else {
    controllerHelperVariables.current_carousel_question++
  }

  controlMoveCarousel(controllerHelperVariables.current_carousel_question)
  updateQuestionNumber()
}

function toggleModal(modal) {
  modal.classList.toggle('active-modal')
}

// close the current modal after click
function controlCloseModal(modal, passToNextQuestion = false) {
  toggleModal(modal)
  modal.remove()
  if (passToNextQuestion) controlNextQuestion()
}

// render final modal with score and a button to play again
function controlGameEnd(modalToClose, total, score) {
  controlCloseModal(modalToClose)
  finalModalView.render(total, score)
  const modal = document.querySelector('.modal')
  toggleModal(modal)
  const playAgain = modal.querySelector('.play-again')
  controlBestScore(controllerHelperVariables.userScore)
  playAgain.addEventListener('click', () => {
    window.location.reload()
  })
}

// render and display modal after clicking on an answer
// add close-modal event listener
function controlModal(answer, idx) {
  modalView.render(model.state.questions, true, answer, idx)
  const modal = document.querySelector('.modal')
  toggleModal(modal)
  const closeModal = document.querySelector('.close-modal')
  if (idx === controllerHelperVariables.carouselItems.length - 2) {
    closeModal.addEventListener('click', () => {
      controlGameEnd(
        modal,
        controllerHelperVariables.carouselItems.length - 1,
        controllerHelperVariables.userScore
      )
    })
    return
  }
  closeModal.addEventListener('click', () => {
    controlCloseModal(modal, true)
  })
}

// sum up 1 to userScore variable after every right answer
function controlScore(answer, idx) {
  if (answer === model.state.questions[idx].correct_answer.normalize()) {
    controllerHelperVariables.userScore++
  }
}

// set local storage if there isn't one already
// check if the current round score is greater than the previous one
// if it is, set the new score to the local storage
// set the score to bestScore element
function controlBestScore(score = null) {
  if (+localStorage.getItem('score') < score) {
    localStorage.setItem('score', score)
    return
  }

  if (!localStorage.getItem('score')) {
    localStorage.setItem('score', score)
    return
  }

  bestScoreEl.textContent = localStorage.getItem('score')
}

function init(category, difficulty) {
  controllerHelperVariables.userScore = 0
  controllerHelperVariables.current_carousel_question = 0
  controllerHelperVariables.current_question = 0
  carouselView.handleHandler(controlQuestions(category, difficulty))
}

function prepareInit() {
  controlBestScore()
  const start = document.querySelector('.btn__start')
  start.addEventListener('click', () => {
    const category = document.querySelector('.carousel__select--category')
    const difficulty = document.querySelector('.carousel__select--difficulty')

    init(category.value, difficulty.value)
  })
}

prepareInit()
