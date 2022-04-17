const dateformat = require("dateformat");
const fs = require("fs-extra");
const path = require("path");

// Hack fs-extra module.
let append_to_log = (data) => {
    try {
        fs.ensureFileSync(path.join(
            config.log.folder,
            `${config.log.log_split ? dateformat((new Date()), 'yyyy-mm-dd') : 'server'}.log`
        ));
    } catch (e) {
        throw new Error('Unable to create log file:' + e);
    }
    try {
        fs.appendFileSync(path.join(
            config.log.folder,
            `${config.log.log_split ? dateformat((new Date()), 'yyyy-mm-dd') : 'server'}.log`
        ), data);
    } catch (e) {
        throw new Error('Unable to append log file:' + e);
    }
};

let t = (() => {
    let conditons = ['trace'];
    if (conditons.includes(config.log.console_level) && conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[40;97m"}[TRACE]${"\033[0m"} ${line}`);
                append_to_log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [TRACE] ${line}\n`);
            });
        };
    } else if (conditons.includes(config.log.console_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[40;97m"}[TRACE]${"\033[0m"} ${line}`);
            });
        };
    } else if (conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                append_to_log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [TRACE] ${line}\n`);
            });
        };
    } else {
        return () => { };
    }
})(), trace = t;

let d = (() => {
    let conditons = ['trace', 'debug'];
    if (conditons.includes(config.log.console_level) && conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[40;97m"}[DEBUG]${"\033[0m"} ${line}`);
                append_to_log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [DEBUG] ${line}\n`);
            });
        };
    } else if (conditons.includes(config.log.console_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[40;97m"}[DEBUG]${"\033[0m"} ${line}`);
            });
        };
    } else if (conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                append_to_log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [DEBUG] ${line}\n`);
            });
        };
    } else {
        return () => { };
    }
})(), debug = d;

let i = (() => {
    let conditons = ['trace', 'debug', 'info'];
    if (conditons.includes(config.log.console_level) && conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [INFO] ${line}`);
                append_to_log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [INFO] ${line}\n`);
            });
        };
    } else if (conditons.includes(config.log.console_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [INFO] ${line}`);
            });
        };
    } else if (conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                append_to_log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [INFO] ${line}\n`);
            });
        };
    } else {
        return () => { };
    }
})(), info = i;

let w = (() => {
    let conditons = ['trace', 'debug', 'info', 'warn'];
    if (conditons.includes(config.log.console_level) && conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[44;97m"}[WARN]${"\033[0m"} ${line}`);
                append_to_log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [WARN] ${line}\n`);
            });
        };
    } else if (conditons.includes(config.log.console_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[44;97m"}[WARN]${"\033[0m"} ${line}`);
            });
        };
    } else if (conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                append_to_log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [WARN] ${line}\n`);
            });
        };
    } else {
        return () => { };
    }
})(), warn = w;

let e = (() => {
    let conditons = ['trace', 'debug', 'info', 'warn', 'error'];
    if (conditons.includes(config.log.console_level) && conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[41;97m"}[ERROR]${"\033[0m"} ${line}`);
                append_to_log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [ERROR] ${line}\n`);
            });
        };
    } else if (conditons.includes(config.log.console_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[41;97m"}[ERROR]${"\033[0m"} ${line}`);
            });
        };
    } else if (conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split('\n').forEach((line) => {
                append_to_log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [ERROR] ${line}\n`);
            });
        };
    } else {
        return () => { };
    }
})(), error = e;

if (!config.log.enable) {
    t = trace = d = debug = i = info = w = warn = e = error = () => { };
}

module.exports = {
    t,
    trace,
    d,
    debug,
    i,
    info,
    w,
    warn,
    e,
    error,
};