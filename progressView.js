import View from './View.js';

class ProgressView extends View {
  _parentElement = document.querySelector('body');

  _generateMarkup() {
    return `
      <div class="progress">
      <span class="question-number">1</span>/<span class="number-of-questions"
        >${this._data.length}</span
      >
    </div>
      `;
  }
}

export default new ProgressView();
