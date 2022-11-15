var forge = require('node-forge');

//generate keypair and get values of n,e,d,p,q
var rsa = forge.pki.rsa
var keypair = rsa.generateKeyPair({bits: 512, e:65537})
var n = (keypair.publicKey.n)
var e = (keypair.publicKey.e)
var d = (keypair.privateKey.d)
var p = (keypair.privateKey.p)
var q = (keypair.privateKey.q)

// console.log("keypair: ",keypair)
// console.log("public key: ", keypair.publicKey)
// console.log("private key: ", keypair.privateKey)
//  console.log("p = "+BigInt(p.toString(10)))
//  console.log("q = "+BigInt(q.toString(10)))
// console.log("e = "+e.toString(16))
// console.log("d = "+d.toString(16))
e = BigInt(e.toString(10))
p = BigInt(p.toString(10))
q = BigInt(q.toString(10))
d = BigInt(d.toString(10))
// console.log((BigInt(e.toString(10))*BigInt(d.toString(10)))%((p-BigInt('1'))*(q-BigInt('1'))))


//do 4 tests to check RSA is legit
console.log("RSA test begin:")

console.log("test 1, n==p*q: ", n==p*q)

const phi_n = (p-BigInt(1))*(q-BigInt(1))
console.log("test 2, (e*d)mod(phi(n)) == 1: ", (e*d)%phi_n==1)

console.log("test 3, gcd(e,phi(n))==1: ", Euclid_algo(phi_n,e)==BigInt(1))
function Euclid_algo(m,n){
    var r = 0
    do{
        var r = m%n
        m = n
        n = r
    }while(r!=0)
    return m
}

console.log("test 4: Using RSA keypair p,q,e,d,n to encrypt randomise plaintext")
var M = forge.random.getBytesSync(10)
M = BigInt('0x'+forge.util.bytesToHex(M))
// console.log("plaintext = ", M)

var c = (M**e)%(p*q)
// console.log(c)
function expmod( base, exp, mod ){
    if (exp == BigInt(0)) return BigInt(1);
    if (exp % BigInt(2) == BigInt(0)){
      return (expmod( base, (exp / BigInt(2)), mod)** BigInt(2)) % mod;
    }
    else {
      return (base * expmod( base, (exp - BigInt(1)), mod)) % mod;
    }
  }
// console.log("decrypted text = ", expmod(c, d, p*q))
console.log("plaintext==decrypted text: ", expmod(c, d, p*q)==M)