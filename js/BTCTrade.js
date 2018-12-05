window.onload = function() {
  //TODO:
  document.getElementById("getAddBtn").addEventListener("click", event => {
    var privKey = $("#privKey").val()
    var network
    var select_network = $("select[name=networks]").val()

    if (select_network == "testnet") {
      var network = bitcoinjs.bitcoin.networks.testnet
    } else if (select_network == "mainnet") {
      var network = bitcoinjs.bitcoin.networks.mainnet
    }

    console.log(window[network])
    var keyPair = bitcoinjs.bitcoin.ECPair.fromWIF(privKey, network)

    $("#address").text(keyPair.getAddress())
    console.log("address: " + keyPair.getAddress())
    console.log(keyPair)

    // test balance: 0.085(8,500,000)
    // output1: 2N2BschCwZSD1kmfNyTqkGTNchBLgrABEiK (200,000)
    // output2: self (8,300,000)

    var tx = new bitcoinjs.bitcoin.TransactionBuilder(network)
    // FIXME: input은 서버에서 unspent output가져와야 함
    tx.addInput("58cf9d764331f5c4c36982922e64ba6573f775af4736e590858bb252e7eecba3", 1)

    tx.addOutput("2N2BschCwZSD1kmfNyTqkGTNchBLgrABEiK", toSatoshi(0.002))
    tx.addOutput(keyPair.getAddress(), toSatoshi(0.08))

    // get the raw tx
    var beforeSign = tx.buildIncomplete().toHex()
    console.log(beforeSign)

    ////////////////////////////////여기까지 Server///////////////////////////////////////////////////////////////

    //FIXME: native에서 해당 기능 offline singing으로 구현해야 함
    var tx2 = new bitcoinjs.bitcoin.TransactionBuilder.fromTransaction(
      bitcoinjs.bitcoin.Transaction.fromHex(beforeSign),
      network
    )

    console.log(tx2)
    tx2.sign(0, keyPair)

    $("#tx").text(tx2.build().toHex())
    console.log(tx2.build().toHex())
  })
}

var toSatoshi = btc => {
  return btc * 100000000
}
