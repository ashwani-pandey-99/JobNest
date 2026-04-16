import { execSync } from "child_process";

const port = process.argv[2] || "8000";

const findPidsUsingPort = (targetPort) => {
    try {
        const output = execSync(`netstat -ano -p tcp | findstr :${targetPort}`, {
            stdio: ["ignore", "pipe", "ignore"],
            encoding: "utf8"
        });

        return [...new Set(
            output
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean)
                .filter((line) => line.includes(`:${targetPort}`) && line.includes("LISTENING"))
                .map((line) => line.split(/\s+/).pop())
                .filter(Boolean)
        )];
    } catch {
        return [];
    }
};

const stopPid = (pid) => {
    try {
        execSync(`taskkill /PID ${pid} /F`, {
            stdio: ["ignore", "ignore", "ignore"]
        });
        console.log(`Stopped process ${pid} using port ${port}.`);
    } catch {
        console.log(`Could not stop process ${pid}.`);
    }
};

const pids = findPidsUsingPort(port);

if (pids.length === 0) {
    console.log(`Port ${port} is free.`);
    process.exit(0);
}

console.log(`Port ${port} is busy. Releasing it before startup...`);
pids.forEach(stopPid);
