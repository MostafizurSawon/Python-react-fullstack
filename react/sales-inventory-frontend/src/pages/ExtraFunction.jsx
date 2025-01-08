
export function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// function cleanUrl(url) {
//   return url.split('.jpg')[0] + '.jpg';
// }

// Example Usage:
// const url = "https://img.freepik.com/free-photo/view-ecstatic-football-fan-with-painted-face_23-2150860725.jpg?t=st=1736349088~exp=1736352688~hmac=912fd81f98be893f59c964eada3502f7eb5627fd9585f2b99d1085ea450919d2&w=360";
// console.log(cleanUrl(url));
// Output: "https://img.freepik.com/free-photo/view-ecstatic-football-fan-with-painted-face_23-2150860725.jpg"

