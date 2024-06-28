document.getElementById('transcribe-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = document.getElementById('youtube-url').value;
    const resultDiv = document.getElementById('result');
    const titleElement = document.getElementById('video-title');
    const transcriptElement = document.getElementById('transcript');
    
    resultDiv.style.display = 'none';
    titleElement.textContent = 'Transcribing...';
    transcriptElement.value = '';
    
    try {
        const response = await fetch('/transcribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            titleElement.textContent = data.title;
            transcriptElement.value = data.transcript;
            resultDiv.style.display = 'block';
        } else {
            throw new Error(data.error || 'An error occurred');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

document.getElementById('copy-button').addEventListener('click', () => {
    const transcriptElement = document.getElementById('transcript');
    transcriptElement.select();
    document.execCommand('copy');
    alert('Transcript copied to clipboard!');
});
