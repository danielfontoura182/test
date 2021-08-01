async function getData(category, difficulty) {
  try {
    console.log("get data:", category, difficulty);
    const res = await fetch(
      `https://opentdb.com/api.php?amount=10${
        category ? `&category=${category}` : ""
      }${difficulty ? `&difficulty=${difficulty}` : ""}&encode=base64`
    );

    if (!res.ok)
      throw new Error("Error trying to fetch the quiz questions data.");

    const data = await res.json();
    console.log(data.results);
    return data.results;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const state = {};

//decode base64 characters
function decode(data) {
  data.forEach((q) => {
    q.correct_answer = atob(q.correct_answer);

    q.incorrect_answers = q.incorrect_answers.map((a) => atob(a));

    q.question = atob(q.question);

    q.category = atob(q.category);
    q.difficulty = atob(q.difficulty);
  });
}

export async function loadQuestions(category, difficulty) {
  try {
    const data = await getData(category, difficulty);
    state.questions = data;
    decode(state.questions);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
