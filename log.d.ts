export enum Level {
  FATAL,
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

export interface log {
  fatal(message: any): void;
  error(message: any): void;
  warn(message: any): void;
  info(message: any): void;
  debug(message: any): void;
}

export default log;
