import { randomUUID } from 'crypto';
import { spawn as defaultSpawn } from 'child_process';
const PREFIX = '__PROBLEM_SET_RESULT__';
export function buildDockerArguments({ image, containerName, payload, limits }) {
  return ['run', '--rm', '--init', '--name', containerName, '--network', 'none', '--read-only',
    '--user', '65532:65532', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges',
    '--pids-limit', String(limits.pids), '--memory', limits.memory, '--memory-swap', limits.memory,
    '--cpus', String(limits.cpus), '--tmpfs', `/tmp:rw,nosuid,nodev,noexec,size=${limits.tmpfs}`,
    '--workdir', '/opt/problem-set/backend', '--env', 'HOME=/tmp', '--env', 'TMPDIR=/tmp',
    '--env', 'NODE_ENV=production', '--env', 'DISABLE_CHALLENGE_SOURCE_LOG=1',
    '--env', 'CHALLENGES_DB_PATH=/tmp/challenges.db', '--env', 'EXECUTION_WORKSPACE_ROOT=/tmp/problem-set-runs', '--interactive', image, JSON.stringify(payload)];
}
function parseResult(stdout) {
  const line = stdout.split(/\r?\n/).reverse().find((value) => value.startsWith(PREFIX));
  if (!line) throw new Error('Execution sandbox returned no result');
  return JSON.parse(line.slice(PREFIX.length));
}
export class DockerSandboxRunner {
  constructor({ spawnImpl = defaultSpawn, dockerCommand = 'docker', image = process.env.EXECUTION_SANDBOX_IMAGE || 'problem-set-runner:local', timeoutMs = Number(process.env.EXECUTION_TIMEOUT_MS || 10000), maxOutputBytes = Number(process.env.EXECUTION_MAX_OUTPUT_BYTES || 262144), limits = { cpus: 0.5, memory: '256m', pids: 64, tmpfs: '64m' } } = {}) {
    Object.assign(this, { spawnImpl, dockerCommand, image, timeoutMs, maxOutputBytes, limits });
  }
  execute(payload) {
    return new Promise((resolve, reject) => {
      const child = this.spawnImpl(this.dockerCommand, buildDockerArguments({ image: this.image, containerName: `problem-set-run-${randomUUID()}`, payload, limits: this.limits }), { stdio: ['ignore', 'pipe', 'pipe'] });
      let stdout = ''; let stderr = ''; let settled = false;
      const finish = (fn, value) => { if (!settled) { settled = true; clearTimeout(timer); fn(value); } };
      const stop = (message) => { try { child.kill('SIGKILL'); } catch {} finish(reject, new Error(message)); };
      const collect = (stream) => (chunk) => {
        const value = chunk.toString();
        if (Buffer.byteLength(stdout) + Buffer.byteLength(stderr) + Buffer.byteLength(value) > this.maxOutputBytes) return stop('Execution sandbox exceeded the output limit');
        if (stream === 'out') stdout += value; else stderr += value;
      };
      child.stdout.on('data', collect('out')); child.stderr.on('data', collect('err'));
      child.on('error', (error) => finish(reject, new Error(`Execution sandbox unavailable: ${error.message}`)));
      child.on('close', (code) => {
        if (code !== 0) return finish(reject, new Error(`Execution sandbox failed${stderr ? `: ${stderr.slice(0, 1024)}` : ''}`));
        try { finish(resolve, parseResult(stdout)); } catch (error) { finish(reject, error); }
      });
      const timer = setTimeout(() => stop('Execution sandbox timed out'), this.timeoutMs);
    });
  }
}
