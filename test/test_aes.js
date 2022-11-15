var forge = require('node-forge');

/*  Uncomment line 6 to randomly create a key
    Uncomment line 7 to test AES-256 example vector
*/
 var key = forge.random.getBytesSync(32);
// var key = forge.util.hexToBytes("6ed76d2d97c69fd1339589523931f2a6cff554b15f738f21ec72dd97a7330907");

/*  Uncomment line 12 to generate random IV
    Uncomment line 13 to test AES-256 example vector
*/
var iv = forge.random.getBytesSync(16);
// var iv = forge.util.hexToBytes("851e8764776e6796aab722dbb644ace8");

console.log("key in hex: ",forge.util.bytesToHex(key));
console.log("iv in hex: ",forge.util.bytesToHex(iv));

//create cipher and decipher, we DO not want padding so we can check cipher text
var cipher = forge.cipher.createCipher('AES-CBC', key);
cipher.mode.pad = false
var decipher = forge.cipher.createDecipher('AES-CBC', key);

/*  Uncomment line 26 to test our example plaintext
    Uncomment line 27 to test AES-256 example vector
*/
const plaintext = "Hello World"; 
// var plaintext = forge.util.hexToBytes("6282b8c05c5c1530b97d4816ca434762");
console.log("plaintext: ", plaintext);
console.log();

//encrypt stage
//uncomment line 33 and 41 if testing AES-256
// var ciphertext = "6acc04142e100a65f51b97adf5172c41";

cipher.start({iv:iv});
cipher.update(forge.util.createBuffer(plaintext));
cipher.finish();
var encryptedText = cipher.output;
// console.log(encryptedText.data)
console.log("Encrypted text: ", forge.util.bytesToHex(encryptedText.data));
// console.log("Encrypted text==AES-256 official ciphertext: ", forge.util.bytesToHex(encryptedText.data)==ciphertext);
console.log();

//decrypt stage
decipher.start({iv:iv});
decipher.update(forge.util.createBuffer(encryptedText.data));
decipher.finish();

/*  Uncomment line 52 to read our example plaintext
    Uncomment line 53 if testing AES-256 example vector
*/
var decrypt_text = decipher.output.data;
// var decrypt_text = forge.util.bytesToHex(decipher.output.data);
console.log("Decrypted text: ",decrypt_text);
// console.log("Decrypted text==Plaintext: ", plaintext==decrypt_text);