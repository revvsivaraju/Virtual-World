document.addEventListener('DOMContentLoaded', function() {
  const generateBtn = document.getElementById('generateBtn');
  const promptInput = document.getElementById('prompt');
  const styleSelect = document.getElementById('style');
  const viewerContainer = document.getElementById('viewerContainer');
  const generationStatus = document.getElementById('generationStatus');

  generateBtn.addEventListener('click', function() {
    const prompt = promptInput.value.trim();
    const selectedStyle = styleSelect.value;

    if (prompt === '') {
      alert('Please enter a prompt');
      return;
    }

    viewerContainer.innerHTML = '';
    generationStatus.style.display = 'block';
    generationStatus.textContent = 'Please Wait: Image Generation in Progress...';

    const api_key = 'R01zxX3iRyODyBdRiLB8JroIsogUkwxQG6cPKWjv45z3em2xN07yp2C6772H';
    const webhook_url = 'https://webhook.site/a7c3bcfc-e0f1-4d3b-83a3-894b0598d724';
    const formData = {
      prompt: prompt,
      webhook_url: webhook_url,
      skybox_style_id: selectedStyle,
      return_depth: "true"
    };
    const url = `https://backend.blockadelabs.com/api/v1/skybox?api_key=${api_key}&${new URLSearchParams(formData).toString()}`;

    axios.post(url)
      .then(response => {
        if (response.status === 200) {
          const response_data = response.data;
          console.log('POST Response:');
          console.log(response_data);

          setTimeout(() => {
            const generation_id = response_data.id;
            const get_url = `https://backend.blockadelabs.com/api/v1/imagine/requests/${generation_id}?api_key=${api_key}`;

            axios.get(get_url)
              .then(get_response => {
                if (get_response.status === 200) {
                  const get_response_data = get_response.data;
                  console.log('GET Response:');
                  console.log(get_response_data);

                  const file_url = get_response_data.request.file_url;

                  const scene = document.createElement('a-scene');
                  scene.setAttribute('embedded', true);

                  const image = document.createElement('a-sky');
                  image.setAttribute('src', file_url);
                  image.setAttribute('rotation', '0 180 0');

                  scene.appendChild(image);
                  viewerContainer.appendChild(scene);

                  generationStatus.textContent = 'Image Generated!';
                } else {
                  console.log('GET Request failed.');
                  generationStatus.textContent = 'Failed to generate image';
                }
              })
              .catch(error => {
                console.log('GET Request failed.', error);
                generationStatus.textContent = 'Failed to generate image';
              });
          }, 30000);
        } else {
          console.log('POST Request failed.');
          generationStatus.textContent = 'Failed to generate image';
        }
      })
      .catch(error => {
        console.log('POST Request failed.', error);
        generationStatus.textContent = 'Failed to generate image';
      });
  });
});
