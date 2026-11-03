using System.Collections.Concurrent;

namespace Ergonomy.Core;

/// <summary>Deduplicates probe failures by family with a bounded time window.</summary>
public sealed class AdvancedMetricsCollector
{
    private readonly ConcurrentDictionary<string, long> _lastReport = new(StringComparer.Ordinal);
    private readonly TimeSpan _window;
    private long _suppressed;

    public AdvancedMetricsCollector(TimeSpan? window = null) => _window = window ?? TimeSpan.FromMinutes(1);
    public long SuppressedProbeFailures => Interlocked.Read(ref _suppressed);

    public bool ShouldReportProbeFailure(string family)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(family);
        var now = DateTime.UtcNow.Ticks;
        while (true)
        {
            if (!_lastReport.TryGetValue(family, out var previous))
            {
                if (_lastReport.TryAdd(family, now)) return true;
                continue;
            }
            if (now - previous < _window.Ticks) { Interlocked.Increment(ref _suppressed); return false; }
            if (_lastReport.TryUpdate(family, now, previous)) return true;
        }
    }

    public void ReportProbeFailure(string family, Exception exception, string module = "AdvancedMetricsCollector")
    {
        if (ShouldReportProbeFailure(family))
            ExceptionPolicy.Report(Severity.Warning, exception, new ExceptionContext(module, "probe:" + family));
    }
}
