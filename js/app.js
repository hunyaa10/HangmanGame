const keyBoard = document.querySelector(".keyboard");
const wordDisplay = document.querySelector(".word-display");

let currentWord;

const hangmanImage = document.querySelector(".hangman-box img");
const guessesText = document.querySelector(".guesses-text b");
let wrongCount = 0;
const maxCount = 6;

let correctLetters = [];
const gameModal = document.querySelector(".game-modal");

const playAgainBtn = document.querySelector(".play-again");

// 구현순서[5] : 게임 다시하기 버튼
playAgainBtn.addEventListener("click", () => {
  // 페이지 새로고침
  location.reload();
});

// [4] : 게임종료 이벤트
const gameOver = (victory) => {
  // 3. 게임승리와 실패 시 각각 다르게 모달창 표기
  // ? true : false
  const modalText = victory ? `You found the word:` : `The correct word was:`;
  gameModal.querySelector("img").src = `./images/${
    victory ? "victory" : "lost"
  }.gif`;
  gameModal.querySelector("h4").innerText = `${
    victory ? "Congrats!" : "Game Over!"
  }`;
  gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;

  // 2. gameModal에 클래스 부여 : 모달창 보이게
  gameModal.classList.add("show");
};

// 구현순서[2] : 랜덤 정답단어 가져오기
const getRandomWord = () => {
  // 1. 정답파일(word-list.js)을 만들어 랜덤으로 불러온다.
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  console.log(word);

  // 2. 현재 정답단어 지정
  currentWord = word;

  // 3. 정답에 따라 그에 맞는 힌트를 넣는다.
  document.querySelector(".hint-text b").innerText = hint;

  // 4. 단어를 보여줄 li를 생성한다.
  wordDisplay.innerHTML = word
    .split("") // 문자열 나눔
    .map(() => `<li class="letter"></li>`) // 새로운 배열 생성
    .join(""); // 문자 연결
};

// [3] 키보드 클릭 이벤트
const initGame = (button, clickedLetter) => {
  // button = e.target, clickedLetter = String.fromCharCode(i)
  // console.log(button, clickedLetter);

  const wordDisplayList = wordDisplay.querySelectorAll("li");
  // 1. 클릭된 버튼이 알파벳이 현재정답에 포함되어있는지 확인
  if (currentWord.includes(clickedLetter)) {
    [...currentWord].forEach((letter, index) => {
      // 2. 포함되어 있다면 만들어둔 li에 해당 알파벳 삽입
      if (letter === clickedLetter) {
        wordDisplayList[index].innerText = letter;

        // [4]-1. 정답 알파벳을 빈 배열에 추가
        correctLetters.push(letter);
      }
    });
  } else {
    // 3. 알파벳이 포함되어 있지않다면 틀린갯수 +1 & 이미지변경
    wrongCount++;
    // 이미지의 파일명을 수정하여 이미지 변환시킴
    hangmanImage.src = `./images/hangman-${wrongCount}.svg`;
  }
  // 4. 틀린갯수를 표기함
  guessesText.innerText = `${wrongCount} / ${maxCount}`;
  // 5. 버튼 속성 변경(css추가) : 클릭된 키패드 표시
  button.disabled = true;

  // 구현순서[4] : 6번 틀리면 false & 정답일 경우 true
  if (wrongCount === maxCount) return gameOver(false);
  if (correctLetters.length === currentWord.length) return gameOver(true);
};

// 구현순서[1] : 키보드의 버튼만들기
// 1. for문을 사용해 알파벳 A~Z까지 문자열 호출
for (let i = 97; i <= 122; i++) {
  // console.log(String.fromCharCode(i));
  // 알파벳 A~Z까지 문자열 반환

  // 2. 버튼 생성
  const button = document.createElement("button");
  // 3. 생성된 버튼에 문자열 삽입
  button.innerText = String.fromCharCode(i);
  // 4. 키보드에 버튼 삽입
  keyBoard.appendChild(button);

  // 구현순서[3] : 키보드 버튼 클릭 시 이벤트 실행
  button.addEventListener("click", (e) => {
    initGame(e.target, String.fromCharCode(i));
  });
}

getRandomWord();
