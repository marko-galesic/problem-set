import { EventEmitter } from 'events';
import { jest } from '@jest/globals';
import { DockerSandboxRunner, buildDockerArguments } from '../../execution/sandboxRunner.js';
function fakeProcess() { const child = new EventEmitter(); child.stdout = new EventEmitter(); child.stderr = new EventEmitter(); child.kill = jest.fn(); return child; }
describe('DockerSandboxRunner', () => {
  test('builds a non-root, networkless, read-only invocation with bounded resources', () => {
    const args = buildDockerArguments({ image: 'runner:test', containerName: 'isolated-run', payload: { code: 'x' }, limits: { cpus: 0.5, memory: '256m', pids: 64, tmpfs: '64m' } });
    expect(args).toEqual(expect.arrayContaining(['--network', 'none', '--read-only', '--user', '65532:65532', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges', '--pids-limit', '64', '--memory', '256m', '--memory-swap', '256m', '--cpus', '0.5', '--tmpfs', '/tmp:rw,nosuid,nodev,noexec,size=64m']));
    expect(args).toEqual(expect.arrayContaining(['--env', 'EXECUTION_WORKSPACE_ROOT=/tmp/problem-set-runs']));
    expect(args.join(' ')).not.toContain('OPENAI_API_KEY');
  });
  test('returns a worker result', async () => {
    const child = fakeProcess();
    const result = new DockerSandboxRunner({ spawnImpl: jest.fn(() => child), timeoutMs: 1000 }).execute({ code: 'x' });
    child.stdout.emit('data', Buffer.from('__PROBLEM_SET_RESULT__{"success":true}\n'));
    child.emit('close', 0);
    await expect(result).resolves.toEqual({ success: true });
  });
  test('caps hostile output and requests forced container removal', async () => {
    const child = fakeProcess(); const cleanupImpl = jest.fn();
    const rejected = new DockerSandboxRunner({ spawnImpl: jest.fn(() => child), cleanupImpl, timeoutMs: 1000, maxOutputBytes: 4 }).execute({ code: 'x' });
    child.stderr.emit('data', Buffer.from('too much'));
    await expect(rejected).rejects.toThrow('output limit');
    expect(child.kill).toHaveBeenCalledWith('SIGKILL');
    expect(cleanupImpl).toHaveBeenCalledWith(expect.objectContaining({ dockerCommand: 'docker', containerName: expect.stringMatching(/^problem-set-run-/) }));
  });
  test('removes a named container after timeout', async () => {
    const child = fakeProcess(); const cleanupImpl = jest.fn();
    const rejected = new DockerSandboxRunner({ spawnImpl: jest.fn(() => child), cleanupImpl, timeoutMs: 5 }).execute({ code: 'x' });
    await expect(rejected).rejects.toThrow('timed out');
    expect(child.kill).toHaveBeenCalledWith('SIGKILL'); expect(cleanupImpl).toHaveBeenCalledTimes(1);
  });
  test('rejects oversized payloads before spawning a process', async () => {
    const spawnImpl = jest.fn();
    await expect(new DockerSandboxRunner({ spawnImpl, maxPayloadBytes: 4 }).execute({ code: 'large' })).rejects.toThrow('payload exceeds');
    expect(spawnImpl).not.toHaveBeenCalled();
  });
});
