using Ergonomy.Core;

ExceptionPolicy.InstallProcessHandlers();
if (!SingleInstanceGuard.TryAcquire(out var guard))
{
    ExceptionPolicy.Report(Severity.Warning, new InvalidOperationException("Ergonomy runtime already owns SQLite."), new ExceptionContext("Task", "startup"));
    return 73;
}
using (guard)
{
    // Task orchestration communicates with Ergonomy.Service over named pipes only.
}
