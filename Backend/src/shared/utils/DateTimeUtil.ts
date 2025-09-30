export class DateTimeUtil {
  public static getFormatedDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${day}-${month}-${year}-${hour}:${minutes}:${seconds}`;
  }
}
