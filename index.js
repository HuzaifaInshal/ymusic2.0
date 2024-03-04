const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors')
// const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

// const app = express();
// const port = 8000;
// app.use(cors());

// app.get('/download/:videoId', async (req, res) => {
//     const videoId = req.params.videoId;  
//     console.log('rec');     
//     downloadAudio(videoId,res);
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

// const downloadAudio = async (videoUrl, res) => {
//     try {
//         const videoInfo = await ytdl.getInfo(videoUrl);
//         const audioFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audioonly' });
        
//         const audioStream = ytdl(videoUrl, { format: audioFormat });

//         const filename = "output.mp3";
//         const filePath = path.resolve(__dirname, filename);

//         const writeStream = fs.createWriteStream(filePath);

//         audioStream.pipe(writeStream);

//         writeStream.on('finish', () => {
//             console.log('Audio downloaded successfully');
//             // res.sendFile(filePath, (err) => {
//             //     if (err) {
//             //         console.error('Error sending file:', err);
//             //         res.status(500).send('An error occurred while sending the file.');
//             //     } else {
//             //         console.log('File sent successfully');
//             //         fs.unlink(filePath, (err) => {
//             //             if (err) {
//             //                 console.error('Error deleting file:', err);
//             //             } else {
//             //                 console.log('File deleted successfully');
//             //             }
//             //         });
//             //     }
//             // });
//             res.send('audio maked!!')
//         });

//         writeStream.on('error', (err) => {
//             console.error('Error downloading audio:', err);
//             res.status(500).send('An error occurred while downloading the audio.');
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('An error occurred while processing the request.');
//     }
// };



const mm = require('music-metadata');
const fs = require('fs').promises;

async function getAudioLength(filePath) {
    try {
        const metadata = await mm.parseFile(filePath);
        if (metadata.format && metadata.format.duration) {
            return metadata.format.duration;
        } else {
            throw new Error('Duration not found in metadata');
        }
    } catch (error) {
        throw new Error(`Error getting audio length: ${error.message}`);
    }
}

// Example usage:
const audioFilePath = 'output.mp3'; // Replace with the actual file name
getAudioLength(audioFilePath)
    .then(duration => {
        console.log(`Duration of audio file: ${duration} seconds`);
    })
    .catch(error => {
        console.error(error.message);
    });



//start from beg to 60
// ffmpeg('output.mp3')
//   .inputOptions('-t 60') // 60s
//   .output('output1.mp3')
//   .run()

//from 60 to 120
  // ffmpeg('output.mp3')
  // .inputOptions('-ss 60') // Start from 60 seconds
  // .outputOptions('-t 60') // Duration of 60 seconds
  // .output('output3.mp3')
  // .run();

  //from 60 to end
  // ffmpeg('output.mp3')
  // .inputOptions('-ss 60') // Start from 60 seconds
  // .output('output2.mp3')
  // .run();