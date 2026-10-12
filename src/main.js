function renderImages(target, files) {
  console.log(files);
  target.textContent = '';
  (async () => {
    const imageElements = await Promise.all(
      Array.from(files).map(
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
      target.appendChild(imageElement);
    });
  })();
}

document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.querySelector('#textInput');

  const imageArea = document.querySelector('#imageArea');
  const fileInput = document.querySelector('#fileInput');
  fileInput.addEventListener('change', (event) => {
    console.log(event.target.files);
    renderImages(imageArea, event.target.files);
  });

  // 우선 indexedDB를 연결한다.
  let database = null;
  const indexedDBRequest = indexedDB.open('koishiDB', 2);
  indexedDBRequest.onerror = (event) => {
    alert(`IndexedDB 시작 실패 (${event.target.errorCode})`);
  };
  indexedDBRequest.onsuccess = () => {
    database = indexedDBRequest.result;
    console.log('koishiDB 연결 완료.');
  };

  // 이름이나 버전이 일치하는 데이터베이스가 없는 경우, onupgradeneeded가 호출되며 데이터베이스를 생성한다.
  indexedDBRequest.onupgradeneeded = (event) => {
    database = event.target.result;
    database.createObjectStore('koishiStore', { keyPath: 'id' });
    console.log('koishiStore 생성 완료.');
  };

  const saveToIndexedDBButton = document.querySelector('#saveToIndexedDB');
  saveToIndexedDBButton.addEventListener('click', () => {
    console.log('saving...', textInput.value, fileInput.files);
    const objectStore = database
      ?.transaction('koishiStore', 'readwrite')
      .objectStore('koishiStore');

    if (!objectStore) {
      console.log('오브젝트 스토어가 존재하지 않습니다.');
      return;
    }

    const getRequest = objectStore.get('backup');
    getRequest.onsuccess = (event) => {
      if (!event.target.result) {
        console.log('backup 존재하지 않음. 새로 생성함.');
        objectStore.add({
          id: 'backup',
          text: textInput.value,
          files: fileInput.files,
        });
      } else {
        console.log('backup 존재함. 덮어쓰는 중.');
        const putRequest = objectStore.put({
          id: 'backup',
          text: textInput.value,
          files: fileInput.files,
        });
        putRequest.onsuccess = () => {
          const anotherGetRequest = objectStore.get('backup');
          anotherGetRequest.onsuccess = (event) => {
            console.log('결과:', event.target.result);
          };
        };
      }
    };
  });

  const loadFromIndexedDBButton = document.querySelector('#loadFromIndexedDB');
  loadFromIndexedDBButton.addEventListener('click', () => {
    console.log('loading...');
    const objectStore = database
      ?.transaction('koishiStore', 'readwrite')
      .objectStore('koishiStore');

    if (!objectStore) {
      console.log('오브젝트 스토어가 존재하지 않습니다.');
      return;
    }

    const getRequest = objectStore.get('backup');
    getRequest.onsuccess = (event) => {
      console.log(event.target.result);
      if (!event.target.result) {
        console.log('backup 존재하지 않음.');
        return;
      } else {
        console.log('backup 존재함. 불러오는 중.');
        textInput.value = event.target.result.text;
        fileInput.files = event.target.result.files;
        renderImages(imageArea, event.target.result.files);
      }
    };
  });
});
