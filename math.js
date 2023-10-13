// importing module os for get version and name of the user machine
import os from "os";
// getting date
export let currentDate = new Date();
let name = os.userInfo().username;
let version = os.version();
// export function for greeting user
export function greeting() {
  let hour = currentDate.getHours();
  if (hour > 16) {
    return `Добрый вечер, ${name}. Ваша машина: ${version}`;
  } else if (hour > 12) {
    return `Добрый день, ${name}. Ваша машина: ${version}`;
  } else {
    return `Доброе утро, ${name}. Ваша машина: ${version}`;
  }
}
