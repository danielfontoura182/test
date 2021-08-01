import View from './View.js';

class FinalModalView extends View {
  _parentElement = document.querySelector('body');

  _generateMarkup(total, score) {
    return `
    <div class="modal">
        <div class="modal__check">
            <p class="thanks-message">Thank you for playing!</p>
            <p class="
             score-message">
            Your score:
            <span class="${score > 5 ? 'positive-score' : 'negative-score'}"
                >${score}</span
            >/${total}
            </p>
            <button class="btn__start close-modal play-again">click to play again</button>  
        </div>
    </div>
      `;
  }

  render(total, score) {
    const markup = this._generateMarkup(total, score);
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
}

export default new FinalModalView();
