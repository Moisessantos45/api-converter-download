import express from "express";
import fs from "fs";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import router from "./Routers/Router.js";
import dotenv from "dotenv";
import cors from "cors";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
app.use(express.json());
dotenv.config();

const dominiosPermitidos = [process.env.FRONTEND_URL];
const opciones = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No Permitido"));
    }
  },
};
app.use(cors(opciones));
app.use("/api", router);

const PORT = process.env.PORT || 4000;

let url =
  "http://www.youtube.com/watch?v=jek99pxYsN0&list=RDjek99pxYsN0&index=1";
let video = "./video.mp4";
let audio = "./audio.mp4";
let output = "./output.mp4";
let mp3 = "./musica.mp3";

// convertir a mp3
// ffmpeg(audio)
//   .output(mp3)
//   .on("end", () => console.log("Conversión completada"))
//   .on("error", function (err) {
//     console.error("Error: " + err);
//   })
//   .run();
// unir video y audio
// ffmpeg()
//   .input(video)
//   .input(audio)
//   .output(output)
//   .on("end", () => console.log("Unión completada"))
//   .on("error", function (err) {
//     console.error("Error: " + err);
//   })
//   .run();

//descargar un video y unir audio
//highestvideo
// ytdl(url, { quality: 'highestvideo' })
// ytdl(url, {
//   filter: (format) => format.qualityLabel === "1080p",
// })
//   .pipe(fs.createWriteStream(video))
//   .on("finish", () => {
//     // Descarga el audio
//     ytdl(url, { quality: "highestaudio" })
//       .pipe(fs.createWriteStream(audio))
//       .on("finish", () => {
//         // Combina el audio y el video
//         ffmpeg()
//           .input(video)
//           .input(audio)
//           .output(output)
//           .on("end", () => console.log("Conversión completada"))
//           .on("error", function (err) {
//             console.error("Error: " + err);
//           })
//           .run();
//       });
//   });

//saber la calidad de video
// ytdl.getInfo(url, (err, info) => {
//   if (err) throw err;
//   const formats = info.formats;

//   // Filtrar solo los formatos de video
//   const videoFormats = formats.filter(format => format.hasVideo);

//   // Encontrar la calidad máxima
//   const maxQuality = videoFormats.reduce((max, format) => (format.quality > max ? format.quality : max), 0);

//   console.log('Calidad máxima disponible:', maxQuality);
// });

//saber la calidad de audio
// ytdl.getInfo(url, (err, info) => {
//   if (err) throw err;
//   console.log(info)
//   let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
//   let maxBitrateFormat = audioFormats.reduce((prev, curr) => {
//     return curr.audioBitrate > prev.audioBitrate ? curr : prev;
//   });
//   console.log(
//     `La calidad máxima de audio es ${maxBitrateFormat.audioBitrate} kbps`
//   );
// });

//saber el titulo
// ytdl.getInfo(url, (err, info) => {
//   if (err) throw err;
//   console.log(info.videoDetails.title);
// });

app.listen(PORT, () => {
  console.log(`Servidor conectado ${PORT}`);
});
