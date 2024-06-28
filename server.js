require('dotenv').config();
const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const { Deepgram } = require('@deepgram/sdk');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

app.post('/transcribe', async (req, res) => {
  try {
    const { url } = req.body;
    
    // Get video info
    const videoInfo = await ytdl.getInfo(url);
    const title = videoInfo.videoDetails.title;
    
    // Get audio stream
    const audioStream = ytdl(url, { quality: 'lowestaudio' });
    
    // Transcribe with Deepgram
    const response = await deepgram.transcription.preRecorded(
      { stream: audioStream },
      { punctuate: true, language: 'en-US' }
    );
    
    const transcript = response.results.channels[0].alternatives[0].transcript;
    
    res.json({ title, transcript });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
