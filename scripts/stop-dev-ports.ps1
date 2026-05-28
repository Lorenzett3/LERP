$ports = @(3000, 4200)

foreach ($port in $ports) {
  $processIds = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique

  foreach ($processId in $processIds) {
    if ($processId -and $processId -ne $PID) {
      Write-Host "Stopping process $processId on port $port"
      Stop-Process -Id $processId -Force
    }
  }
}
