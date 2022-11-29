export default function formatUnix(unix) {
  const dateObj = new Date(unix * 1000);

  const date = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  const formattedTime = date + "." + month + "." + year;

  return formattedTime;
}
