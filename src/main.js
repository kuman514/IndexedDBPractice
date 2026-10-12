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

  const saveToIndexedDBButton = document.querySelector('#saveToIndexedDB');
  saveToIndexedDBButton.addEventListener('click', () => {
    /**
     * @todo
     * indexDB에 저장하기
     */
  });

  const loadFromIndexedDBButton = document.querySelector('#loadFromIndexedDB');
  loadFromIndexedDBButton.addEventListener('click', () => {
    /**
     * @todo
     * indexDB로부터 불러오기
     */
  });
});
