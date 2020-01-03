/**
 * BoincVue MainScript
 */
const CONTENT_HEIGHT_MIN = 200;

/** Boinc running status data */
let statusData = [];

/** last XHR receive information (string message) */
let receiveTime = null;

/** height of main content */
let contentHeight = CONTENT_HEIGHT_MIN;

/** Remove content mask (for noscript) */
const curtainOpen = () =>
  document.getElementById('BoincVueApp').classList.remove('app-hidden');

function calcContentHeight () {
  const headerEnd = document.getElementById('Table').getBoundingClientRect().top + window.pageYOffset;
  const footerHeight = document.getElementById('Footer').clientHeight;
  const windowHeight = window.innerHeight;
  // debugpos = document.getElementById('Footer').getBoundingClientRect().top + window.pageYOffset;
  contentHeight = windowHeight - headerEnd - footerHeight
  if (contentHeight < CONTENT_HEIGHT_MIN) {
    contentHeight = CONTENT_HEIGHT_MIN;
  }
  console.log(contentHeight + ' = ' + windowHeight + ' - ' + headerEnd + ' - ' + footerHeight + '');
  return contentHeight;
}

/**
 * Loading boinc status data from json
 * @param {loadDataCallback} callback Callback function for response data
 */
function loadData (callback) {
  const request = new XMLHttpRequest();
  request.open('GET', './result.json', true);
  request.responseType = 'json';
  request.onload = () => {
    if (request.status === 200) {
      const result = request.response;
      result.sort((A, B) => {
        const upA = A.state === 'uploaded';
        const upB = B.state === 'uploaded';
        const fdA = A['fraction done'];
        const fdB = B['fraction done'];
        return upA === upB && upA ? 0 :
          upA ? -1 :
          upB ? 1 :
          fdA === fdB ? 0 :
          fdA > fdB ? -1 : 1;
      });
      callback(result);
    } else {
      callback([]);
    }
  };
  request.onerror = () => callback([]);
  request.abort = () => callback([]);
  request.send();
}


new Vue({
  el: '#BoincVueApp',
  data: {
    status: statusData,
    lastUpdate: receiveTime,
    tableHeight: contentHeight,
  },
  methods: {
    cardData (host) {
      let result = [];
      this.status.filter((D) => {
        return D.hostname === host;
      }).forEach((D) => {
        result = result.concat(D.stats);
      });
      return result;
    },
    progressValue (v) {
      if (v.state === 'uploaded') {
        return 100;
      } else {
        return Math.round(v['fraction done'] * 100);
      }
    },
    progressText: function (v) {
      return v === 0 ? '' : v === 100 ? 'done' : v;
    },
    progressColor (v) {
      if (v.state === 'uploaded') {
        return '#20ff60';
      } else if (v.active_task_state === 'EXECUTING') {
        return '#b0b0ff';
      } else {
        return '#ffff20';
      }
    },
  },
  computed: {
    hasStatus () {
      return this.statusData ? this.statusData.length: 0;
    },
  },
  created: function () {
    curtainOpen();
    setInterval(() => {
      loadData((newValue) => {
        this.status = newValue;
        if (newValue.length !== 0) {
          this.lastUpdate = new Date().toLocaleTimeString();
        } else {
          this.lastUpdate = null;
        }
      });
    }, 3000);
    this.tableHeight = calcContentHeight();
    window.onresize = () => {
      this.tableHeight = calcContentHeight();
    };
  },
});
