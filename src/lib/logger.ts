export default class Logger {
  static log(object: any): void {
    // eslint-disable-next-line no-console
    console.log(object);
  }
  static logError(object: any): void {
    console.error(object);
  }
}
