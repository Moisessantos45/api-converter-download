import Ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";
import ytdl from "ytdl-core";

Ffmpeg.setFfmpegPath(ffmpegInstaller.path);

let video = "./Uploads/video.mp4";
let audio = "./Uploads/music.mp4";
let outputFile = "./Uploads/videoYoutube.mp4";

let carpeta = "./Uploads";

const deleteFiles = () => {
  fs.readdir(carpeta, (err, files) => {
    if (err) throw err;

    files.forEach((archivo) => {
      const rutaArchivo = path.join(carpeta, archivo);

      // Elimina el archivo
      fs.unlink(rutaArchivo, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo ${archivo}:`, err);
        } else {
          console.log(`Archivo ${archivo} eliminado correctamente.`);
        }
      });
    });
  });
};

const convertirMusic = (req, res) => {
  if (req.files.length < 0) {
    return res.status(404).json({ msg: "no hay archivos" });
  }
  const musicaPath = req.files[0].path;
  const output = musicaPath.split(".")[0] + ".mp3";
  Ffmpeg(musicaPath)
    .output(output)
    .on("end", () => {
      console.log("Conversión completada");
      fs.readFile(output, function (err, data) {
        if (err) {
          res.status(404).json({ msg: "archivo no encontrado" });
        } else {
          res.writeHead(200, { "Content-Type": "audio/mpeg" });
          res.end(data, "binary");
          deleteFiles();
        }
      });
    })
    .on("error", function (err) {
      console.error("Error: " + err);
      deleteFiles();
    })
    .run();
};

const descarVideo = (req, res) => {
  const { urlYoutube } = req.body;
  console.log(urlYoutube);
  if (!urlYoutube) {
    return res.status(404).json({ msg: "no hay dato" });
  }
  const url = `http://www.youtube.com/watch?v=${urlYoutube}`;
  ytdl(url, { quality: "highestvideo" })
    .pipe(fs.createWriteStream(video))
    .on("finish", () => {
      // Descarga el audio
      ytdl(url, { quality: "highestaudio" })
        .pipe(fs.createWriteStream(audio))
        .on("finish", () => {
          // Combina el audio y el video
          Ffmpeg()
            .input(video)
            .input(audio)
            .output(outputFile)
            .on("end", () => {
              console.log("Conversión completada");
              fs.readFile(outputFile, function (err, data) {
                if (err) {
                  res.status(404).json({ msg: "archivo no encontrado" });
                } else { 
                  console.log("Video descargado");
                  res.writeHead(200, { "Content-Type": "video/mp4" });
                  res.end(data, "binary");
                  deleteFiles()
                }
              });
            })
            .on("error", function (err) {
              console.error("Error: " + err);
              deleteFiles()
            })
            .run();
        });
    })
    .on("error", function (err) {
      console.error("Error: " + err);
      deleteFiles()
    });
};

export { convertirMusic, descarVideo };
