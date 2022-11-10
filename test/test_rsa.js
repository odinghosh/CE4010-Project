var forge = require('node-forge');

/*  Use line 6 to randomly create a key
    Use line 7 to test AES-128 example vector
*/
var rsa = forge.pki.rsa
var keypair = rsa.generateKeyPair({bits: 1024, e:0x10001})
var n = (keypair.publicKey.n).toString()
var e = (keypair.publicKey.e).toString()
const rsaPrivateKey = keypair.privateKey

//console.log(keypair.publicKey)
//console.log(keypair.privateKey)
console.log(n)
console.log(e)