var forge = require('node-forge');

/*  Use line 6 to randomly create a key
    Use line 7 to test RSA
*/
var rsa = forge.pki.rsa
var keypair = rsa.generateKeyPair({bits: 32, e:0x10001})
var n = (keypair.publicKey.n).toString()
var e = (keypair.publicKey.e).toString()
var d = (keypair.privateKey.d).toString()
const rsaPrivateKey = keypair.privateKey

console.log("keypair: ",keypair)
console.log("public key: ", keypair.publicKey)
console.log("private key: ", keypair.privateKey)
console.log("n = "+n)
console.log("e = "+e)
console.log("d = "+d)
console.log("Wiener's condition: d < "+1/3*n**0.25)