// import * as chokidar from 'chokidar';

// const file = './data';
// const watcher = chokidar.watch(file,
//   {
//     ignoreInitial: true
//   }); 

// watcher.on('all', (event, path, stats) => {
//   console.log(event, path, stats);
// });

// import promptSync from 'prompt-sync';
// const prompt = promptSync();

// process.on('SIGINT', () => {
//   console.log('Exiting');
//   process.exit();
// });

// while (true) {
//   const cmd = prompt('> ');
//   if(cmd === '')
//   console.log(cmd);
// }

import editor from './textEditor';
import fs from 'fs';

let str = 'Hello this is dog.'

// console.log(JSON.stringify(editor("ceva"), null, 2))


const textbox = editor(str);

textbox.on('data', (text: any) => {
  if(!text?.value) return;
  fs.writeFileSync("programming.txt", text.value);
})
.on('abort', (text: any) => {
  if(!text?.value) return;
  // fs.writeFileSync("programming.txt", text.value);
})
.on('submit', (text: any) => {
  if(!text?.value) return;
  // fs.writeFileSync("programming.txt", text.value);
})

setTimeout(() => {textbox.setText("aAAAAAaaaa")  }, 1000);
setTimeout(() => {textbox.setTextWithoutNotify("it worked")}, 3000);