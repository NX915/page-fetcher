const request = require('request');
const readline = require('readline');
const fs = require('fs');
// const { stdin } = require('process');
const url = process.argv[2];
const file = process.argv[3];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

request(url, (error, response, body) => {
  if (error) {
    console.log('error:', error); // Print the error if one occurred
    rl.close();
  } else {
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    fs.writeFile(file, body, {encoding: 'utf8', flag: 'wx'}, (err) => {
      if (err && err.errno !== -17) {
        console.log(err);
        rl.close();
      } else if (err && err.errno === -17) {
        rl.question('File exist! enter y to overwrite!  ', (ans) => {
          if (ans === 'y') {
            fs.writeFile(file, body, {encoding: 'utf8'}, (err) => {
              if (err) {
                console.log(err);
                rl.close();
              }
              console.log(`Downloaded and saved ${response.headers['content-length']} bytes to ${file}`);
              rl.close();
            });
          } else {
            console.log('File not saved!');
            rl.close();
          }
        });
      } else {
        console.log(`Downloaded and saved ${response.headers['content-length']} bytes to ${file}`);
        rl.close();
      }
    });
  }
});