const {innerText, createFullScreenElement} = require('./utils');

// TODO: refactor

const [
  ImgSrcSelector,
  TitleSelector,
  ContentSelector,
  ThumbnailDivsSelector
] = ['.tag-list-img', 'h1', '.content', '#thumbnail-divs'];

function JSPack() {
  // Module-level (private) variables
  var el, bBE = false, m = this;

  // Raw byte arrays
  m._DeArray = function (a, p, l) {
    return [a.slice(p, p + l)];
  };
  m._EnArray = function (a, p, l, v) {
    for (var i = 0; i < l; a[p + i] = v[i] ? v[i] : 0, i++) ;
  };

  // ASCII characters
  m._DeChar = function (a, p) {
    return String.fromCharCode(a[p]);
  };
  m._EnChar = function (a, p, v) {
    a[p] = v.charCodeAt(0);
  };

  // Little-endian (un)signed N-byte integers
  m._DeInt = function (a, p) {
    var lsb = bBE ? (el.len - 1) : 0, nsb = bBE ? -1 : 1, stop = lsb + nsb * el.len, rv, i, f;
    for (rv = 0, i = lsb, f = 1; i != stop; rv += (a[p + i] * f), i += nsb, f *= 256) ;
    if (el.bSigned && (rv & Math.pow(2, el.len * 8 - 1))) { rv -= Math.pow(2, el.len * 8); }
    return rv;
  };
  m._EnInt = function (a, p, v) {
    var lsb = bBE ? (el.len - 1) : 0, nsb = bBE ? -1 : 1, stop = lsb + nsb * el.len, i;
    v = (v < el.min) ? el.min : (v > el.max) ? el.max : v;
    for (i = lsb; i != stop; a[p + i] = v & 0xff, i += nsb, v >>= 8) ;
  };

  // ASCII character strings
  m._DeString = function (a, p, l) {
    for (var rv = new Array(l), i = 0; i < l; rv[i] = String.fromCharCode(a[p + i]), i++) ;
    return rv.join('');
  };
  m._EnString = function (a, p, l, v) {
    for (var t, i = 0; i < l; a[p + i] = (t = v.charCodeAt(i)) ? t : 0, i++) ;
  };

  // Little-endian N-bit IEEE 754 floating point
  m._De754 = function (a, p) {
    var s, e, m, i, d, nBits, mLen, eLen, eBias, eMax;
    mLen = el.mLen, eLen = el.len * 8 - el.mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1;

    i = bBE ? 0 : (el.len - 1);
    d = bBE ? 1 : -1;
    s = a[p + i];
    i += d;
    nBits = -7;
    for (e = s & ((1 << (-nBits)) - 1), s >>= (-nBits), nBits += eLen; nBits > 0; e = e * 256 + a[p + i], i += d, nBits -= 8) ;
    for (m = e & ((1 << (-nBits)) - 1), e >>= (-nBits), nBits += mLen; nBits > 0; m = m * 256 + a[p + i], i += d, nBits -= 8) ;

    switch (e) {
      case 0:
        // Zero, or denormalized number
        e = 1 - eBias;
        break;
      case eMax:
        // NaN, or +/-Infinity
        return m ? NaN : ((s ? -1 : 1) * Infinity);
      default:
        // Normalized number
        m = m + Math.pow(2, mLen);
        e = e - eBias;
        break;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };
  m._En754 = function (a, p, v) {
    var s, e, m, i, d, c, mLen, eLen, eBias, eMax;
    mLen = el.mLen, eLen = el.len * 8 - el.mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1;

    s = v < 0 ? 1 : 0;
    v = Math.abs(v);
    if (isNaN(v) || (v === Infinity)) {
      m = isNaN(v) ? 1 : 0;
      e = eMax;
    }
    else {
      e = Math.floor(Math.log(v) / Math.LN2);			// Calculate log2 of the value
      if (v * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }		// Math.log() isn't 100% reliable

      // Round by adding 1/2 the significand's LSD
      if (e + eBias >= 1) { v += el.rt / c; }			// Normalized:  mLen significand digits
      else { v += el.rt * Math.pow(2, 1 - eBias); } 		// Denormalized:  <= mLen significand digits
      if (v * c >= 2) {
        e++;
        c /= 2;
      }				// Rounding can increment the exponent

      if (e + eBias >= eMax) {
        // Overflow
        m = 0;
        e = eMax;
      }
      else if (e + eBias >= 1) {
        // Normalized - term order matters, as Math.pow(2, 52-e) and v*Math.pow(2, 52) can overflow
        m = (v * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      }
      else {
        // Denormalized - also catches the '0' case, somewhat by chance
        m = v * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }

    for (i = bBE ? (el.len - 1) : 0, d = bBE ? -1 : 1; mLen >= 8; a[p + i] = m & 0xff, i += d, m /= 256, mLen -= 8) ;
    for (e = (e << mLen) | m, eLen += mLen; eLen > 0; a[p + i] = e & 0xff, i += d, e /= 256, eLen -= 8) ;
    a[p + i - d] |= s * 128;
  };


  // Class data
  m._sPattern = '(\\d+)?([AxcbBhHsfdiIlL])';
  m._lenLut = {
    'A': 1,
    'x': 1,
    'c': 1,
    'b': 1,
    'B': 1,
    'h': 2,
    'H': 2,
    's': 1,
    'f': 4,
    'd': 8,
    'i': 4,
    'I': 4,
    'l': 4,
    'L': 4
  };
  m._elLut = {
    'A': {en: m._EnArray, de: m._DeArray},
    's': {en: m._EnString, de: m._DeString},
    'c': {en: m._EnChar, de: m._DeChar},
    'b': {en: m._EnInt, de: m._DeInt, len: 1, bSigned: true, min: -Math.pow(2, 7), max: Math.pow(2, 7) - 1},
    'B': {en: m._EnInt, de: m._DeInt, len: 1, bSigned: false, min: 0, max: Math.pow(2, 8) - 1},
    'h': {en: m._EnInt, de: m._DeInt, len: 2, bSigned: true, min: -Math.pow(2, 15), max: Math.pow(2, 15) - 1},
    'H': {en: m._EnInt, de: m._DeInt, len: 2, bSigned: false, min: 0, max: Math.pow(2, 16) - 1},
    'i': {en: m._EnInt, de: m._DeInt, len: 4, bSigned: true, min: -Math.pow(2, 31), max: Math.pow(2, 31) - 1},
    'I': {en: m._EnInt, de: m._DeInt, len: 4, bSigned: false, min: 0, max: Math.pow(2, 32) - 1},
    'l': {en: m._EnInt, de: m._DeInt, len: 4, bSigned: true, min: -Math.pow(2, 31), max: Math.pow(2, 31) - 1},
    'L': {en: m._EnInt, de: m._DeInt, len: 4, bSigned: false, min: 0, max: Math.pow(2, 32) - 1},
    'f': {en: m._En754, de: m._De754, len: 4, mLen: 23, rt: Math.pow(2, -24) - Math.pow(2, -77)},
    'd': {en: m._En754, de: m._De754, len: 8, mLen: 52, rt: 0}
  };

  // Unpack a series of n elements of size s from array a at offset p with fxn
  m._UnpackSeries = function (n, s, a, p) {
    for (var fxn = el.de, rv = [], i = 0; i < n; rv.push(fxn(a, p + i * s)), i++) ;
    return rv;
  };

  // Pack a series of n elements of size s from array v at offset i to array a at offset p with fxn
  m._PackSeries = function (n, s, a, p, v, i) {
    for (var fxn = el.en, o = 0; o < n; fxn(a, p + o * s, v[i + o]), o++) ;
  };

  // Unpack the octet array a, beginning at offset p, according to the fmt string
  m.Unpack = function (fmt, a, p) {
    // Set the private bBE flag based on the format string - assume big-endianness
    bBE = (fmt.charAt(0) != '<');

    p = p ? p : 0;
    var re = new RegExp(this._sPattern, 'g'), m, n, s, rv = [];
    while (m = re.exec(fmt)) {
      n = ((m[1] == undefined) || (m[1] == '')) ? 1 : parseInt(m[1]);
      s = this._lenLut[m[2]];
      if ((p + n * s) > a.length) {
        return undefined;
      }
      switch (m[2]) {
        case 'A':
        case 's':
          rv.push(this._elLut[m[2]].de(a, p, n));
          break;
        case 'c':
        case 'b':
        case 'B':
        case 'h':
        case 'H':
        case 'i':
        case 'I':
        case 'l':
        case 'L':
        case 'f':
        case 'd':
          el = this._elLut[m[2]];
          rv.push(this._UnpackSeries(n, s, a, p));
          break;
      }
      p += n * s;
    }
    return Array.prototype.concat.apply([], rv);
  };

  // Pack the supplied values into the octet array a, beginning at offset p, according to the fmt string
  m.PackTo = function (fmt, a, p, values) {
    // Set the private bBE flag based on the format string - assume big-endianness
    bBE = (fmt.charAt(0) !== '<');

    var re = new RegExp(this._sPattern, 'g'), m, n, s, i = 0, j;
    while (m = re.exec(fmt)) {
      n = ((m[1] === undefined) || (m[1] === '')) ? 1 : parseInt(m[1]);
      s = this._lenLut[m[2]];
      if ((p + n * s) > a.length) {
        return false;
      }
      switch (m[2]) {
        case 'A':
        case 's':
          if ((i + 1) > values.length) { return false; }
          this._elLut[m[2]].en(a, p, n, values[i]);
          i += 1;
          break;
        case 'c':
        case 'b':
        case 'B':
        case 'h':
        case 'H':
        case 'i':
        case 'I':
        case 'l':
        case 'L':
        case 'f':
        case 'd':
          el = this._elLut[m[2]];
          if ((i + n) > values.length) { return false; }
          this._PackSeries(n, s, a, p, values, i);
          i += n;
          break;
        case 'x':
          for (j = 0; j < n; j++) { a[p + j] = 0; }
          break;
      }
      p += n * s;
    }
    return a;
  };

  // Pack the supplied values into a new octet array, according to the fmt string
  m.Pack = function (fmt, values) {
    return this.PackTo(fmt, new Array(this.CalcLength(fmt)), 0, values);
  };

  // Determine the number of bytes represented by the format string
  m.CalcLength = function (fmt) {
    var re = new RegExp(this._sPattern, 'g'), m, sum = 0;
    while (m = re.exec(fmt)) {
      sum += (((m[1] == undefined) || (m[1] == '')) ? 1 : parseInt(m[1])) * this._lenLut[m[2]];
    }
    return sum;
  };
}


var nozomiextension = '.nozomi';
var nozomidir = 'nozomi';
var domain = 'n.nozomi.la';
var postdir = 'post';

var results_array = {};
var outstanding_requests = {};
var number_of_outstanding_requests = 0;
var nozomi, total_items;
var tag, tag_for_hash = '', area, page_number;
var nozomi_address;


function dgebi(id) { return document.getElementById(id); }

function path_from_postid(postid) {
  if (postid.length < 3) return postid;

  return postid.replace(/^(.*(..)(.))$/, '$3/$2/$1');
}

function resize_thumbnails() {
  var c = document.getElementsByClassName('content')[0];
  if (!c) {
    return;
  }

  var s = c.clientWidth;

  var n = Math.ceil(6.0 * s / 1000.0);
  var w = ((s - (10.0 * n + 10.0) - 0.5) / n) - 2.0;

  var divs = document.getElementsByClassName('thumbnail-div');
  for (var i = 0; i < divs.length; i++) {
    var div = divs[i];
    div.style.width = (w + 'px');
    div.style.height = (w + 'px');
  }
}

function check_dates() {
  var format = 'lll';

  var localize_title = function (el) {
    if (!el) {
      return;
    }

    var str = el.title;
    if (str) {
      var m = moment(str);
      el.title = m.format(format);
    }
  };
  //post view
  localize_title(document.querySelectorAll('.post img')[0]);
}

function urlencode(str) {
  return str.replace(/[;\/?:@=&]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
    return '%' + c.charCodeAt(0).toString(16);
  });
}

function fetch_nozomi(totalImageCount) {
  var filepath = decodeURIComponent(document.location.href.replace(/.*nozomi\.la\//, ''));
  if (!filepath) {
    tag = 'index';
    page_number = 1;
  } else {
    var elements = filepath.replace(/\.html$/, '').split('-');
    if (elements.length < 2) return;
    while (elements.length > 2) {
      elements[1] = elements[0] + '-' + elements[1];
      elements.shift();
    }

    tag = elements[0];
    if (tag.match(/\//)) {
      var area_elements = tag.split(/\//);
      if (area_elements.length !== 2) return;

      area = area_elements[0];
      if (!area || area.match(/[^A-Za-z0-9_]/)) return;

      tag = area_elements[1];
    }
    if (!tag || tag.match(/\//)) return;

    if (tag === 'index-Popular') {
      tag_for_hash = '-Popular';
    } else if (area) {
      tag_for_hash = tag;
    }

    page_number = parseInt(elements[1]);
    if (!page_number || page_number < 1) return;
  }
  nozomi_address = '//' + [domain, urlencode(tag)].join('/') + nozomiextension;
  if (area) {
    nozomi_address = '//' + [domain, nozomidir, urlencode(tag)].join('/') + nozomiextension;
  }

  var start_byte = 0;
  var end_byte = totalImageCount * 4 - 1;
  var xhr = new XMLHttpRequest();
  const loadingElement = createFullScreenElement();
  document.body.appendChild(loadingElement);
  xhr.open('GET', nozomi_address);
  xhr.responseType = 'arraybuffer';
  xhr.setRequestHeader('Range', 'bytes=' + start_byte.toString() + '-' + end_byte.toString());
  xhr.onreadystatechange = function (oEvent) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status === 206) {
        var arrayBuffer = xhr.response; // Note: not oReq.responseText
        if (arrayBuffer) {
          var arr = new Uint8Array(arrayBuffer); //e.g. [0x00, 0x5D, 0x39, 0x72,  0x00, 0x5D, 0x39, 0x82,  ...]
          var jspack = new JSPack();
          var total = arr.length / 4; //32-bit unsigned integers
          nozomi = jspack.Unpack(total + 'I', arr);
          total_items = parseInt(xhr.getResponseHeader('Content-Range').replace(/^[Bb]ytes \d+-\d+\//, '')) / 4;
          get_jsons();
          document.body.removeChild(loadingElement);
        }
      }
    }
  };
  xhr.send();
}

function get_jsons() {
  var datas = [];
  for (var i in nozomi) {
    var postid = nozomi[i];
    if (postid in results_array) {
      datas.push(results_array[postid]);
      continue;
    }
    if (!outstanding_requests[postid]) {
      outstanding_requests[postid] = 1;
      ++number_of_outstanding_requests;
      get_json(postid); //calling a function is REQUIRED to give postid its own scope
    }
  }
  if (number_of_outstanding_requests) return;

  results_to_page(datas);
}

function get_json(postid) {
  var url = '//j.nozomi.la/' + postdir + '/' + path_from_postid(postid.toString()) + '.json';

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', url);
  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        results_array[postid] = JSON.parse(this.responseText);
      } else {
        results_array[postid] = '';
      }
      delete outstanding_requests[postid];
      --number_of_outstanding_requests;
      get_jsons();
    }
  };
  xmlhttp.send();
}

function results_to_page(datas) {
  var tc = Object.create(null);
  var to = {};

  dgebi('thumbnail-divs').innerHTML = '';

  var ul = document.getElementsByClassName('title')[0].nextElementSibling;
  ul.innerHTML = '';

  var p = function (l) {
    var areas = ['general', 'artist', 'copyright', 'character'];
    for (var a in areas) {
      var area = areas[a];
      for (var i in l[area]) {
        var tag = l[area][i];

        if (tag.tag in tc === false) {
          tc[tag.tag] = 1;
        } else {
          tc[tag.tag]++;
        }

        to[tag.tag] = tag;
      }
    }
  };

  for (var d in datas) {
    var data = datas[d];
    if (!data) continue;

    var div = document.createElement('div');
    div.classList.add('thumbnail-div');

    var a = document.createElement('a');
    a.href = '/post/' + data.postid + '.html#' + tag_for_hash;

    var img = document.createElement('img');
    img.classList.add('tag-list-img');
    img.crossOrigin = 'Anonymous';
    img.src = data.imageurl.replace(/\/\/i\.nozomi\.la\//, '//tn.nozomi.la/') + '.jpg';
    img.title = data.date;

    a.appendChild(img);
    div.appendChild(a);
    dgebi('thumbnail-divs').appendChild(div);

    p(data);
  }


  resize_thumbnails();
  setTimeout(resize_thumbnails, 10);

  check_dates();
}


module.exports = {
  fetchNozomiAll() {
    const totalPage = parseInt(innerText(document.querySelector('.page-container li:last-child'), 1), 10);
    const totalImageCount = totalPage * 64;
    // prettify page
    const elementsToRemove = [
      document.querySelector('.page-container'),
      document.querySelector('.navbar'),
      document.querySelector('.sidebar')
    ];
    for (const elem of elementsToRemove) {
      elem.style.display = 'none';
    }
    const mainContent = document.querySelector('.content');
    mainContent.style.margin = '0 auto';
    const thumbnailsContainer = document.getElementById('thumbnail-divs');
    for (const e of Array.from(thumbnailsContainer.getElementsByClassName('thumbnail-div'))) {
      thumbnailsContainer.removeChild(e);
    }
    fetch_nozomi(totalImageCount);
  },
  extractNozomiImages() {
    let images = Array.from(document.querySelectorAll(ImgSrcSelector));
    let title = document.querySelector(TitleSelector).innerText;
    images = images.map(s => s.src.replace('//tn', '//i').split('.').slice(0, 4).join('.'));
    return `${title}\n${images.join('\n')}\n${'= ='.repeat(20)}`;
  }
};
