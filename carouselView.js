import View from "./View.js";

class CarouselView extends View {
  _parentElement = document.querySelector(".carousel");

  _generateMarkup() {
    const markup = this._data
      .map((q, idx) => {
        const answers = q.incorrect_answers;
        answers.push(q.correct_answer);
        return `
        <div class="carousel__item" data-id="${idx}">
          <div class="carousel__info">
            <div class="carousel__category">${q.category}</div>
            <div class="carousel__difficulty">${q.difficulty}</div>
          </div>
          <p class="carousel__text">
            ${q.question}
          </p>
          <div class="carousel__answers">
            ${answers
              .sort()
              .map((a) => `<span class= "answer"> ${a} </span>`)
              .join("")}
          </div>
        </div>
        `;
      })
      .join("");

    return markup;
  }

  handleHandler(handler) {
    window.addEventListener("load", handler);
  }
}

export default new CarouselView();
