using Ergonomy.Core;

namespace Ergonomy.Service;

internal static class Program
{
    public static int Main(string[] args)
    {
        ExceptionPolicy.InstallProcessHandlers();
        if (!SingleInstanceGuard.TryAcquire(out var guard))
        {
            ExceptionPolicy.Report(Severity.Critical, new InvalidOperationException("Another Ergonomy runtime owns the database."), new ExceptionContext("Service", "startup"));
            return 73;
        }
        using (guard)
        {
            // Only this host may construct LocalDatabaseManager/SQLCipher connections.
            // Named-pipe agents must never open the database directly.
            try { return RunService(args); }
            catch (Exception ex) { ExceptionPolicy.Report(Severity.Critical, ex, new ExceptionContext("Service", "run")); return 1; }
        }
    }

    private static int RunService(string[] args)
    {
        // Service composition root is intentionally kept here: database and SyncEngine ownership
        // belongs to this process. The concrete hosted service can be wired without changing the gate.
        return 0;
    }
}
