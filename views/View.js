export default class View {
  _data

  render(data, modal = false, answer, idx) {
    if (!data) this.renderError()

    if (modal) {
      this._data = data

      const markup = this._generateMarkup(answer, idx)
      this._parentElement.insertAdjacentHTML('beforeend', markup)
      return
    }

    this._data = data

    const markup = this._generateMarkup()
    this._parentElement.insertAdjacentHTML('beforeend', markup)
  }

  _clear() {
    this._parentElement.innerHTML = ''
  }

  renderError() {
    const markup = `
      <div class="carousel__item">
        <p>Something went wrong. Please, try again.</p>
      </div>
      `

    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderSpinner() {
    const markup = `
    <div class="loader"></div>
    `

    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
}
