using System.Collections.Concurrent;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;

namespace Ergonomy.Core;

public enum Severity { Debug, Information, Warning, Error, Critical }

public sealed record ExceptionContext(string Module, string? Operation = null, IReadOnlyDictionary<string, object?>? Properties = null);

/// <summary>Single process-wide exception sink. Reporting is re-entrancy safe and never throws.</summary>
public static class ExceptionPolicy
{
    private static readonly AsyncLocal<bool> Suppressed = new();
    private static readonly object Sync = new();
    private static TextWriter _sink = Console.Error;
    private static int _installed;

    public static void Configure(TextWriter sink)
    {
        ArgumentNullException.ThrowIfNull(sink);
        lock (Sync) _sink = sink;
    }

    public static IDisposable Suppress() => new SuppressionScope();

    public static void Report(Severity severity, Exception exception, ExceptionContext context)
    {
        ArgumentNullException.ThrowIfNull(exception);
        ArgumentNullException.ThrowIfNull(context);
        if (Suppressed.Value) return;
        Suppressed.Value = true;
        try
        {
            var sb = new StringBuilder(512);
            sb.Append(DateTimeOffset.UtcNow.ToString("O"));
            sb.Append(" | ").Append(severity).Append(" | ").Append(context.Module);
            if (!string.IsNullOrWhiteSpace(context.Operation)) sb.Append(" | ").Append(context.Operation);
            sb.Append(" | machine=").Append(Environment.MachineName);
            sb.Append(" thread=").Append(Environment.CurrentManagedThreadId);
            sb.Append(" process=").Append(Process.GetCurrentProcess().ProcessName);
            sb.Append(" type=").Append(exception.GetType().FullName);
            sb.Append(" hresult=0x").Append(exception.HResult.ToString("X8"));
            if (exception is System.ComponentModel.Win32Exception win32) sb.Append(" win32=").Append(win32.NativeErrorCode);
            if (context.Properties is not null)
                foreach (var p in context.Properties) sb.Append(' ').Append(p.Key).Append('=').Append(p.Value);
            sb.AppendLine().Append(exception);
            lock (Sync) { _sink.WriteLine(sb.ToString()); _sink.Flush(); }
        }
        catch { /* Last-chance reporting must not terminate the process. */ }
        finally { Suppressed.Value = false; }
    }

    public static void IgnoreIfShuttingDown(Exception exception, string module, Func<bool> isShuttingDown)
    {
        if (!isShuttingDown()) Report(Severity.Warning, exception, new ExceptionContext(module, "non-shutdown operation"));
    }

    public static void InstallProcessHandlers(bool winForms = false)
    {
        if (Interlocked.Exchange(ref _installed, 1) != 0) return;
        AppDomain.CurrentDomain.UnhandledException += (_, e) =>
            Report(Severity.Critical, e.ExceptionObject as Exception ?? new Exception(e.ExceptionObject?.ToString()), new ExceptionContext("Process", "UnhandledException"));
        TaskScheduler.UnobservedTaskException += (_, e) => { Report(Severity.Error, e.Exception, new ExceptionContext("Process", "UnobservedTaskException")); e.SetObserved(); };
#if WINDOWS
        if (winForms) System.Windows.Forms.Application.ThreadException += (_, e) => Report(Severity.Error, e.Exception, new ExceptionContext("WinForms", "ThreadException"));
#endif
    }

    private sealed class SuppressionScope : IDisposable
    {
        private readonly bool _previous = Suppressed.Value;
        public void Dispose() => Suppressed.Value = _previous;
    }
}
