window.onload = function() {
  var mnemonics = { english: new Mnemonic("english") }
  var mnemonic = mnemonics["english"]
  var network = bitcoinjs.bitcoin.networks.bitcoin
  var bip32RootKey

  document.getElementById("generateBtn").addEventListener("click", event => {
    $("#resultDiv").show()
    // 1. First get the language that user select
    var language = $("select[name=language]").val()
    if (!(language in mnemonics)) {
      mnemonics[language] = new Mnemonic(language)
    }
    mnemonic = mnemonics[language]
    var numWords = 12
    var strength = (numWords / 3) * 32
    var buffer = new Uint8Array(strength / 8)

    console.log("numWords: " + numWords)
    console.log("strength: " + strength)
    console.log("buffer: " + buffer + "\n")

    // create secure entropy
    var data = crypto.getRandomValues(buffer)
    console.log("data: " + data)

    var words = mnemonic.toMnemonic(data)
    console.log(words)
    $("#wordResult").text(words)

    calcBip32RootKeyFromSeed(words, $("#passPhrase_gen").val())
    // getBitcoinAddress(words, "")
  })

  document.getElementById("restoreBtn").addEventListener("click", event => {
    $("#resultDiv").show()
    calcBip32RootKeyFromSeed($("#seedPhrase").val(), $("#passPhrase_res").val())
  })

  var calcBip32RootKeyFromSeed = (phrase, passphrase) => {
    // console.log(phrase + " " + passphrase)
    var seed = mnemonic.toSeed(phrase, passphrase)
    bip32RootKey = bitcoinjs.bitcoin.HDNode.fromSeedHex(seed, network)
    $("#bipRootKey").text(JSON.stringify(bip32RootKey))

    // 44, 0, 0, 0 for ethereum testnet | 44, 1, 0, 0 for bitcoin testnet

    // getAddress(44, 0, 0, 0)
    getAddress(44, 1, 0, 0)
    getAddress(44, 60, 0, 0)
    // getEthereumAddress()
  }

  var getAddress = (purpose, coin, account, change) => {
    var path = "m/"
    path += purpose + "'/"
    path += coin + "'/"
    path += account + "'/"
    path += change

    var keyPair = bip32RootKey.keyPair
    var address = keyPair.getAddress().toString()
    var privKey = keyPair.toWIF()
    var pubKey = keyPair.getPublicKeyBuffer().toString("hex")

    // coin:0(BTC)
    if (coin == 0 || coin == 1) {
      $("#btcPath").text(path)
      $("#btcPubKey").text(pubKey)
      $("#btcAddress").text(address)
      $("#btcPrivKey").text(privKey)
    }
    // coin:60(ETH)
    else if (coin == 60) {
      var privKeyBuffer = keyPair.d.toBuffer(32)
      privKey = privKeyBuffer.toString("hex")
      var addressBuffer = ethUtil.privateToAddress(privKeyBuffer)
      var hexAddress = addressBuffer.toString("hex")
      var checksumAddress = ethUtil.toChecksumAddress(hexAddress)
      address = ethUtil.addHexPrefix(checksumAddress)
      privKey = ethUtil.addHexPrefix(privKey)
      pubKey = ethUtil.addHexPrefix(pubKey)

      $("#ethPath").text(path)
      $("#ethPubKey").text(pubKey)
      $("#ethAddress").text(address)
      $("#ethPrivKey").text(privKey)
    }
  }
}
