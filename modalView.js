import View from './View.js'

class ModalView extends View {
  _parentElement = document.querySelector('body')

  _generateMarkup(answer, idx) {
    console.log(answer)
    if (answer === this._data[idx].correct_answer.normalize()) {
      return `
      <div class="modal">
        <div class="modal__check">
            <p class="check right">Right!</p>
            <button class="btn__start close-modal">next question</button>
        </div>
    </div>
      `
    }

    return `
    <div class="modal">
        <div class="modal__check">
            <p class="check wrong">Wrong!</p>
            <p class="check-text">
            The correct answer is:
            <span class="correct-answer"
                >${this._data[idx].correct_answer}</span
            >
            </p>
            <button class="btn__start close-modal">next question</button>
        </div>
    </div>
      `
  }
}

export default new ModalView()
