# ERGONOMY001: reject empty/unclassified catches. Intentional last-chance catches must contain
# the exact suppression comment and must not be copied to application code.
$files = Get-ChildItem -Recurse -Filter *.cs | Where-Object { $_.FullName -notmatch '[\\/]bin[\\/]|[\\/]obj[\\/]' }
$bad = @()
foreach ($file in $files) {
  $text = Get-Content $file.FullName -Raw
  if ($text -match '(?s)catch\s*(?:\([^)]*\))?\s*\{\s*\}') { $bad += $file.FullName }
}
if ($bad.Count) { Write-Error "ERGONOMY001: empty catch block(s): $($bad -join ', ')"; exit 1 }
