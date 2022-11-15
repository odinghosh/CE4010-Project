const { exec } = require('child_process');

var correct = 0;
for(let i=0;i<1000;i++){
    exec('openssl rand -out input.txt -base64 20', (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
      exec('openssl rand -out input.txt -base64 20', (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
}