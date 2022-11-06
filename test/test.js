var forge = require('node-forge');

/*  Use line 6 to randomly create a key
    Use line 7 to test AES-128 example vector
*/
var key = forge.random.getBytesSync(16);
// var key = forge.util.hexToBytes("000102030405060708090a0b0c0d0e0f");

var iv = forge.random.getBytesSync(16);

console.log("key: ",key);
console.log("key in hex: ",forge.util.bytesToHex(key));
console.log("iv: ",iv);
console.log("iv in hex: ",forge.util.bytesToHex(iv));

var cipher = forge.cipher.createCipher('AES-CBC', key);
var decipher = forge.cipher.createDecipher('AES-CBC', key);

/*  Use line 22 to test our example
    Use line 23 to test AES-128 example vector
*/
var plaintext = "Hello World"; 
//var plaintext = "00112233445566778899aabbccddeeff";
console.log("plaintext: ", plaintext);

//encrypt stage
cipher.start({iv:iv});
cipher.update(forge.util.createBuffer(plaintext));
cipher.finish();
var encryptedText = cipher.output;
var encryptedTextBytes = encryptedText.getBytes();
console.log("Encrypted text: ",encryptedText);
console.log("Encrypted text in bytes: ",encryptedTextBytes);

//decrypt stage
decipher.start({iv:iv});
decipher.update(forge.util.createBuffer(encryptedTextBytes));
decipher.finish();
console.log("decrypted text: ",decipher.output.data);
console.log("Output check: ", plaintext==decipher.output.data);