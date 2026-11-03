# Ergonomy runtime foundation

`SingleInstanceGuard` is the mandatory process gate for every executable. The `Global\\Ergonomy.SQLite.Owner` mutex means the service, task host, and legacy agent cannot concurrently access SQLite; only `Ergonomy.Service` is the database composition root.

`ExceptionPolicy` installs last-chance handlers once, enriches reports, and uses `AsyncLocal` suppression to prevent recursive reporting. `AdvancedMetricsCollector` rate-limits probe families using atomic dictionary operations.

CI should run `pwsh -File build/ErgonomyCatchRule.ps1`; violations are ERGONOMY001.
