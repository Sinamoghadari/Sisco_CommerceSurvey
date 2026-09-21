namespace Ergonomy.Core;

/// <summary>Process-wide gate shared by the legacy agent, service, and task host.</summary>
public sealed class SingleInstanceGuard : IDisposable
{
    public const string MutexName = "Global\\Ergonomy.SQLite.Owner";
    private readonly Mutex _mutex;
    private bool _held;

    private SingleInstanceGuard(Mutex mutex) { _mutex = mutex; _held = true; }

    public static bool TryAcquire(out SingleInstanceGuard? guard)
    {
        var mutex = new Mutex(false, MutexName);
        try
        {
            if (!mutex.WaitOne(TimeSpan.Zero)) { mutex.Dispose(); guard = null; return false; }
            guard = new SingleInstanceGuard(mutex); return true;
        }
        catch (AbandonedMutexException) { guard = new SingleInstanceGuard(mutex); return true; }
        catch { mutex.Dispose(); throw; }
    }

    public void Dispose()
    {
        if (!Interlocked.Exchange(ref _held, false)) return;
        try { _mutex.ReleaseMutex(); } finally { _mutex.Dispose(); }
    }
}
