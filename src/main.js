document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.querySelector('#textInput');

  const imageArea = document.querySelector('#imageArea');
  const fileInput = document.querySelector('#fileInput');
  fileInput.addEventListener('change', (event) => {
    console.log(event.target.files);
    imageArea.textContent = '';
    (async () => {
      const imageElements = await Promise.all(
        Array.from(event.target.files).map(
          (file) =>
            new Promise((resolve) => {
              const image = document.createElement('img');
              const fileReader = new FileReader();
              fileReader.addEventListener('load', () => {
                image.src = fileReader.result;
                resolve(image);
              });
              fileReader.readAsDataURL(file);
            }),
        ),
      );
      console.log(imageElements);
      imageElements.forEach((imageElement) => {
        imageArea.appendChild(imageElement);
      });
    })();
  });

  // 우선 indexedDB를 연결한다.
  let database = null;
  const indexedDBRequest = indexedDB.open('koishiDB');
  indexedDBRequest.onerror = (event) => {
    alert(`IndexedDB 시작 실패 (${event.target.errorCode})`);
  };
  indexedDBRequest.onsuccess = () => {
    database = indexedDBRequest.result;
    console.log('koishiDB 연결 완료.');
  };

  const saveToIndexedDBButton = document.querySelector('#saveToIndexedDB');
  saveToIndexedDBButton.addEventListener('click', () => {
    /**
     * @todo
     * indexedDB에 저장하기
     */
  });

  const loadFromIndexedDBButton = document.querySelector('#loadFromIndexedDB');
  loadFromIndexedDBButton.addEventListener('click', () => {
    /**
     * @todo
     * indexedDB로부터 불러오기
     */
  });
});
