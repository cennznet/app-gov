import chalk from "chalk";
import { createLogger, format, Logger, transports } from "winston";

type LoggerService = "ProposalPub" | "ProposalSub";

const instances = {} as Record<LoggerService, Logger>;

export const getLogger = (service: LoggerService): Logger => {
	if (instances[service]) return instances[service];

	return (instances[service] = createLogger({
		level: "info",
		transports: [
			new transports.File({
				filename: `logs/app.log`,
				maxsize: 2048000, // 2 MB
				maxFiles: 10,
				format: format.combine(
					format.uncolorize(),
					...getDefaultFormat(service)
				),
			}),

			new transports.Console({
				format: format.combine(format.colorize(), ...getColorized(service)),
			}),
		],
	}));
};

function getDefaultFormat(service: string) {
	return [
		format.label({
			label: service,
			message: true,
		}),
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.printf(({ level, message, timestamp }) => {
			return `${timestamp} ${level}: ${message}`;
		}),
	];
}

function getColorized(service: LoggerService) {
	return [
		format.label({
			label: chalk.cyan(service),
			message: true,
		}),
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.printf(({ level, message, timestamp }) => {
			return `${timestamp} ${level}: ${message}`;
		}),
	];
}
