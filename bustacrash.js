crypto = require('crypto'); 
function crashPointFromHash(serverSeed, clientSeed) {
  function divisible(hash, mod) {
    // We will read in 4 hex at a time, but the first chunk might be a bit smaller
    // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
    var val = 0;
    
    var o = hash.length % 4; 
    for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
      val = ((val << 16) + parseInt(hash.substring(i, i+4), 16)) % mod;
    }

    return val === 0;
  }

  var hash = crypto.createHmac('sha256', serverSeed).update(clientSeed).digest('hex');

  /* In 1 of 101 games the game crashes instantly. */
  if (divisible(hash, 101))
     return 0;

  /* Use the most significant 52-bit from the hash
     to calculate the crash point */
  var h = parseInt(hash.slice(0,52/4),16);
  var e = Math.pow(2,52);

  return Math.floor((100 * e - h) / (e - h));
}