# Forward WSL2 ports to host machine/platform (handles Windows Firewall)
#
# NOTE: 'iex' is a shortform for 'Invoke-Expression'

# Ports that should be forwarded to WSL2 and allowed through firewall (comma-separated)
$ports = @(8081);

# WSL IP address changes whenever WSL restarts
$wsl_ip = $(wsl hostname -I).Trim();

# Incoming requests from any IP should be matched
$listen_all_ips = '0.0.0.0';

if ( -Not $wsl_ip ) {
  Write-Output "IP address for WSL 2 cannot be found";
  exit;
}

Write-Output "WSL IP: '$wsl_ip'";

### Windows Firewall #####

$firewall_rule = "WSL2 Forwarded Ports";
$firewall_ports = $ports -join ",";

# Remove existing firewal rule (will error if not already present; can ignore)
iex "Remove-NetFireWallRule -DisplayName '$firewall_rule' ";

# Allow Expo ports through Windows Firewall
iex "New-NetFireWallRule -DisplayName '$firewall_rule' -Direction Inbound -LocalPort $firewall_ports -Action Allow -Protocol TCP;"
iex "New-NetFireWallRule -DisplayName '$firewall_rule' -Direction Outbound -LocalPort $firewall_ports -Action Allow -Protocol TCP;"

### WSL Port Proxy #####

# Show all previously proxied ports
iex "netsh interface portproxy show v4tov4"

# Configure port forwarding (via remove/add)
for ( $i = 0; $i -lt $ports.length; $i++ ) {
  $port = $ports[$i];
  # Remove previously proxied port
  iex "netsh interface portproxy delete v4tov4 listenport=$port listenaddress=$listen_all_ips"
  iex "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$listen_all_ips connectport=$port connectaddress=$wsl_ip"
}

# Show all newly proxied ports
iex "netsh interface portproxy show v4tov4"

cmd /c pause