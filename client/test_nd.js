import nd from 'nepali-date-converter';
const NepaliDate = nd.default || nd;
const td = new NepaliDate();
console.log(td.format('dddd, MMMM D, YYYY'));
console.log(td.format('ddd, MMMM DD, YYYY'));
console.log(td.format('dd, MMMM DD, YYYY'));
console.log(td.format('MMMM DD, YYYY'));
