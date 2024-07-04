const chatButton = document.querySelector("#chat-button");
const chatText = document.querySelector(".chat-text");
const apiEndpoint = "https://api.openai.com/v1/chat/completions";
 // const api_key = "api-key";

const sectionsMap = {
  번역: "여기에 번역된 텍스트가 표시됩니다.",
  "핵심 정리": "여기에 핵심 정리된 내용이 표시됩니다.",
  "핵심 단어": "여기에 핵심 단어가 표시됩니다.",
  예제: "여기에 예제가 표시됩니다.",
};

// 채팅 보내기 버튼 클릭시
chatButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const message = chatText.value.trim();
  if (!message) return;

  // 입력폼 초기화
  chatText.value = "";
  chatButton.disabled = true;
  updateChatButtonStyle();

  // 로딩중 표시
  const tempMessageElement = addTemporaryMessage();

  const aiResponse = await fetchAIResponse(message);

  // 임시 메시지 요소를 제거하고, 실제 응답으로 메시지 추가
  tempMessageElement.remove();

  // AI 응답을 각 섹션에 표시
  updateSections(aiResponse);

  // 전체 응답을 왼쪽 패널에 표시
  displayOriginalResponse(aiResponse);
});

// OpenAI API 호출 함수
async function fetchAIResponse(prompt) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
                        ## 이름
                        - 언어몰랑

                        ## 인삿말
                        - 안녕하세요! 당신의 외국어 공부 도우미 "언어몰랑"입니다!

                        ## 주제
                        - 외국어 공부 도우미

                        ## 기능
                        1. 텍스트를 주시면 한국어로 번역 해드려요!
                        2. 1줄 요약 정리를 해드려요!
                        3. 핵심 외국어 단어를 골라드리고 그 뜻과 소리 나는 대로의 발음을 한국어로 알려드려요!
                        4. 텍스트와 관련된 외국어 예제 문제를 만들어드려요!
                        - 이것을 모두 알려드립니다!
                        - 1,2,3,4번의 각 기능은 한 줄 띄워서 분리해서 알려줍니다.

                        ## 동기
                        전공 공부는 열심히 하지만 외국어 공부는 소홀히 하는 공대생분들!
                        강의 노트 해석을 못하는 학생분들께!
                        공부를 할때마다 궁금한 점이 많은데 물어볼 사람이 없는 학생분들께!

                        ## 어필
                        여기 10번 물어봐도 친절하게 답해주는 언어몰랑이가 있습니다! 걱정 마세요!

                        ## 응답
                        각 기능은 ##으로 구분해서 대답해드려요.
                    `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  };

  try {
    const response = await fetch(apiEndpoint, requestOptions);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error);
    return "OpenAI API 호출 중 오류 발생";
  }
}

// 로딩중 표시 함수
const addTemporaryMessage = () => {
  const originalResponseElement = document.getElementById("original-response");
  const spinnerElement = document.createElement("img");
  spinnerElement.style.width = "100px";
  spinnerElement.style.height = "100px";
  spinnerElement.src = "./img/spinner.gif"; // 스피너 이미지 경로를 지정하세요
  spinnerElement.className = "spinner";

  originalResponseElement.querySelector("p").innerHTML = ""; // 기존 텍스트 제거
  originalResponseElement.querySelector("p").appendChild(spinnerElement);

  return spinnerElement;
};

// AI 응답을 각 섹션에 표시하는 함수
const updateSections = (response) => {
  // 응답을 각 섹션에 해당하는 부분으로 나누기
  const sections = response.split("##").filter(section => section.trim() !== "");

  // 각 섹션별로 응답을 업데이트
  if (sections[0]) {
    document.getElementById('translation').querySelector('p').innerHTML = sections[0].trim();
  }
  if (sections[1]) {
    document.getElementById('summary').querySelector('p').innerHTML = sections[1].trim();
  }
  if (sections[2]) {
    document.getElementById('keywords').querySelector('p').innerHTML = sections[2].trim();
  }
  if (sections[3]) {
    document.getElementById('examples').querySelector('p').innerHTML = sections[3].trim();
  }
};

// 전체 응답을 왼쪽 패널에 표시하는 함수
const displayOriginalResponse = (response) => {
  const originalResponseElement = document.getElementById("original-response");
  originalResponseElement.querySelector("p").innerText = response;
};

// 섹션 삭제 함수
const deleteSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.querySelector("p").innerHTML = sectionsMap[section.querySelector("h2").textContent] || "";
  }
};

// 입력폼의 내용을 감지하여 버튼 활성화/비활성화
chatText.addEventListener("input", () => {
  chatButton.disabled = !chatText.value.trim();
  updateChatButtonStyle();
});

// 버튼 스타일 업데이트 함수
function updateChatButtonStyle() {
  if (chatButton.disabled) {
    chatButton.style.backgroundColor = "gray";
    chatButton.style.color = "white";
  } else {
    chatButton.style.backgroundColor = "black";
    chatButton.style.color = "white";
  }
}

// 초기 버튼 스타일 업데이트
updateChatButtonStyle();