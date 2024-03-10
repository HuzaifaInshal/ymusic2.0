const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath)


const app = express();
const port = 8000;
app.use(cors());

app.get('/fetch/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    console.log('rec');
    downloadAudio(videoId, res);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const downloadAudio = async (videoUrl, res) => {
    try {
        const inputPath = `${ffmpegPath}`;
        const ffprobePath = inputPath.replace(/ffmpeg/g, "ffprobe");

        const videoInfo = await ytdl.getInfo(videoUrl);
        const audioFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audioonly' });

        const audioStream = ytdl(videoUrl, { format: audioFormat });

        const filename = `${videoUrl}.mp3`;
        const filePath = path.resolve("/tmp", filename); // Save to /tmp directory

        const writeStream = fs.createWriteStream(filePath);

        audioStream.pipe(writeStream);
        var dur;
        writeStream.on('finish', () => {
            console.log('audio downloaded successsfully');
            const duration = videoInfo.player_response.videoDetails.lengthSeconds;
            console.log(duration);
            dur = Number(duration);
            dur = dur / 120;
            const main_dur = Math.floor(dur);
            var done_til_now = 0;
            for (i = 1; i <= main_dur; i++) {
                if (i == 1) {
                    ffmpeg(filePath)
                        .inputOptions('-t 120')
                        .output(path.resolve("/tmp", `${videoUrl}${i}.mp3`))
                        .run()
                    done_til_now = 120;
                } else {
                    ffmpeg(filePath)
                        .inputOptions(`-ss ${done_til_now}`)
                        .outputOptions(`-t 120`)
                        .output(path.resolve("/tmp", `${videoUrl}${i}.mp3`))
                        .run();
                    done_til_now += 120;
                }
            }
            if (done_til_now != dur) {
                ffmpeg(filePath)
                    .inputOptions(`-ss ${done_til_now}`)
                    .output(path.resolve("/tmp", `${videoUrl}${i}.mp3`))
                    .run();
            }

            setTimeout(() => {
                console.log('Audio downloaded successfully');
                res.json({ "status": "success", "total_main": main_dur, "name": videoUrl })
            }, 10000)
        });

        writeStream.on('error', (err) => {
            console.error('Error downloading audio:', err);
            res.status(500).send('An error occurred while downloading the audio.');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while processing the request.');
    }
};

app.get('/download', async (req, res) => {
    const audioName = req.query.name;
    res.sendFile(path.resolve("/tmp", `${audioName}.mp3`))
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